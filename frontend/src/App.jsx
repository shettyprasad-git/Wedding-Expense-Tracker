import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import SectionPage from './pages/SectionPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  
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
            
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/engagement" element={<ProtectedRoute><SectionPage section="Engagement" /></ProtectedRoute>} />
            <Route path="/mehndi" element={<ProtectedRoute><SectionPage section="Mehndi" /></ProtectedRoute>} />
            <Route path="/marriage" element={<ProtectedRoute><SectionPage section="Marriage" /></ProtectedRoute>} />
            <Route path="/dinner" element={<ProtectedRoute><SectionPage section="Dinner" /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ExpenseProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
