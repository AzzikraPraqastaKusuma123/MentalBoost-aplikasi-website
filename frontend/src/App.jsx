import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Questionnaire from './pages/Questionnaire';
import History from './pages/History';
import Landing from './pages/Landing';
import UserConsultation from './pages/UserConsultation';
import CounselorDashboard from './pages/CounselorDashboard';
import CounselorChat from './pages/CounselorChat';
import CounselorProfile from './pages/CounselorProfile';
import UserProfile from './pages/UserProfile';
import ManageTest from './pages/ManageTest';
import Layout from './components/Layout';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AuthProvider>
        <ChatProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/test" element={<Questionnaire />} />
              <Route path="/history" element={<History />} />

              {/* New Features */}
              <Route path="/consultation" element={<UserConsultation />} />
              <Route path="/dashboard-counselor" element={<CounselorDashboard />} />
              <Route path="/chat-counselor" element={<CounselorChat />} />
              <Route path="/profile-counselor" element={<CounselorProfile />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/manage-test" element={<ManageTest />} />
            </Route>
          </Routes>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
