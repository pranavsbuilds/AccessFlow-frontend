'use client';

import { useRef, useCallback, useState } from 'react';
import { InterviewWebSocket } from '@/lib/websocket';
import { WS_INTERVIEW_STREAM } from '@/lib/constants';

interface WSResponse {
  transcript: string;
  score: number;
  text: string[];
}

interface WSIncomingMessage {
  transcript?: string;
  text?: string | string[];
  score?: number;
  final?: boolean;
  is_final?: boolean;
  isFinal?: boolean;
  partial?: boolean;
}

function normalizeTranscript(data: WSIncomingMessage): string {
  if (typeof data.transcript === 'string') return data.transcript;
  if (Array.isArray(data.text)) return data.text.join(' ');
  if (typeof data.text === 'string') return data.text;
  return '';
}

function isFinalMessage(data: WSIncomingMessage): boolean {
  if (typeof data.is_final === 'boolean') return data.is_final;
  if (typeof data.isFinal === 'boolean') return data.isFinal;
  if (typeof data.final === 'boolean') return data.final;
  if (typeof data.partial === 'boolean') return !data.partial;
  return true;
}

/**
 * useWebSocket — React hook wrapping InterviewWebSocket.
 *
 * lastResponse is the trigger for advancing the question.
 * The interview orchestrator watches it with a useEffect and fires
 * addResponse() when it changes.
 *
 * Important: one connection per question. The isRunning guard in the
 * orchestrator prevents opening a second socket for the same question.
 */
export function useWebSocket(sessionId: string | null) {
  const wsRef = useRef<InterviewWebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastResponse, setLastResponse] = useState<WSResponse | null>(null);
  const [liveTranscript, setLiveTranscript] = useState('');

  const connect = useCallback(async (): Promise<void> => {
    if (!sessionId) throw new Error('No sessionId — cannot open WebSocket');

    setLastResponse(null); // Clear previous question's response
    setLiveTranscript('');

    const token = typeof window !== 'undefined' ? localStorage.getItem('si_token') : '';

    const ws = new InterviewWebSocket(
      WS_INTERVIEW_STREAM(token || ''),
      (data: WSIncomingMessage) => {
        const text = normalizeTranscript(data);
        if (text) {
          setLiveTranscript(text);
        }

        if (isFinalMessage(data)) {
          setLastResponse({
            transcript: text,
            score: data.score ?? 0,
            text: [text],
          });
          setIsConnected(false);
        }
      },
      (err) => {
        console.error('WS error:', err);
        setIsConnected(false);
      },
      (closeEvent) => {
        console.log('WS closed:', closeEvent);
        setIsConnected(false);
      }
    );

    wsRef.current = ws;
    await ws.connect();
    setIsConnected(true);
  }, [sessionId]);

  const sendBinary = useCallback((chunk: Int16Array): void => {
    wsRef.current?.sendBinary(chunk.buffer as ArrayBuffer);
  }, []);

  const disconnect = useCallback((): void => {
    wsRef.current?.close();
    wsRef.current = null;
    setIsConnected(false);
  }, []);

  const clearResponse = useCallback((): void => {
    setLastResponse(null);
  }, []);

  return { connect, disconnect, clearResponse, sendBinary, isConnected, lastResponse, liveTranscript };
}
