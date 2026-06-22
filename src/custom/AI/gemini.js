const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Gemini AI API (dev server)!');
});

// Simple CORS headers without extra dependency for local dev
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Development-only chat endpoint: echoes the message back so frontend can be tested.
app.post('/api/chat', (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'No message provided' });
  const reply = `Echo: ${message}`;
  console.log('Received message:', message);
  res.json({ reply });
});

app.listen(port, () => {
  console.log('Server is running on port', port);
});