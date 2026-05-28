import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

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

export default function App() {
  return (
    <div className="min-h-screen bg-surface">
      <Routes>
        <Route path="/login/*" element={<AppRoutes />} />
        <Route path="/signup/*" element={<AppRoutes />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <AppRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faq/*"
          element={
            <ProtectedRoute>
              <AppRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rtq/*"
          element={
            <ProtectedRoute>
              <AppRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/*"
          element={
            <ProtectedRoute>
              <AppRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/*"
          element={
            <ProtectedRoute>
              <AppRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/raise-question/*"
          element={
            <ProtectedRoute allowedRoles={['student', 'moderator']}>
              <AppRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-faq/*"
          element={
            <ProtectedRoute allowedRoles={['senior', 'admin']}>
              <AppRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track/*"
          element={
            <ProtectedRoute>
              <AppRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history/*"
          element={
            <ProtectedRoute>
              <AppRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications/*"
          element={
            <ProtectedRoute>
              <AppRoutes />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}