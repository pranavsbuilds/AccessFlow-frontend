/**
 * canvasUtils.ts — pure canvas drawing functions for interview overlays.
 *
 * Pure functions — no React, no browser APIs beyond CanvasRenderingContext2D.
 * Easier to test and keeps WebcamFeed.tsx clean.
 */

type Landmark = { x: number; y: number; z: number };

/**
 * Draw a subtle gaze overlay on the canvas.
 * Renders only the iris positions as small circles — intentionally minimal
 * so the candidate isn't distracted by their own landmark overlay.
 *
 * Iris landmark indices (MediaPipe): 468 (left), 473 (right)
 */
export function drawGazeOverlay(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  canvasWidth: number,
  canvasHeight: number
): void {
  if (!landmarks || landmarks.length < 478) return;

  const leftIris  = landmarks[468];
  const rightIris = landmarks[473];

  ctx.save();
  ctx.fillStyle = 'rgba(126, 252, 157, 0.75)'; // phosphor green
  ctx.shadowColor = 'rgba(126, 252, 157, 0.5)';
  ctx.shadowBlur = 6;

  // Left iris dot
  ctx.beginPath();
  ctx.arc(
    leftIris.x * canvasWidth,
    leftIris.y * canvasHeight,
    4, 0, Math.PI * 2
  );
  ctx.fill();

  // Right iris dot
  ctx.beginPath();
  ctx.arc(
    rightIris.x * canvasWidth,
    rightIris.y * canvasHeight,
    4, 0, Math.PI * 2
  );
  ctx.fill();

  ctx.restore();
}

/**
 * Draw a red warning border on the canvas when a prohibited object is detected.
 * Called every frame while detectedObjects.length > 0.
 */
export function drawCheatBorder(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
): void {
  ctx.save();
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.90)';
  ctx.lineWidth = 8;
  ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
  ctx.shadowBlur = 16;
  ctx.strokeRect(4, 4, canvasWidth - 8, canvasHeight - 8);
  ctx.restore();
}
