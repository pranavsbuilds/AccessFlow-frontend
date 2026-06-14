'use client';

import { useEffect, useRef, RefObject } from 'react';
import { useCamera } from '@/hooks/useCamera';

interface WebcamFeedProps {
  /**
   * Optional external canvasRef — pass this from the interview page so the
   * unified rAF loop (which also runs YOLO scanFrame) can draw to the same canvas.
   */
  canvasRef: RefObject<HTMLCanvasElement | null>;
  /**
   * External videoRef passed from the parent which manages the camera lifecycle.
   */
  videoRef: RefObject<HTMLVideoElement | null>;
  /**
   * Week 4: canvas overlay callbacks. landmarks and detectedObjects
   * are passed down from the interview page once Week 4 hooks are wired.
   */
  landmarks?: unknown;
  detectedObjects?: number[];
}

/**
 * WebcamFeed — Week 4 version.
 *
 * The <video> is hidden; the <canvas> is what the user sees.
 * The drawing loop is owned by the parent page component using the shared videoRef.
 */
export function WebcamFeed({ canvasRef, videoRef, detectedObjects = [] }: WebcamFeedProps) {
  return (
    <div className="webcam-container">
      {/* Hidden video element — canvas is what the user sees */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ display: 'none' }}
      />
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="webcam-canvas"
      />
    </div>
  );
}
