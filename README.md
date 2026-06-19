# Smart Interviewer Frontend 🚀

Hey team! This is the Next.js frontend for our Smart Interview platform. 

## What's in here?

This repo handles the UI for taking our AI-driven technical interviews. It hooks up directly to our backend to pull in questions (via QuizAPI), manage the interview state, grab user audio, and render out the final feedback and clustering results.

## Quick Start

To get this running locally, just fire up the dev server:

```bash
npm run dev
# or yarn dev / pnpm dev / bun dev
```

Then hit up [http://localhost:3001](http://localhost:3001) in your browser.

## Heads Up
- **Job & Difficulty Picker**: Make sure you test the flow for different roles and difficulties.
- **Audio Recording**: The browser will ask for mic permissions. We capture the audio here and shoot it over to the backend's Vosk STT service.
- **Results View**: This is where we show the SBERT scoring and KMeans feedback we get back from the backend.

Let me know if you run into any weird UI bugs or if the socket connection to the backend gets flaky!
