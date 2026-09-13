import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RoomPage from './pages/RoomPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

/**
 * Ghost Call - Main App & Route Registry
 * Using standard React Router (react-router-dom)
 * Clean, transparent, and easy to maintain!
 */
export default function App() {
  return (
    <Routes>
      {/* 1. Landing Page / Join with 6-digit Code */}
      <Route path="/" element={<HomePage />} />

      {/* 2. Room Call Page */}
      <Route path="/room/:roomId" element={<RoomPage />} />

      {/* 3. Admin Passcode Login (shown only on /admin) */}
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/Ghost-call/admin" element={<Navigate to="/admin" replace />} />

      {/* 4. Admin Live Room Data Dashboard (shown on /admin/data) */}
      <Route path="/admin/data" element={<AdminDashboardPage />} />
      <Route path="/Ghost-call/admin/data" element={<Navigate to="/admin/data" replace />} />

      {/* Fallback - redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
