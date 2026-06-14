/**
 * audioWorklet.js — runs on the audio thread, no imports allowed.
 *
 * Accumulates browser audio frames (typically 128 samples each) into
 * 1024-frame chunks, then posts each chunk to the main thread.
 * 1024 frames at 16kHz = ~64ms per chunk — the format Vosk expects.
 */
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = [];
    this._chunkSize = 1024; // confirmed: 1024 frames per chunk
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;

    // Downmix to mono: average all channels
    const channelCount = input.length;
    const frameCount = input[0].length;
    const mono = new Float32Array(frameCount);
    for (let c = 0; c < channelCount; c++) {
      for (let i = 0; i < frameCount; i++) {
        mono[i] += input[c][i] / channelCount;
      }
    }

    // Accumulate until we have exactly 1024 frames, then emit
    for (let i = 0; i < mono.length; i++) {
      this._buffer.push(mono[i]);
      if (this._buffer.length >= this._chunkSize) {
        this.port.postMessage(new Float32Array(this._buffer.splice(0, this._chunkSize)));
      }
    }
    return true;
  }
}

registerProcessor('pcm-processor', PCMProcessor);
