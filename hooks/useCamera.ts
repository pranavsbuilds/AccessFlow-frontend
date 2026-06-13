'use client';

import { useEffect, useRef, useState } from 'react';
import { getMediaErrorMessage } from '@/lib/mediaErrors';

interface UseCameraResult {
  stream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  error: string | null;
  isReady: boolean;
}

export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function acquire() {
      try {
        const nextStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
        });

        if (cancelled) {
          nextStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = nextStream;
        setStream(nextStream);
        setIsReady(true);
        setError(null);
      } catch (err) {
        if (cancelled) return;

        setError(getMediaErrorMessage('camera', err));
        setIsReady(false);
      }
    }

    acquire();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!stream || !video || video.srcObject) return;

    video.srcObject = stream;
    video.play().catch(() => {
      // Autoplay can be briefly blocked; the stream is still valid.
    });
  }, [stream]);

  return { stream, videoRef, error, isReady };
}
