import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../utils/config';
import '../styles/HirePage.css';

const HirePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const getToken = () => {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
    return authCookie ? authCookie.split('=')[1] : null;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    if (!token) {
      setSubmitStatus('You must be logged in to post a job.');
      navigate('/login-signup');
      return;
    }

    try {
      const jobData = {
        ...formData,
        userId: user.id, // Ensure user ID is included
        createdBy: user.name || user.username, // Ensure creator name is included
        location: formData.location || 'NA',
        salary: formData.salary || 'NA'
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/jobs`,
        jobData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSubmitStatus('Job posted successfully!');
      setFormData({
        title: '',
        description: '',
        location: '',
        salary: ''
      });
      
      // Add a slight delay before navigating to ensure the job is saved
      setTimeout(() => {
        navigate('/jobs');
      }, 500);
    } catch (error) {
      console.error('Error creating job:', error);
      if (error.response?.status === 401) {
        setSubmitStatus('Your session has expired. Please log in again.');
        navigate('/login-signup');
      } else {
        setSubmitStatus('Failed to post job. Please try again.');
      }
    }
  };

  return (
    <div className="hire-container">
      <h1>Post a New Job</h1>
      {submitStatus && <div className="status-message">{submitStatus}</div>}
      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-group">
          <label htmlFor="title">Job Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Job Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="salary">Salary:</label>
          <input
            type="text"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-btn">Post Job</button>
      </form>
    </div>
  );
};

export default HirePage;
