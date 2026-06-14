'use client';

import { useEffect, useRef, useState } from 'react';
import { getMediaErrorMessage } from '@/lib/mediaErrors';

interface UseMicrophoneResult {
  stream: MediaStream | null;
  audioLevel: number;
  error: string | null;
  isReady: boolean;
}

export function useMicrophone(enableLevelMeter = true): UseMicrophoneResult {
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function acquire() {
      try {
        const nextStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
          },
        });

        if (cancelled) {
          nextStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = nextStream;
        setStream(nextStream);

        if (!enableLevelMeter) {
          setIsReady(true);
          setError(null);
          return;
        }

        const audioContext = new AudioContext();
        audioCtxRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;

        const source = audioContext.createMediaStreamSource(nextStream);
        source.connect(analyser);

        setIsReady(true);
        setError(null);

        const dataArray = new Uint8Array(analyser.fftSize);
        function tick() {
          if (cancelled) return;

          analyser.getByteTimeDomainData(dataArray);

          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const normalized = (dataArray[i] - 128) / 128;
            sum += normalized * normalized;
          }

          const rms = Math.sqrt(sum / dataArray.length);
          setAudioLevel(Math.min(100, Math.round(rms * 250)));
          rafRef.current = requestAnimationFrame(tick);
        }

        tick();
      } catch (err) {
        if (cancelled) return;

        setError(getMediaErrorMessage('microphone', err));
        setIsReady(false);
      }
    }

    acquire();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audioCtxRef.current?.close();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [enableLevelMeter]);

  return { stream, audioLevel, error, isReady };
}
