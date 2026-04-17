import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import EventPage from './pages/EventPage';
import Profile from './pages/Profile';
import Support from './pages/Support';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  
  return <Layout>{children}</Layout>;
};

const AdminGuard = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return <Layout>{children}</Layout>;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ExpenseProvider>
          <Routes>
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/signup" element={<Auth mode="signup" />} />
            <Route path="/admin/login" element={<Auth mode="login" adminMode={true} />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
            
            {/* Admin Portal */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
            
            {/* Dedicated Ceremony Routes */}
            <Route path="/event/engagement" element={<ProtectedRoute><EventPage eventType="engagement" /></ProtectedRoute>} />
            <Route path="/event/mehndi" element={<ProtectedRoute><EventPage eventType="mehndi" /></ProtectedRoute>} />
            <Route path="/event/haldi" element={<ProtectedRoute><EventPage eventType="haldi" /></ProtectedRoute>} />
            <Route path="/event/marriage" element={<ProtectedRoute><EventPage eventType="marriage" /></ProtectedRoute>} />
            <Route path="/event/dinner" element={<ProtectedRoute><EventPage eventType="dinner" /></ProtectedRoute>} />
            
            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ExpenseProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
