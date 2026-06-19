<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:backend-workflow-rules -->
# Backend & API Workflow Rules

1. **Quiz API & Web Dependencies**:
   - The application relies directly on the web-based QuizAPI.io to source questions, and a local/remote LLM hosted on port 3000 to handle fallback generation when the pool runs dry.
   - Do **NOT** bypass this logic by implementing local static fallback pools within the code. All question sourcing must go through the configured APIs.
   - The user must provide a valid `API_KEY` in `Enviornment_Variable.env` for QuizAPI.io.

2. **Backend Development & Modifications**:
   - Never edit the base backend code directly inside the `backend/` directory.
   - Whenever you want to make changes to the backend, copy the target code files from `backend/` to the active workspace folder `backend_v1/` and make the edits there.
<!-- END:backend-workflow-rules -->
