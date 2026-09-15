import React, { useState } from 'react';
import { volunteersApi } from '../services/api';

const initialFormData = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  age: '',
  gender: '',
  statement: '',
};

export default function VolunteerModal({ open, onClose }) {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetAndClose = () => {
    setFormData(initialFormData);
    setErrorMessage('');
    setSuccessMessage('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const payload = {
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim() || undefined,
        age: formData.age ? parseInt(formData.age, 10) : undefined,
        gender: formData.gender && formData.gender !== 'Select' ? formData.gender : undefined,
        statement: formData.statement.trim(),
      };

      const response = await volunteersApi.apply(payload);
      setSuccessMessage(response?.message || 'Application submitted successfully!');
      setTimeout(() => {
        resetAndClose();
      }, 1800);
    } catch (err) {
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
          <img src="/assets/img_024.png" alt="" />
          Join As a Volunteer
        </h4>

        {successMessage ? (
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              color: '#420071',
              backgroundColor: '#F3EBF9',
              borderRadius: '12px',
              margin: '20px 0',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
            <h5 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
              Application Received!
            </h5>
            <p style={{ fontSize: '14px', color: '#555', margin: 0 }}>
              {successMessage}
            </p>
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
              <label>Why do you want to volunteer with Herspace? *</label>
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
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
