import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GITHUB_CLIENT_ID, API_BASE_URL } from '../utils/config';
import axios from 'axios';
import '../styles/LoginSignupPage.css';

const LoginSignupPage = () => {
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
    <div className="login-signup-container">
      <h1>Login or Signup</h1>
      <div className="login-signup-buttons">
        <button onClick={handleGithubLogin} className="github-btn">
          Login/Signup with GitHub
        </button>
      </div>
    </div>
  );
};

export default LoginSignupPage;
