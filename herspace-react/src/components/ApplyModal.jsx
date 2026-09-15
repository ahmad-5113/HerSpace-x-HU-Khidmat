import React, { useState, useRef } from 'react';
import { internshipsApi } from '../services/api';

const initialFormData = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  age: '',
  gender: '',
  statement: '',
};

export default function ApplyModal({ open, role, jobId, onClose }) {
  const [formData, setFormData] = useState(initialFormData);
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate extension
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setErrorMessage('Invalid file type. Please upload a PDF, DOC, or DOCX document.');
      setCvFile(null);
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 5MB limit. Please choose a smaller file.');
      setCvFile(null);
      return;
    }

    setErrorMessage('');
    setCvFile(file);
  };

  const resetAndClose = () => {
    setFormData(initialFormData);
    setCvFile(null);
    setErrorMessage('');
    setSuccessMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!cvFile) {
      setErrorMessage('Please upload your CV before submitting.');
      return;
    }

    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append('cv', cvFile);
      formPayload.append('role_title', role || 'General Internship');
      if (jobId) {
        formPayload.append('internship_id', jobId);
      }
      formPayload.append('full_name', formData.fullName.trim());
      formPayload.append('email', formData.email.trim());
      formPayload.append('phone', formData.phone.trim());
      if (formData.city.trim()) formPayload.append('city', formData.city.trim());
      if (formData.age) formPayload.append('age', formData.age);
      if (formData.gender && formData.gender !== 'Select') {
        formPayload.append('gender', formData.gender);
      }
      formPayload.append('statement', formData.statement.trim());

      const response = await internshipsApi.apply(formPayload);
      setSuccessMessage(
        response?.message || 'Thank you! Your internship application has been submitted successfully.'
      );

      setTimeout(() => {
        resetAndClose();
      }, 2000);
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'Failed to submit application. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`modal-overlay${open ? ' show' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) resetAndClose();
      }}
    >
      <div className="modal-card form-card">
        <span className="close" onClick={!loading ? resetAndClose : undefined}>
          &times;
        </span>
        <h4>
          <img
            src="/assets/member-plus-icon2.png"
            alt=""
            style={{ width: '48px', height: '48px' }}
          />
          Apply: <span>{role}</span>
        </h4>

        {successMessage ? (
          <div
            style={{
              padding: '28px 16px',
              textAlign: 'center',
              color: '#420071',
              backgroundColor: '#F3EBF9',
              borderRadius: '12px',
              margin: '20px 0',
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>📄✨</div>
            <h5 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '8px' }}>
              Application & CV Submitted!
            </h5>
            <p style={{ fontSize: '14px', color: '#555', margin: 0 }}>{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {errorMessage && (
              <div
                style={{
                  padding: '10px 14px',
                  marginBottom: '14px',
                  backgroundColor: '#FFEAEA',
                  border: '1px solid #FFC2C2',
                  borderRadius: '8px',
                  color: '#C5221F',
                  fontSize: '13px',
                  lineHeight: 1.4,
                }}
              >
                {errorMessage}
              </div>
            )}

            <div className="field">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                placeholder="e.g. Ali"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="row-2">
              <div className="field">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="ali@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className="field">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="03XX-XXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="row-3">
              <div className="field">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Karachi"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="field">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  min="10"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="field">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Upload CV *</label>
              <label
                className="upload-box"
                htmlFor="cvfile"
                style={{
                  cursor: loading ? 'not-allowed' : 'pointer',
                  borderColor: cvFile ? '#6F57A4' : '#DDD',
                  backgroundColor: cvFile ? '#FAF7FE' : '#FAFAFA',
                  transition: 'all 0.2s ease',
                }}
              >
                {cvFile ? (
                  <div style={{ textAlign: 'center', padding: '6px' }}>
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>📎</div>
                    <strong style={{ color: '#420071', fontSize: '14px', display: 'block' }}>
                      {cvFile.name}
                    </strong>
                    <span style={{ fontSize: '11px', color: '#6B7280' }}>
                      {(cvFile.size / (1024 * 1024)).toFixed(2)} MB • Click to replace file
                    </span>
                  </div>
                ) : (
                  <>
                    <img src="/assets/img_026.png" alt="" />
                    Click to upload
                    <br />
                    <span style={{ fontSize: '11px' }}>
                      Supported formats: PDF, DOC, DOCX (Max 5MB)
                    </span>
                  </>
                )}
              </label>
              <input
                type="file"
                id="cvfile"
                ref={fileInputRef}
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                disabled={loading}
                style={{ display: 'none' }}
              />
            </div>

            <div className="field">
              <label>Why do you want to join Herspace? *</label>
              <textarea
                rows="3"
                name="statement"
                placeholder="Tell us why you want to join Herspace..."
                value={formData.statement}
                onChange={handleChange}
                disabled={loading}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-purple"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Uploading CV & Submitting...' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
