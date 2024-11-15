
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const GitHubCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from URL parameters
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (code) {
          // Exchange code for token
          const response = await axios.post(`${API_BASE_URL}/auth/github/callback`, { code });
          const { token, user } = response.data;

          // Login the user
          login(user, token);

          // Redirect to jobs page
          navigate('/jobs');
        }
      } catch (error) {
        console.error('Error during GitHub callback:', error);
        navigate('/login-signup');
      }
    };

    handleCallback();
  }, [location, login, navigate]);

  return (
    <div className="loading">
      <h2>Authenticating...</h2>
    </div>
  );
};

export default GitHubCallback;
