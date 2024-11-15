import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DisplayJobsPage.css';
import JobDetails from './JobDetails';

const DisplayJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFullScreen, setShowFullScreen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('https://your_server_url/api/jobs'); //change url
        setJobs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setSelectedJob(null);
    setShowFullScreen(false);
  };

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="jobs-container">
      <h1>Available Jobs</h1>
      <div className="jobs-grid">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="job-card"
            onClick={() => handleJobClick(job)}
          >
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <div className="job-details">
              {job.location && <span className="location">{job.location}</span>}
              {job.salary && <span className="salary">{job.salary}</span>}
            </div>
          </div>
        ))}
      </div>
      {showFullScreen && selectedJob && (
        <JobDetails job={selectedJob} onClose={handleCloseFullScreen} />
      )}
    </div>
  );
};

export default DisplayJobsPage;
