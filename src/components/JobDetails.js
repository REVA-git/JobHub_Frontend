import React, { useEffect } from 'react';
import '../styles/DisplayJobsPage.css';

const JobDetails = ({ job, onClose }) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.classList.contains('job-details-overlay')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Function to convert URLs in text to clickable links
  const createMarkup = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const content = text.replace(
      urlRegex,
      url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
    return { __html: content };
  };

  return (
    <div className="job-details-overlay">
      <div className="job-details-container">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>{job.title}</h2>
        <p dangerouslySetInnerHTML={createMarkup(job.description)} />
        <div className="job-details">
          {job.location && <span className="location">{job.location}</span>}
          {job.salary && <span className="salary">{job.salary}</span>}
        </div>
        {job.createdBy && (
          <div className="job-creator">
            <p>Posted by: {job.createdBy}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
