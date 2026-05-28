import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pages
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import FAQPage from '../pages/FAQPage';
import RTQPage from '../pages/RTQPage';
import StudentDashboard from '../pages/StudentDashboard';
import SeniorDashboard from '../pages/SeniorDashboard';
import AddFAQPage from '../pages/AddFAQPage';
import RaiseQuestionPage from '../pages/RaiseQuestionPage';
import ProfilePage from '../pages/ProfilePage';
import UserListPage from '../pages/UserListPage';
import TrackQuestionPage from '../pages/TrackQuestionPage';
import WorkingHistoryPage from '../pages/WorkingHistoryPage';
import NotificationsPage from '../pages/NotificationsPage';

// ─── Auth guards ───────────────────────────────────────────────
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ── Public routes ── */}
      <Route
        path="/login"
        element={<PublicOnly><LoginPage /></PublicOnly>}
      />
      <Route
        path="/signup"
        element={<PublicOnly><SignupPage /></PublicOnly>}
      />

      {/* ── Shared protected routes ── */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>}
      />
      <Route
        path="/faq"
        element={<ProtectedRoute><FAQPage /></ProtectedRoute>}
      />
      <Route
        path="/rtq"
        element={<ProtectedRoute><RTQPage /></ProtectedRoute>}
      />
      <Route
        path="/profile"
        element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
      />
      <Route
        path="/users"
        element={<ProtectedRoute><UserListPage /></ProtectedRoute>}
      />
      <Route
        path="/notifications"
        element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>}
      />

      {/* ── Role-gated routes ── */}
      <Route
        path="/raise-question"
        element={
          <ProtectedRoute allowedRoles={['student', 'moderator']}>
            <RaiseQuestionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-faq"
        element={
          <ProtectedRoute allowedRoles={['senior', 'admin']}>
            <AddFAQPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/track"
        element={<ProtectedRoute><TrackQuestionPage /></ProtectedRoute>}
      />
      <Route
        path="/history"
        element={<ProtectedRoute><WorkingHistoryPage /></ProtectedRoute>}
      />

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}