/**
 * yoloWorker.ts — ONNX Runtime Web Worker for YOLO11n inference.
 *
 * Runs entirely off the main thread. Loaded once per worker lifetime (singleton session).
 * Receives ImageData from the interview page rAF loop every YOLO_FRAME_INTERVAL frames.
 * Returns detected COCO class IDs (filtered to phone=67, laptop=63 only).
 *
 * Output tensor format confirmed: [1, 84, 8400]
 * 84 = 4 box coords (cx, cy, w, h) + 80 COCO class scores
 * Layout is [batch, channels, detections] — must transpose for parsing.
 */

import * as ort from 'onnxruntime-web';
import { COCO_PHONE_CLASS, COCO_LAPTOP_CLASS, YOLO_INPUT_SIZE } from '@/lib/constants';

let session: ort.InferenceSession | null = null;

// Singleton load — only loads once per worker lifetime
async function getSession(): Promise<ort.InferenceSession> {
  if (session) return session;
  session = await ort.InferenceSession.create('/models/yolo11n.onnx', {
    executionProviders: ['wasm'],
  });
  return session;
}

// Output format confirmed: [1, 84, 8400]
// 84 = 4 box coords (cx, cy, w, h) + 80 COCO class scores
// Layout is [batch, channels, detections] — need to transpose for parsing
function parseDetections(
  output: Float32Array,
  confThreshold = 0.45
): number[] {
  const numDetections = 8400;
  const detected = new Set<number>();
  const targetClasses = [COCO_PHONE_CLASS, COCO_LAPTOP_CLASS];

  for (let i = 0; i < numDetections; i++) {
    let maxScore = 0;
    let maxClass = -1;
    for (let c = 0; c < 80; c++) {
      // Transposed indexing: class scores start at offset 4 * numDetections
      const score = output[(4 + c) * numDetections + i];
      if (score > maxScore) {
        maxScore = score;
        maxClass = c;
      }
    }
    if (maxScore >= confThreshold && targetClasses.includes(maxClass)) {
      detected.add(maxClass);
    }
  }
  return [...detected];
}

self.onmessage = async (e: MessageEvent<{ imageData: ImageData }>) => {
  const sess = await getSession();
  const { imageData } = e.data;
  const { data, width, height } = imageData;

  // Convert RGBA to RGB CHW float32 normalised [0, 1]
  const input = new Float32Array(3 * width * height);
  for (let i = 0; i < data.length; i += 4) {
    const px = i / 4;
    input[px]                     = data[i]     / 255; // R plane
    input[px + width * height]     = data[i + 1] / 255; // G plane
    input[px + 2 * width * height] = data[i + 2] / 255; // B plane
  }

  const tensor = new ort.Tensor('float32', input, [1, 3, height, width]);
  const results = await sess.run({ images: tensor });
  const outputKey = Object.keys(results)[0];
  const outputData = results[outputKey].data as Float32Array;

  const detectedClasses = parseDetections(outputData);
  self.postMessage({ detectedClasses });
};

// Required for YOLO_INPUT_SIZE usage without unused-var lint error
void YOLO_INPUT_SIZE;
