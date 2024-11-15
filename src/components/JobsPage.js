
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../utils/config';
import '../styles/JobsPage.css';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, getToken, checkAuth } = useAuth();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    if (!user || !user.userId) {
      setLoading(false);
      setJobs([]);
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/jobs?userId=${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setJobs(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      if (error.response?.status === 401) {
        // Try to refresh authentication
        await checkAuth();
        // If still authenticated, retry fetch
        if (getToken()) {
          fetchJobs();
        } else {
          setError('Your session has expired. Please log in again.');
          navigate('/login-signup');
        }
      } else {
        setError('Failed to load jobs. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]); // Dependency on user ensures refetch when user changes

  // Add a refresh function that can be called manually
  const refreshJobs = () => {
    setLoading(true);
    fetchJobs();
  };

  const handleCreateJob = () => {
    navigate('/hire');
  };

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return <div className="error">Please log in to view your job postings</div>;

  return (
    <div className="jobs-page-container">
      <div className="header-actions">
        <h1>Your Job Postings</h1>
        <button onClick={refreshJobs} className="refresh-btn">
          Refresh Jobs
        </button>
      </div>
      {jobs.length === 0 ? (
        <div className="no-jobs-container">
          <p>No jobs available yet</p>
          <button className="create-job-btn" onClick={handleCreateJob}>
            Create Your First Job Posting
          </button>
        </div>
      ) : (
        <>
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <h3>{job.title}</h3>
                <p>{job.description}</p>
                <div className="job-details">
                  {job.location && <span className="location">{job.location}</span>}
                  {job.salary && <span className="salary">{job.salary}</span>}
                </div>
                <div className="job-creator">
                  <p>Posted by: {job.createdBy}</p>
                  <p>Created: {new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="create-job-btn" onClick={handleCreateJob}>
            Create New Job Posting
          </button>
        </>
      )}
    </div>
  );
};

export default JobsPage;