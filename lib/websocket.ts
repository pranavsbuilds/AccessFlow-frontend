/**
 * websocket.ts — low-level WebSocket class for the interview audio stream.
 *
 * One socket per question, opened after TTS ends, closed (or naturally
 * timed out by backend after 5s silence) when the answer is complete.
 * Never open two WebSocket connections for the same question.
 */

type MessageHandler = (data: { transcript: string; score: number; text: string[] }) => void;
type ErrorHandler = (error: Event) => void;
type CloseHandler = (event: CloseEvent) => void;

export class InterviewWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private onMessage: MessageHandler;
  private onError: ErrorHandler;
  private onClose: CloseHandler;

  constructor(url: string, onMessage: MessageHandler, onError: ErrorHandler, onClose: CloseHandler) {
    this.url = url;
    this.onMessage = onMessage;
    this.onError = onError;
    this.onClose = onClose;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);
      this.ws.binaryType = 'arraybuffer';

      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => {
        this.onError(e);
        reject(e);
      };
      this.ws.onclose = (e) => {
        this.onClose(e);
      };
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string);
          this.onMessage(data);
        } catch {
          console.error('WS: failed to parse message', event.data);
        }
      };
    });
  }

  sendBinary(buffer: ArrayBuffer): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(buffer);
    }
  }

  close(): void {
    this.ws?.close();
    this.ws = null;
  }

  get isOpen(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
