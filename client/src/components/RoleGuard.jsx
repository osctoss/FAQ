import { useAuth } from '../context/AuthContext';

export default function RoleGuard({ allowedRoles, children, fallback = null }) {
  const { user } = useAuth();
  if (!user) return fallback;
  if (!allowedRoles.includes(user.role)) return fallback;
  return children;
}