# Smart Interviewer — AI Agent Routing Manifest
# Place this file at: smart-interviewer/CLAUDE.md (project root)
# Version: 1.0 | Generated: June 2026 | Covers: Weeks 1–5 full scope

@AGENTS.md

---

## ⚠️ CRITICAL: Read Before Writing Any Code

**This project runs Next.js 16.2.9 and React 19.2.4.**
These versions contain breaking API changes from earlier releases.
Before writing or modifying ANY Next.js or React code, read:
```
node_modules/next/dist/docs/
```
Do NOT assume APIs, file conventions, or router behaviour from training data.
Heed all deprecation notices.

---

## Project at a Glance

| Item | Value |
|---|---|
| Framework | Next.js 16.2.9 (App Router) |
| Language | TypeScript 5 — strict mode, zero `any` |
| Styling | Tailwind CSS v4 + CSS custom properties |
| State | Zustand v5 |
| HTTP | Axios v1 |
| Animations | Framer Motion v12 |
| Target | Desktop web, 1280px+ |
| Backend | FastAPI on `localhost:8000` (Docker, in progress) |
| Build status | Weeks 1–2 ✅ complete · Weeks 3–5 ⏳ pending |

---

## ABSOLUTE RULES — Never Violate These

1. **All endpoint strings live ONLY in `lib/constants.ts`.** Never write a URL, path, or WebSocket address in any other file. One-line swap when backend confirms routes.

2. **Never call the Quiz API from the frontend.** All question data arrives from FastAPI. No direct external API calls except to `localhost:8000`.

3. **Never import endpoints from anywhere other than `lib/constants.ts`.** Components, hooks, pages — all use constants.

4. **`"use client"` required** on any file that touches `window`, `navigator`, `AudioContext`, `WebSocket`, `MediaStream`, or `localStorage`.

5. **No implicit `any` types.** TypeScript strict mode is enforced. All shared interfaces live in `types/index.ts`.

6. **No `// @ts-ignore` comments.** Fix the type, don't suppress it.

7. **No hardcoded colours, fonts, or spacing.** Use CSS custom properties from `app/globals.css` (`--color-phosphor`, `--font-display`, etc.).

8. **Every cheat flag event (gaze penalty + YOLO detection) must call `flagSession()` AND `incrementCheating()`.** Never buffer or batch flag calls.

9. **`await speak(question)` before opening WebSocket.** TTS must finish before mic opens. This sequencing is non-negotiable.

10. **ONNX model loads lazily on `/interview` mount only.** Never load it at app startup.

---

## Task → File Routing Table

### Configuration & Constants

| Task | File(s) |
|---|---|
| Add or change any API endpoint URL | `lib/constants.ts` |
| Change WebSocket URL | `lib/constants.ts` → `WS_INTERVIEW_STREAM` |
| Change gaze threshold values | `lib/constants.ts` → `GAZE_LEFT_THRESHOLD`, `GAZE_RIGHT_THRESHOLD` |
| Change distraction timer duration | `lib/constants.ts` → `DISTRACTION_TIMEOUT_MS` |
| Change YOLO scan frequency | `lib/constants.ts` → `YOLO_FRAME_INTERVAL` |
| Change YOLO input resolution | `lib/constants.ts` → `YOLO_INPUT_SIZE` |
| Change audio sample rate or chunk size | `lib/constants.ts` → `AUDIO_SAMPLE_RATE`, `AUDIO_CHUNK_FRAMES` |
| Change cheat penalty value | `lib/constants.ts` → `CHEAT_PENALTY` |
| Change score pass threshold | `lib/constants.ts` → `SCORE_PASS_THRESHOLD` |
| Change number of interview questions | `lib/constants.ts` → `TOTAL_QUESTIONS` |
| Add or edit topic options | `lib/constants.ts` → `TOPICS` array |
| Add or edit motivational quotes | `lib/constants.ts` → `MOTIVATIONAL_QUOTES` array |
| Change COCO class IDs for detection | `lib/constants.ts` → `COCO_PHONE_CLASS`, `COCO_LAPTOP_CLASS` |

---

### Types & Interfaces

