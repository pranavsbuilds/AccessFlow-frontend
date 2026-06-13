// mock-backend.js — minimal Express mock for testing the frontend
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// POST /api/sessions/start — mock endpoint
app.post('/api/sessions/start', (req, res) => {
  const { uid, job, level } = req.body;
  console.log(`[MOCK] Session start: uid=${uid}, job=${job}, level=${level}`);
  
  res.json({
    sid: `session-${Date.now()}`,
    status: 'created',
  });
});

// POST /api/interview/{sid}/flag — mock endpoint (Week 4+)
app.post('/api/interview/:sid/flag', (req, res) => {
  console.log(`[MOCK] Flag received for session ${req.params.sid}`);
  res.json({ flagged: true });
});

// GET /api/interview/{sid}/results — mock endpoint (Week 5+)
app.get('/api/interview/:sid/results', (req, res) => {
  res.json({
    sid: req.params.sid,
    final_score: 7.4,
    cluster_label: 'top',
    questions: [],
    cheating_count: 0,
  });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`[MOCK] Backend listening on http://localhost:${PORT}`);
});
