import React, { useState } from 'react';
import { useJobs } from '../contexts/JobContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";
import '../styles/HirePage.css';

const HirePage = () => {
  const { addJob } = useJobs();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    location: '',
    domain: '',
    workType: '',
    employmentType: '',
    userType: '',
    title: '',
    description: '',
    salaryRange: '',
    applyLink: '',
    companyDescription: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Summarize the company description
    const prompt = `Summarize the following content about company culture and work environment in 200 words: ${formData.companyDescription}`;
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    await addJob({
      ...formData,
      companyDescription: summary, // Store the summarized info
      createdBy: user?.uid,
      userName: user?.displayName,
    });
    navigate('/jobs');
  };

  return (
    <div className="hire-page">
      <div className="hire-card">
        <div className="hire-card-header">
          <h2>Creating New Job</h2>
          <button className="close-button" onClick={() => navigate('/jobs')}>
            ×
          </button>
        </div>
        
        <div className="hire-card-content">
          <div className="form-grid">
            <div className="form-column">
              <div className="form-group">
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Company Name"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Location"
                />
              </div>

              <div className="form-group split">
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Domain</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Mobile">Mobile</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Machine Learning">Machine Learning</option>
                </select>

                <select
                  name="workType"
                  value={formData.workType}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Work Type</option>
                  <option value="remote">Remote</option>
                  <option value="on site">Onsite</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Employment Type</option>
                  <option value="full time">Full Time</option>
                  <option value="part time">Part Time</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div className="form-group">
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">User Type</option>
                  <option value="student">Student</option>
                  <option value="professional">Professional</option>
                  <option value="fresher">Fresher</option>
                </select>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="applyLink"
                  value={formData.applyLink}
                  onChange={handleChange}
                  placeholder="Enter Apply link"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  placeholder="Paste company description or about text here"
                  className="form-textarea"
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter Job Title"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter Job Description"
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="salaryRange"
                  value={formData.salaryRange}
                  onChange={handleChange}
                  placeholder="Enter expected Salary Range"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <button onClick={handleSubmit} className="create-button">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HirePage;