| Task | File(s) |
|---|---|
| Add a new shared TypeScript type | `types/index.ts` |
| Change session start request/response shape | `types/index.ts` → `StartSessionRequest`, `StartSessionResponse` |
| Change WebSocket message format | `types/index.ts` → `WebSocketMessage` |
| Change results response shape | `types/index.ts` → `SessionResults`, `QuestionResult` |
| Change question or response shape | `types/index.ts` → `Question`, `QuestionResponse` |
| Change cluster label values | `types/index.ts` → `ClusterLabel` |
| Add types for Week 3 audio pipeline | `types/index.ts` — add `AudioChunk`, `PCMConfig` |
| Add types for Week 4 YOLO detections | `types/index.ts` — add `YOLODetection` |

---

### Authentication & Identity

| Task | File(s) |
|---|---|
| Change how user identity is determined | `lib/auth.ts` — ONLY this file |
| Replace anonymous UUID with real auth | `lib/auth.ts` → replace `getAnonymousUid()` implementation |
| Clear stored user identity | `lib/auth.ts` → `clearUid()` |
| Understand current auth placeholder approach | `lib/auth.ts` (anonymous UUID via `crypto.randomUUID()`, persisted to `localStorage`) |

---

### REST API Calls

| Task | File(s) |
|---|---|
| Understand how REST calls are made | `lib/api.ts` |
| Change Axios base URL or timeout | `lib/api.ts` → `axios.create({...})` |
| Change session start request body | `lib/api.ts` → `startSession()` — field names `job` and `level` PENDING CONFIRMATION |
| Change flag endpoint call | `lib/api.ts` → `flagSession()` |
| Change results fetch | `lib/api.ts` → `getResults()` |
| Call a new REST endpoint | Add function to `lib/api.ts`, import constant from `lib/constants.ts` |

---

### Global State (Zustand)

| Task | File(s) |
|---|---|
| Read or write any session state | `store/interviewStore.ts` |
| Add a new state field | `store/interviewStore.ts` + `types/index.ts` → `InterviewStore` |
| Understand what state persists across screens | `store/interviewStore.ts` (in-memory only — no localStorage persistence yet) |
| Reset everything for "Try Again" | `store/interviewStore.ts` → `resetSession()` |
| Add a response to the session | `store/interviewStore.ts` → `addResponse()` |
| Record a cheat event | `store/interviewStore.ts` → `incrementCheating()` + call `flagSession()` in `lib/api.ts` |
| Store final score and cluster | `store/interviewStore.ts` → `setResults()` |

---

### Design System & Styling

| Task | File(s) |
|---|---|
| Change colour palette | `app/globals.css` → `@theme inline { ... }` block |
| Change fonts | `app/globals.css` → `--font-display`, `--font-body`, `--font-data` |
| Change global button styles | `app/globals.css` → `.btn-primary`, `.btn-ghost` |
| Change card appearance | `app/globals.css` → `.card` class |
| Add a new global animation | `app/globals.css` → add `@keyframes` |
| Change page background colour | `app/globals.css` → `--color-void` |
| Change accent/highlight colour | `app/globals.css` → `--color-phosphor` |
| Change text colours | `app/globals.css` → `--color-text-primary/secondary/disabled` |

> Design system uses CSS custom properties — always reference `var(--color-*)` and `var(--font-*)`, never hardcode hex values or font names in components.

---

### Screen 1 — Setup (`/setup`) ✅ Week 1 Complete

| Task | File(s) |
|---|---|
| Change setup page layout or server content | `app/setup/page.tsx` (SSR) |
| Change topic/difficulty form behaviour | `app/setup/SetupForm.tsx` (client) |
| Change topic card grid | `components/setup/TopicSelector.tsx` |
| Add or remove topics | `lib/constants.ts` → `TOPICS` array + `types/index.ts` → `Topic` union |
| Change difficulty buttons | `components/setup/DifficultyPicker.tsx` |
| Change motivational quote display | `components/setup/MotivationalQuote.tsx` (server component) |
| Change "Start Interview" button behaviour | `app/setup/SetupForm.tsx` → `handleStart()` |
| Change what happens after session is created | `app/setup/SetupForm.tsx` → `handleStart()` — navigates to `/check` |
| Change session start API call | `lib/api.ts` → `startSession()` + `lib/constants.ts` → `API_SESSION_START` |

