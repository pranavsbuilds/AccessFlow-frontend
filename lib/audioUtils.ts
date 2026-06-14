/**
 * audioUtils.ts — pure DSP helpers for the audio pipeline.
 * No browser APIs — these can be unit-tested in Node.
 */

/**
 * Downsample a Float32Array from inputRate to outputRate (default 16kHz).
 * Uses simple decimation — sufficient for speech recognition.
 */
export function downsampleBuffer(
  buffer: Float32Array,
  inputRate: number,
  outputRate = 16000
): Float32Array {
  if (inputRate === outputRate) return buffer;
  const ratio = inputRate / outputRate;
  const outputLength = Math.floor(buffer.length / ratio);
  const output = new Float32Array(outputLength);
  for (let i = 0; i < outputLength; i++) {
    // Simple decimation — sufficient for speech
    output[i] = buffer[Math.floor(i * ratio)];
  }
  return output;
}

/**
 * Convert Float32Array PCM samples (range -1 to 1) to Int16Array (range -32768 to 32767).
 * This is the format the backend WebSocket expects.
 */
export function float32ToInt16(buffer: Float32Array): Int16Array {
  const output = new Int16Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    const clamped = Math.max(-1, Math.min(1, buffer[i]));
    output[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
  }
  return output;
}
