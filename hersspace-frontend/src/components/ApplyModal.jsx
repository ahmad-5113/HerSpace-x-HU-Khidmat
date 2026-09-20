import React from 'react';

export default function ApplyModal({ open, role, onClose }) {
  return (
    <div
      className={`modal-overlay${open ? ' show' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-card form-card">
        <span className="close" onClick={onClose}>&times;</span>
        <h4>
          <img src="/assets/member-plus-icon2.png" alt="" style={{ width: '48px', height: '48px' }} />
          Apply: <span>{role}</span>
        </h4>
        <form onSubmit={(e) => { e.preventDefault(); alert('Application submitted!'); onClose(); }}>
          <div className="field">
            <label>Full Name *</label>
            <input type="text" placeholder="e.g. Ali" required />
          </div>
          <div className="row-2">
            <div className="field">
              <label>Email Address *</label>
              <input type="email" placeholder="ali@gmail.com" required />
            </div>
            <div className="field">
              <label>Phone Number *</label>
              <input type="tel" placeholder="03XX-XXXXXXX" required />
            </div>
          </div>
          <div className="row-3">
            <div className="field">
              <label>City</label>
              <input type="text" placeholder="Karachi" />
            </div>
            <div className="field">
              <label>Age</label>
              <input type="number" placeholder="Age" />
            </div>
            <div className="field">
              <label>Gender</label>
              <select>
                <option>Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Upload CV *</label>
            <label className="upload-box" htmlFor="cvfile">
              <img src="/assets/img_026.png" alt="" />
              Click to upload<br />
              <span style={{ fontSize: '11px' }}>Supported formats: PDF, DOC, DOCX (Max 5MB)</span>
            </label>
            <input type="file" id="cvfile" style={{ display: 'none' }} />
          </div>
          <div className="field">
            <label>Why do you want to join Herspace? *</label>
            <textarea rows="3" placeholder="Tell us why you want to join Herspace..." required></textarea>
          </div>
          <button type="submit" className="btn btn-purple">Submit Application</button>
        </form>
      </div>
    </div>
  );
}