---

### Screen 2 — Permission Check (`/check`) ✅ Week 2 Complete

| Task | File(s) |
|---|---|
| Change permission check page layout | `app/check/page.tsx` (client only) |
| Change camera permission request | `hooks/useCamera.ts` → `getUserMedia({video: ...})` |
| Change camera preview display | `components/check/CameraCheck.tsx` |
| Change camera error messages | `hooks/useCamera.ts` → error switch block |
| Change microphone permission request | `hooks/useMicrophone.ts` → `getUserMedia({audio: ...})` |
| Change audio level meter display | `components/check/MicCheck.tsx` |
| Change how audio level is calculated | `hooks/useMicrophone.ts` → RMS calculation in `tick()` |
| Change microphone error messages | `hooks/useMicrophone.ts` → error switch block |
| Change "Continue" button gate condition | `app/check/page.tsx` → `bothReady` condition |
| Add a third system check | `app/check/page.tsx` + new component in `components/check/` |

---

### Screen 3 — Live Interview (`/interview`) ⏳ Week 3–4 Pending

> These files do not exist yet. Create them when building Week 3–4.

| Task | File(s) to create |
|---|---|
| Interview page shell | `app/interview/page.tsx` — replace stub (client only) |
| Question display component | `components/interview/QuestionDisplay.tsx` |
| Recording indicator (pulse animation) | `components/interview/RecordingIndicator.tsx` |
| Webcam feed with canvas overlay | `components/interview/WebcamFeed.tsx` |
| Distraction warning banner | `components/interview/DistractionBanner.tsx` |
| TTS (speak questions aloud) | `lib/tts.ts` — `speak(text): Promise<void>` |
| AudioWorklet PCM processor | `public/audioWorklet.js` — `PCMProcessor` class |
| PCM downsample + Float32→Int16 helpers | `lib/audioUtils.ts` |
| 16kHz mono PCM capture hook | `hooks/useAudioCapture.ts` |
| WebSocket audio streaming hook | `hooks/useWebSocket.ts` |
| MediaPipe gaze tracking hook | `hooks/useGazeTracker.ts` |
| YOLO Web Worker (off main thread) | `workers/yoloWorker.ts` |
| YOLO object detector hook | `hooks/useObjectDetector.ts` |
| YOLO11n ONNX model file | `public/models/yolo11n.onnx` ← **provided by Uwais** |
| MediaPipe WASM (self-hosted) | `public/mediapipe/` ← download from npm package for production |

> **Key sequencing rule for interview orchestration:**
> ```
> await speak(question)   // TTS must fully finish
> ws.connect(...)          // then open socket
> startCapture(stream)     // then start recording
> ```

---

### Screen 4 — Results (`/results`) ⏳ Week 5 Pending

> These files do not exist yet. Create them when building Week 5.

| Task | File(s) to create |
|---|---|
| Results page | `app/results/page.tsx` — replace stub (SSR + hydration) |
| Animated score counter | `components/results/ScoreCard.tsx` |
| Cluster label badge | `components/results/ClusterBadge.tsx` |
| Per-question accordion | `components/results/QuestionBreakdown.tsx` |
| Wikipedia resource cards | `components/results/WikiLinks.tsx` |

> Results are fetched with `GET /api/interview/{sid}/results` from `lib/constants.ts` → `API_SESSION_RESULTS`.
> Backend pre-resolves Wikipedia links. No frontend Wikipedia API calls.

---

### Hooks Reference

