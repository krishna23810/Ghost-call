# 👻 Ghost Call — Anonymous & Private Video Calling Platform

> High-performance, zero-registration, browser-based video calls with 6-digit room join codes and 24-hour key expiration.

---

## ✨ Features

- 🔒 **End-to-End Encrypted WebRTC**: Low-latency video streams powered by LiveKit Cloud SFU.
- 👻 **Zero Registration & Zero Logs**: No accounts, passwords, or personal data stored.
- 🔢 **6-Digit Join Codes**: Share a simple 6-digit code or direct link to invite anyone.
- 🎨 **Enterprise Light Mode UI**: Clean Stripe/Loom-style light mode with custom controls.
- ⏱️ **Automatic 24-Hour Expiration**: Upstash Redis room metadata expires automatically.
- 📱 **Mobile & Desktop Responsive**: Fully functional on mobile browsers & desktop screens.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS v4, LiveKit Components React.
- **Backend**: Node.js, Express.js, LiveKit Server SDK, `@upstash/redis`.
- **Infrastructure**: LiveKit Cloud (SFU), Upstash Redis (Serverless Key-Value Store).

---

## 📁 Repository Structure

```
Ghost-call/
├── backend/               <-- Node.js Express API server
│   ├── src/
│   │   ├── routes/        <-- REST API endpoints (/api/rooms)
│   │   ├── services/      <-- LiveKit & Upstash Redis services
│   │   └── utils/         <-- 6-digit code generator
│   └── .env.example
├── client/                <-- Next.js Frontend App
│   ├── app/               <-- Next.js App Router (Landing & Room pages)
│   ├── components/        <-- Reusable UI components (Navbar, ShareModal, Spinner)
│   └── routes.ts          <-- Centralized API route mapping
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/krishna23810/Ghost-call.git
cd Ghost-call
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=4000
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret

UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

Start backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

Open **`http://localhost:3000`** in your browser!

---

## 🔒 Security & Privacy

- **Eviction Policy**: Redis eviction is disabled; keys expire strictly via 24-hour TTL.
- **Observability**: LiveKit agent telemetry and observability are disabled.
- **CORS & Headers**: Next.js configured with `Permissions-Policy` for camera and microphone APIs.

---

## 📄 License

MIT License. Built for privacy and open-source communication.
