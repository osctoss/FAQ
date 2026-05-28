import { Routes, Route } from 'react-router-dom';
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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/rtq" element={<RTQPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/users" element={<UserListPage />} />
      <Route path="/raise-question" element={<RaiseQuestionPage />} />
      <Route path="/add-faq" element={<AddFAQPage />} />
      <Route path="/track" element={<TrackQuestionPage />} />
      <Route path="/history" element={<WorkingHistoryPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
    </Routes>
  );
}