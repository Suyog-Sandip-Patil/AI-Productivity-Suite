import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';

// Components
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import TaskManager from './pages/TaskManager';
import MoodJournal from './pages/MoodJournal';
import Analytics from './pages/Analytics';
import Chatbot from './pages/Chatbot';
import Features from './pages/Features';
import Habits from './pages/Habits';
import Goals from './pages/Goals';
import Community from './pages/Community';
import Settings from './pages/Settings';
import Growth from './pages/Growth';
import Learning from './pages/Learning';
import Contact from './pages/Contact';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return !user ? children : <Navigate to="/dashboard" />;
};

function App() {
  const { darkMode } = useTheme();

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen gradient-bg transition-colors duration-300">
        <Router>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: darkMode ? '#374151' : '#ffffff',
                color: darkMode ? '#f3f4f6' : '#111827',
                border: darkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tasks" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <TaskManager />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mood" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <MoodJournal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chatbot" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Chatbot />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/features" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Features />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/habits" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Habits />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/goals" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Goals />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/community" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Community />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/growth" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Growth />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/learning" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Learning />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contact" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Contact />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
