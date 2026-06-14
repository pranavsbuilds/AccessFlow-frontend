'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useInterviewStore } from '@/store/interviewStore';
import { useCamera } from '@/hooks/useCamera';
import { useMicrophone } from '@/hooks/useMicrophone';
import { useGazeTracker } from '@/hooks/useGazeTracker';
import { useObjectDetector } from '@/hooks/useObjectDetector';
import { useInterviewOrchestrator } from '@/hooks/useInterviewOrchestrator';
import { WebcamFeed } from '@/components/interview/WebcamFeed';
import { QuestionDisplay } from '@/components/interview/QuestionDisplay';
import { RecordingIndicator } from '@/components/interview/RecordingIndicator';
import { DistractionBanner } from '@/components/interview/DistractionBanner';
import { drawGazeOverlay, drawCheatBorder } from '@/lib/canvasUtils';
import { TOTAL_QUESTIONS } from '@/lib/constants';

/**
 * InterviewPage — Week 4 final version.
 *
 * Full-screen two-column desktop layout:
 *   Left panel:  live webcam canvas (with gaze + YOLO overlays)
 *   Right panel: question display, phase status, recording indicator
 *
 * Unified rAF loop: video → canvas draw + gaze overlay + cheat border + YOLO scan tick.
 * All hooks wired: camera, mic, gaze tracker, YOLO object detector, interview orchestrator.
 */
export default function InterviewPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const sessionId  = useInterviewStore((s) => s.sessionId);
  const questions  = useInterviewStore((s) => s.questions);
  const currentIndex = useInterviewStore((s) => s.currentQuestionIndex);

  // Redirect if no session or no questions loaded
  useEffect(() => {
    if (!sessionId || questions.length === 0) {
      router.replace('/setup');
    }
  }, [sessionId, questions, router]);

  if (!sessionId || questions.length === 0) return null;

  return <InterviewScreen canvasRef={canvasRef} sessionId={sessionId} questions={questions} currentIndex={currentIndex} />;
}

/**
 * Separate client component so hooks only run after guard passes.
 */
function InterviewScreen({
  canvasRef,
  sessionId,
  questions,
  currentIndex,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  sessionId: string;
  questions: string[];
  currentIndex: number;
}) {
  // Media streams
  const { videoRef, stream: cameraStream } = useCamera();
  const { stream: micStream } = useMicrophone(false); // Disable level meter to prevent excessive re-renders

  // Gaze landmarks ref — populated by useGazeTracker callback for canvas overlay
  const landmarksRef = useRef<Array<{ x: number; y: number; z: number }> | null>(null);

  // Week 4: gaze + object detection
  const { isDistracted, distractionStartTime } = useGazeTracker(videoRef, sessionId, landmarksRef, cameraStream);
  const { detectedObjects, scanFrame } = useObjectDetector(videoRef, sessionId);

  // Week 3: interview orchestration (audio pipeline + WS + TTS)
  const { interviewPhase } = useInterviewOrchestrator(micStream);

  // Unified rAF loop: video → canvas + overlays + YOLO scan
  useEffect(() => {
    let animId: number;

    const loop = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (canvas && video && video.readyState >= 2) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // 1. Draw base video frame
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // 2. Draw gaze overlay (iris dots)
          if (landmarksRef.current) {
            drawGazeOverlay(ctx, landmarksRef.current, canvas.width, canvas.height);
          }

          // 3. Draw cheat border if phone/laptop detected
          if (detectedObjects.length > 0) {
            drawCheatBorder(ctx, canvas.width, canvas.height);
          }
        }
      }

      // 4. YOLO scan tick — runs inference every 20th frame
      scanFrame();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [cameraStream, detectedObjects, scanFrame]);

  return (
    <div className="interview-layout">
      {/* Distraction banner — slides in from top via Framer Motion */}
      <DistractionBanner
        isVisible={isDistracted}
        distractionStartTime={distractionStartTime}
      />

      {/* Left panel: webcam feed */}
      <div className="interview-left">
        <WebcamFeed canvasRef={canvasRef} videoRef={videoRef} detectedObjects={detectedObjects} />

        {/* Session info strip */}
        <div className="session-strip">
          <span className="session-id-label">
            SID: <code>{sessionId.slice(0, 8)}…</code>
          </span>
          <span className={`session-phase-dot session-phase-dot--${interviewPhase}`} />
          <span className="session-phase-text">{interviewPhase.toUpperCase()}</span>
        </div>
      </div>

      {/* Right panel: question + status */}
      <div className="interview-right">
        {/* Top: logo / branding */}
        <div className="interview-header">
          <span className="interview-brand">Smart Interviewer</span>
          <span className="interview-progress-label">
            {currentIndex + 1} / {TOTAL_QUESTIONS}
          </span>
        </div>

        {/* Main: question display */}
        <div className="interview-main">
          <QuestionDisplay
            questionNumber={currentIndex + 1}
            totalQuestions={TOTAL_QUESTIONS}
            questionText={questions[currentIndex] ?? ''}
            phase={interviewPhase}
          />

          {/* Recording indicator — only visible while listening */}
          {interviewPhase === 'listening' && <RecordingIndicator />}
        </div>

        {/* Bottom: cheating count */}
        <div className="interview-footer">
          <CheatingCount />
        </div>
      </div>
    </div>
  );
}

function CheatingCount() {
  const cheatingCount = useInterviewStore((s) => s.cheatingCount);
  if (cheatingCount === 0) return null;
  return (
    <div className="cheat-count">
      <span className="cheat-icon">⚠</span>
      <span>{cheatingCount} flag{cheatingCount !== 1 ? 's' : ''} recorded</span>
    </div>
  );
}
