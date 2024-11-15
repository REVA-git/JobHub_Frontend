import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      navigate('/display-jobs');  
    };

    handleLogout();
  }, [logout, navigate]);

  return (
    <div className="logout-container">
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;
