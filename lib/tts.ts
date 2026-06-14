/**
 * tts.ts — Text-to-speech wrapper.
 *
 * Must be in its own file, not inlined in the orchestrator.
 * Returns a Promise that resolves when the utterance finishes.
 * Calls window.speechSynthesis.cancel() first to clear any queued utterance.
 */
export const speak = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      reject(new Error('SpeechSynthesis not supported'));
      return;
    }
    window.speechSynthesis.cancel(); // clear any queued utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    window.speechSynthesis.speak(utterance);
  });
};
