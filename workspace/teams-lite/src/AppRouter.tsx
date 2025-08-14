import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import ChatPage from './pages/ChatPage';
import CalendarPage from './pages/CalendarPage';
import InvitationsPage from './pages/InvitationsPage';
import MeetingsList from './pages/MeetingsList';
import MeetingRoom from './pages/MeetingRoom';
import CreateGroupPage from './pages/CreateGroupPage';
import CreateTopicPage from './pages/CreateTopicPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/calendar" replace />} />
          <Route path="/chat/:channelId" element={<ChatPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/invitations" element={<InvitationsPage />} />
          <Route path="/meetings" element={<MeetingsList />} />
          <Route path="/meet/:meetingId" element={<MeetingRoom />} />
          <Route path="/groups/new" element={<CreateGroupPage />} />
          <Route path="/groups/:groupId/new-topic" element={<CreateTopicPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}