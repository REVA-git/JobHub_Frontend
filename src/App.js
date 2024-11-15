import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import DisplayJobsPage from './components/DisplayJobsPage';
import JobsPage from './components/JobsPage';
import LoginSignupPage from './components/LoginSignupPage';
import Logout from './components/Logout';
import GitHubCallback from './components/GitHubCallback';
import HirePage from './components/HirePage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';
import axios from 'axios';
import { API_BASE_URL } from './utils/config';

const AuthenticatedNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleGithubLogin = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/github`);
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error initiating GitHub login:', error);
    }
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><a href="/display-jobs">Find Jobs</a></li>
        {user && <li><a href="/jobs">Your Job Postings</a></li>}
        {!user && (
          <li>
            <a href="#" onClick={handleGithubLogin}>
              Login/Signup
            </a>
          </li>
        )}
        {user && (
          <li>
            <a href="/logout" className="logout-link">
              Logout
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login-signup" />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <AuthenticatedNav />
          <Routes>
            <Route path="/" element={<Navigate to="/display-jobs" />} />
            <Route path="/display-jobs" element={<DisplayJobsPage />} />
            <Route
              path="/jobs"
              element={
                <PrivateRoute>
                  <JobsPage />
                </PrivateRoute>
              }
            />
            <Route path="/login-signup" element={<LoginSignupPage />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/auth/github/callback" element={<GitHubCallback />} />
            <Route path='/hire' element={<HirePage />} /> {/* Add this route */}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
