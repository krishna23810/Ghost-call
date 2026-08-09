require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const roomRoutes = require('./routes/rooms');

const app = express();
const PORT = process.env.PORT || 4000;

// Trust 1 reverse proxy hop (localtunnel, ngrok, Railway, Vercel)
app.set('trust proxy', 1);

// ── Security middleware ──────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  credentials: false,
}));

app.use(express.json());

// ── Terminal IP Request Logger Middleware ────────────────────
app.use((req, res, next) => {
  const rawForwarded = req.headers['x-forwarded-for'];
  const clientIp = rawForwarded
    ? rawForwarded.split(',')[0].trim()
    : (req.socket.remoteAddress || req.ip || 'Unknown IP');

  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] 🌐 ${req.method} ${req.originalUrl} | Client IP: \x1b[36m${clientIp}\x1b[0m`);
  next();
});

// ── Rate limiting ────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                 // 200 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false }, // Disable strict trustProxy validation warning
  message: { error: 'Too many requests, please slow down.' },
});

app.use('/api', limiter);

// ── Routes ───────────────────────────────────────────────────
app.use('/api/rooms', roomRoutes);

// ── Health check ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Error handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Ghost Call Backend running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Rooms API: http://localhost:${PORT}/api/rooms\n`);
});
