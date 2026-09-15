import React, { useState } from 'react';

export default function DonateModal({ open, onClose }) {
  const [activeAmount, setActiveAmount] = useState(null);
  const amounts = ['PKR 5,000', 'PKR 10,000', 'PKR 25,000', 'PKR 50,000'];

  return (
    <div
      className={`modal-overlay${open ? ' show' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-card">
        <span className="close" onClick={onClose}>&times;</span>
        <h4>
          <img src="/assets/img_023.png" alt="" style={{ width: '40px', height: 'auto' }} />
          Donate to HerSpace
        </h4>
        <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for your donation!'); onClose(); }}>
          <div className="field">
            <label>Full Name *</label>
            <input type="text" placeholder="Enter your Full Name" required />
          </div>
          <div className="row-2">
            <div className="field">
              <label>Email Address *</label>
              <input type="email" placeholder="Enter your email address" required />
            </div>
            <div className="field">
              <label>Phone Number *</label>
              <input type="tel" placeholder="03XX-XXXXXXX" required />
            </div>
          </div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Donation Amount (PKR)</label>
          <div className="amount-grid">
            {amounts.map((amt) => (
              <button
                type="button"
                key={amt}
                className={activeAmount === amt ? 'active' : ''}
                onClick={() => setActiveAmount(amt)}
              >
                {amt}
              </button>
            ))}
          </div>
          <div className="field">
            <label>Custom Amount (PKR)</label>
            <input type="number" placeholder="Enter amount in PKR" />
          </div>
          <button type="submit" className="btn btn-purple" style={{ width: '100%', justifyContent: 'center' }}>Donate Now</button>
        </form>
      </div>
    </div>
  );
}
