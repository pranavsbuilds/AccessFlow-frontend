'use client';

import { useEffect, useRef, useCallback, useState, RefObject } from 'react';
import { YOLO_FRAME_INTERVAL, YOLO_INPUT_SIZE } from '@/lib/constants';
import { useSession } from './useSession';
import { useInterviewStore } from '@/store/interviewStore';

/**
 * useObjectDetector — YOLO11n phone/laptop detection via Web Worker.
 *
 * Spawns the worker once per mount, terminates on unmount.
 * scanFrame() is called inside the unified rAF loop from the interview page.
 * Runs inference every YOLO_FRAME_INTERVAL frames (~650ms at 30fps).
 * flagSession is fire-and-forget per implementation plan spec.
 * Transfer uses zero-copy ImageData buffer transfer.
 */
export function useObjectDetector(
  videoRef: RefObject<HTMLVideoElement | null>,
  sessionId: string | null
) {
  const { flagSession } = useSession();
  const incrementCheating = useInterviewStore((s) => s.incrementCheating);
  const [detectedObjects, setDetectedObjects] = useState<number[]>([]);
  const [objectFlagCount, setObjectFlagCount] = useState(0);
  const workerRef = useRef<Worker | null>(null);
  const frameCountRef = useRef(0);
  const offscreenCanvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Spawn the worker
    workerRef.current = new Worker(
      new URL('../workers/yoloWorker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e: MessageEvent<{ detectedClasses: number[] }>) => {
      const { detectedClasses } = e.data;
      if (detectedClasses.length > 0) {
        setDetectedObjects(detectedClasses);
        setObjectFlagCount((count) => count + 1);
        incrementCheating();
        if (sessionId) {
          // flagSession is fire-and-forget — not awaited in the hot path
          flagSession(sessionId).catch(console.error);
        }
      } else {
        setDetectedObjects([]);
      }
    };

    // Reuse a single offscreen canvas for captures
    offscreenCanvas.current = document.createElement('canvas');
    offscreenCanvas.current.width = YOLO_INPUT_SIZE;
    offscreenCanvas.current.height = YOLO_INPUT_SIZE;

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [flagSession, incrementCheating, sessionId]);

  // Called inside the rAF loop from the interview page
  const scanFrame = useCallback(() => {
    frameCountRef.current++;
    if (frameCountRef.current % YOLO_FRAME_INTERVAL !== 0) return;
    if (!videoRef.current || !workerRef.current || !offscreenCanvas.current) return;

    const ctx = offscreenCanvas.current.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, YOLO_INPUT_SIZE, YOLO_INPUT_SIZE);
    const imageData = ctx.getImageData(0, 0, YOLO_INPUT_SIZE, YOLO_INPUT_SIZE);

    // Transfer the buffer to the worker — zero-copy, no serialization overhead
    workerRef.current.postMessage({ imageData }, [imageData.data.buffer]);
  }, [videoRef]);

  return { detectedObjects, objectFlagCount, scanFrame };
}
