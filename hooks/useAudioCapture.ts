'use client';

import { useRef, useCallback } from 'react';
import { downsampleBuffer, float32ToInt16 } from '@/lib/audioUtils';

/**
 * useAudioCapture — wires AudioContext + AudioWorklet + PCM conversion pipeline.
 *
 * Per the implementation plan:
 * - A new AudioContext is created on each call to startCapture (one per question).
 * - The worklet runs at the device's native sample rate, then we downsample to 16kHz.
 * - Do NOT connect the worklet node to destination — we don't want audio playback.
 * - stopCapture() must be called in the orchestrator's lastResponse effect.
 */
export function useAudioCapture(onChunk: (chunk: Int16Array) => void) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const startCapture = useCallback(async (stream: MediaStream): Promise<void> => {
    // AudioContext per question, not per session.
    // Specifying sampleRate: 16000 lets the browser natively downmix and resample
    // with high-quality anti-aliasing filters in its hardware layer.
    const ctx = new AudioContext({ sampleRate: 16000 });
    audioCtxRef.current = ctx;

    await ctx.audioWorklet.addModule('/audioWorklet.js');

    const source = ctx.createMediaStreamSource(stream);
    sourceNodeRef.current = source;

    const worklet = new AudioWorkletNode(ctx, 'pcm-processor');
    workletNodeRef.current = worklet;

    worklet.port.onmessage = (e: MessageEvent<Float32Array>) => {
      // Already at 16kHz mono thanks to AudioContext native resampling
      const int16 = float32ToInt16(e.data);
      onChunk(int16);
    };

    source.connect(worklet);
    // Do NOT connect worklet to destination — we don't want audio playback
  }, [onChunk]);

  const stopCapture = useCallback((): void => {
    sourceNodeRef.current?.disconnect();
    workletNodeRef.current?.disconnect();
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    workletNodeRef.current = null;
    sourceNodeRef.current = null;
  }, []);

  return { startCapture, stopCapture };
}