| Hook | File | Status | Purpose |
|---|---|---|---|
| `useCamera` | `hooks/useCamera.ts` | ✅ Built | Camera stream, error handling, cleanup |
| `useMicrophone` | `hooks/useMicrophone.ts` | ✅ Built | Mic stream, RMS level metering (for `/check` only) |
| `useSession` | `hooks/useSession.ts` | ✅ Built | REST wrappers: startSession, flagSession, getResults |
| `useAudioCapture` | `hooks/useAudioCapture.ts` | ⏳ Week 3 | AudioWorklet, 16kHz PCM, 1024-frame chunks |
| `useWebSocket` | `hooks/useWebSocket.ts` | ⏳ Week 3 | Binary send, JSON receive, reconnect logic |
| `useGazeTracker` | `hooks/useGazeTracker.ts` | ⏳ Week 4 | MediaPipe Face Mesh, iris landmarks 468–477, 3s timer |
| `useObjectDetector` | `hooks/useObjectDetector.ts` | ⏳ Week 4 | Communicates with yoloWorker, COCO class filter |

---

### Audio Pipeline (Week 3)

| Task | File(s) |
|---|---|
| PCM audio processing on audio thread | `public/audioWorklet.js` → `PCMProcessor` |
| Downsample browser rate → 16kHz | `lib/audioUtils.ts` → `downsampleBuffer()` |
| Convert Float32 to Int16 for Vosk | `lib/audioUtils.ts` → `float32ToInt16()` |
| Start/stop 16kHz capture | `hooks/useAudioCapture.ts` → `startCapture()`, `stopCapture()` |
| Send PCM chunk over WebSocket | `hooks/useWebSocket.ts` → `sendBinary(chunk.buffer)` |

> Audio format confirmed: 16kHz, mono, raw PCM, 1024 frames/chunk (~64ms). `MediaRecorder` must NOT be used — it outputs encoded WebM/Opus, not raw PCM.

---

### Computer Vision (Week 4)

| Task | File(s) |
|---|---|
| Run YOLO11n inference | `workers/yoloWorker.ts` (runs in Web Worker, NOT main thread) |
| Post frames to YOLO worker | `hooks/useObjectDetector.ts` → `scanFrame()` every 20th frame |
| Parse YOLO output | `workers/yoloWorker.ts` → `parseDetections()` — format: `[1, 84, 8400]` |
| Run MediaPipe Face Mesh | `hooks/useGazeTracker.ts` — sample every 2nd rAF tick |
| Compute gaze ratio | `hooks/useGazeTracker.ts` — iris landmarks 468 (left), 473 (right) |
| Penalty timer logic | `hooks/useGazeTracker.ts` — 3000ms timer → POST flag + incrementCheating() |
| Draw face landmarks on screen | `components/interview/WebcamFeed.tsx` — `<canvas>` over `<video>` |
| Draw YOLO bounding boxes | `components/interview/WebcamFeed.tsx` — same canvas layer |

> **YOLO runs in a Web Worker.** Never run ONNX inference on the main thread. Use `workers/yoloWorker.ts` via `new Worker(new URL('../workers/yoloWorker.ts', import.meta.url), { type: 'module' })`.

---

### Root & Config Files

| Task | File(s) |
|---|---|
| Change page `<head>` metadata, fonts loaded | `app/layout.tsx` |
| Change Next.js build config | `next.config.ts` |
| Change TypeScript compiler options | `tsconfig.json` |
| Change ESLint rules | `eslint.config.mjs` |
| Change Tailwind/PostCSS config | `postcss.config.mjs` |
| Add/remove npm dependencies | `package.json` + run `npm install` |
| Change environment variables | `.env.local` (create if missing) |

---

### Environment Variables

