import React, { useState } from 'react';
import { newsletterApi } from '../services/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setFeedback({ type: null, text: '' });

    try {
      const response = await newsletterApi.subscribe(email.trim(), 'BANNER');
      setFeedback({
        type: 'success',
        text: response?.message || 'Thank you for subscribing!',
      });
      setEmail('');
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.message || 'Failed to subscribe. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter">
      <div className="container">
        <h3>Sign up for our Newsletter</h3>
        <p>Stay in the loop with everything you need to know</p>
        <form className="subscribe" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" className="btn btn-yellow" disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {feedback.text && (
          <div
            style={{
              marginTop: '14px',
              fontSize: '13px',
              fontWeight: 600,
              color: feedback.type === 'success' ? '#FFDD00' : '#FFB4B4',
              transition: 'opacity 0.2s ease',
            }}
          >
            {feedback.text}
          </div>
        )}
      </div>
    </section>
  );
}
