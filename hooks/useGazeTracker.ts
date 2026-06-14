'use client';

import { useEffect, useRef, useState, useCallback, RefObject } from 'react';
import {
  GAZE_LEFT_THRESHOLD,
  GAZE_RIGHT_THRESHOLD,
  DISTRACTION_TIMEOUT_MS,
} from '@/lib/constants';
import { useSession } from './useSession';
import { useInterviewStore } from '@/store/interviewStore';

// Landmark indices — per implementation plan, matching the backend Python implementation exactly
const LEFT_EYE_OUTER  = 33;
const LEFT_EYE_INNER  = 133;
const LEFT_IRIS       = 468;
const RIGHT_EYE_INNER = 362;
const RIGHT_EYE_OUTER = 263;
const RIGHT_IRIS      = 473;

/**
 * useGazeTracker — runs MediaPipe Face Mesh every 2nd animation frame.
 *
 * @mediapipe/face_mesh is a CJS/UMD module; FaceMesh is loaded via dynamic
 * import inside useEffect to avoid Turbopack static-analysis errors.
 *
 * When gaze leaves the acceptable range, a 3-second countdown starts.
 * If gaze returns within 3 seconds, the timer cancels.
 * If 3 seconds expire → flag fires (POST /flag) + incrementCheating.
 *
 * flagSession is fire-and-forget — not awaited in the hot path (per spec).
 */
export function useGazeTracker(
  videoRef: RefObject<HTMLVideoElement | null>,
  sessionId: string | null,
  landmarksRef?: RefObject<Array<{ x: number; y: number; z: number }> | null>,
  stream?: MediaStream | null
) {
  const { flagSession } = useSession();
  const incrementCheating = useInterviewStore((s) => s.incrementCheating);

  const [isDistracted, setIsDistracted] = useState(false);
  const [penaltyCount, setPenaltyCount] = useState(0);
  const [distractionStartTime, setDistractionStartTime] = useState<number | null>(null);

  const distractionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameCountRef = useRef(0);

  const triggerDistraction = useCallback(() => {
    setIsDistracted(true);
    if (distractionTimerRef.current) return; // already counting
    setDistractionStartTime(Date.now());
    distractionTimerRef.current = setTimeout(() => {
      // 3 seconds elapsed without gaze recovery — fire the penalty
      setPenaltyCount((c) => c + 1);
      incrementCheating();
      if (sessionId) {
        // flagSession is fire-and-forget per implementation plan
        flagSession(sessionId).catch(console.error);
      }
      distractionTimerRef.current = null;
      setDistractionStartTime(null);
    }, DISTRACTION_TIMEOUT_MS);
  }, [sessionId, incrementCheating, flagSession]);

  const cancelDistraction = useCallback(() => {
    setIsDistracted(false);
    setDistractionStartTime(null);
    if (distractionTimerRef.current) {
      clearTimeout(distractionTimerRef.current);
      distractionTimerRef.current = null;
    }
  }, []);

  const handleGazeResult = useCallback(
    (results: { multiFaceLandmarks?: Array<Array<{ x: number; y: number; z: number }>> }) => {
      if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
        if (landmarksRef) {
          landmarksRef.current = null;
        }
        triggerDistraction();
        return;
      }

      const landmarks = results.multiFaceLandmarks[0];
      if (landmarksRef) {
        landmarksRef.current = landmarks;
      }

      const leftEyeOuter  = landmarks[LEFT_EYE_OUTER];
      const leftEyeInner  = landmarks[LEFT_EYE_INNER];
      const leftIris      = landmarks[LEFT_IRIS];
      const rightEyeInner = landmarks[RIGHT_EYE_INNER];
      const rightEyeOuter = landmarks[RIGHT_EYE_OUTER];
      const rightIris     = landmarks[RIGHT_IRIS];

      const leftWidth  = Math.abs(leftEyeInner.x - leftEyeOuter.x);
      const rightWidth = Math.abs(rightEyeOuter.x - rightEyeInner.x);

      const leftRatioX  = (leftEyeInner.x - leftIris.x) / Math.max(leftWidth, 0.001);
      const rightRatioX = (rightEyeInner.x - rightIris.x) / Math.max(rightWidth, 0.001);

      const lookingCenter =
        GAZE_LEFT_THRESHOLD <= leftRatioX && leftRatioX <= GAZE_RIGHT_THRESHOLD &&
        GAZE_LEFT_THRESHOLD <= rightRatioX && rightRatioX <= GAZE_RIGHT_THRESHOLD;

      if (lookingCenter) {
        cancelDistraction();
      } else {
        triggerDistraction();
      }
    },
    [triggerDistraction, cancelDistraction, landmarksRef]
  );

  useEffect(() => {
    if (!videoRef.current) return;

    let animId: number;
    let faceMesh: { send: (args: { image: HTMLVideoElement }) => Promise<void>; close: () => void } | null = null;

    // Dynamic import avoids Turbopack static-analysis errors on the CJS module
    import('@mediapipe/face_mesh').then((mp) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const FaceMeshClass = (mp as any).FaceMesh;
      faceMesh = new FaceMeshClass({
        locateFile: (file: string) =>
          process.env.NODE_ENV === 'production'
            ? `/mediapipe/${file}`
            : `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (faceMesh as any).setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,  // REQUIRED — enables iris landmarks 468–477
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (faceMesh as any).onResults(handleGazeResult);

      const loop = async () => {
        frameCountRef.current++;
        // Sample every 2nd frame — sufficient for 3-second detection, less main-thread pressure
        if (frameCountRef.current % 2 === 0 && videoRef.current && faceMesh) {
          await faceMesh.send({ image: videoRef.current });
        }
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(animId);
      if (distractionTimerRef.current) clearTimeout(distractionTimerRef.current);
      faceMesh?.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, stream]);

  return { isDistracted, penaltyCount, distractionStartTime };
}