```env
# .env.local — only deployment-specific values go here
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

All thresholds and config constants go in `lib/constants.ts`, not `.env.local`.

---

### Documentation Reference

| Question | Read this |
|---|---|
| How do I run the project locally? | `WEEK1-2_SETUP_AND_TEST.md` |
| Why was X architectural decision made? | `WEEK1-2_IMPLEMENTATION_NOTES.md` |
| What do I need to ask the backend team? | `MESSAGE_TO_BACKEND_TEAM.md` |
| What's built vs pending? | `DELIVERY_SUMMARY.md` or `START_HERE.md` |
| Full product spec and system architecture | `project.md` (Uwais's doc) |
| Backend API endpoints and DB schema | `IMPLEMENTATION_PLAN.md` (Rohan's doc) |
| Frontend implementation plan (authoritative) | `FRONTEND_PLAN_v2_1.md` |
| Backend clarifications for frontend | `BAckend_Clerifications_for_Frontend_development` |

---

## Current Build State

### ✅ Complete (Weeks 1–2)

| File | What it does |
|---|---|
| `app/setup/page.tsx` | SSR setup page shell with quote |
| `app/setup/SetupForm.tsx` | Topic + difficulty form, session creation |
| `app/check/page.tsx` | Permission check page |
| `components/setup/TopicSelector.tsx` | 6-topic card grid |
| `components/setup/DifficultyPicker.tsx` | Easy/Medium/Hard selector |
| `components/setup/MotivationalQuote.tsx` | Server-rendered daily quote |
| `components/check/CameraCheck.tsx` | Live camera preview + status |
| `components/check/MicCheck.tsx` | 20-segment audio level meter |
| `hooks/useCamera.ts` | Camera stream lifecycle |
| `hooks/useMicrophone.ts` | Mic stream + RMS metering |
| `hooks/useSession.ts` | REST API wrapper hooks |
| `store/interviewStore.ts` | Full Zustand session store |
| `lib/constants.ts` | All endpoint strings + config |
| `lib/api.ts` | Typed Axios REST wrappers |
| `lib/auth.ts` | Anonymous UUID identity |
| `types/index.ts` | All TypeScript interfaces |
| `app/globals.css` | Design system tokens + utilities |

### ⏳ Stub Only (to be built)

| File | Week | Blocked on |
|---|---|---|
| `app/interview/page.tsx` | 3 | Backend field name confirmation |
| `app/results/page.tsx` | 5 | Results schema confirmation |
| `hooks/useAudioCapture.ts` | 3 | Backend WS format confirmation |
| `hooks/useWebSocket.ts` | 3 | Backend WS endpoint confirmation |
| `lib/tts.ts` | 3 | Nothing — build now |
| `lib/audioUtils.ts` | 3 | Nothing — build now |
| `public/audioWorklet.js` | 3 | Nothing — build now |
| `hooks/useGazeTracker.ts` | 4 | Nothing — build now |
| `workers/yoloWorker.ts` | 4 | `yolo11n.onnx` from Uwais |
| `hooks/useObjectDetector.ts` | 4 | `yoloWorker.ts` |
| All `components/interview/*` | 3–4 | Interview page shell |
| All `components/results/*` | 5 | Results schema |
| `public/models/yolo11n.onnx` | 4 | **Uwais to provide** |

---

## Active Blockers (Confirm with Backend Before Building)

| # | Blocker | Impact | Who |
|---|---|---|---|
| 1 | `POST /api/sessions/start` field names — `job` + `level` or different? | Session creation breaks with 400 if wrong | Rohan |
| 2 | WebSocket endpoint path confirmation | `useWebSocket` hook cannot be built | Uwais |
| 3 | WebSocket response shape — `{ transcript, score }` or more fields? | `WebSocketMessage` type may be wrong | Uwais |
| 4 | Results response schema — exact field names (snake_case or camelCase?) | Results page parser breaks | Rohan |
| 5 | `yolo11n.onnx` file delivery | Object detection blocked | Uwais |
| 6 | FastAPI wrapping status — is localhost:8000 live? | Integration testing blocked | Rohan/Uwais |

See `MESSAGE_TO_BACKEND_TEAM.md` for the full message ready to send.

---

## Thread Architecture Reference (Interview Screen)

```
Main Thread
  rAF loop (every frame):
    → every 2nd frame  → FaceMesh.send(videoFrame)     [useGazeTracker]
    → every 20th frame → scanFrame() → Web Worker      [useObjectDetector]

  FaceMesh.onResults:
    → gaze ratio → 3s penalty timer → DistractionBanner
    → draw landmarks on <canvas>

  Worker.onmessage:
    → COCO class 67/63 detected → POST flag + incrementCheating()
    → draw bounding boxes on <canvas>

  WebSocket.onmessage:
    → { transcript, score } → addResponse() → advance question

Audio Thread (AudioWorklet)
  PCMProcessor → Float32 → downsample → postMessage
  → main thread → Int16Array → ws.sendBinary()

Web Worker (yoloWorker.ts)
  ImageData → ONNX inference → postMessage detectedClasses
```
