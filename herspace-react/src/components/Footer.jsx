import React, { useState } from 'react';
import { newsletterApi } from '../services/api';

export default function Footer({ scrollToId }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, text: '' });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setFeedback({ type: null, text: '' });

    try {
      const response = await newsletterApi.subscribe(email.trim(), 'FOOTER');
      setFeedback({
        type: 'success',
        text: response?.message || 'Thank you for subscribing!',
      });
      setEmail('');
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.message || 'Failed to subscribe.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer id="contact">
      <div className="container footer-grid">
        <div>
          <a href="#home" className="footer-logo">
            <img src="/assets/img_022.png" alt="HerSpace logo" />
          </a>
          <p className="desc">A youth-led gender justice and climate action movement, powering community, leadership, and change.</p>
          <div className="social-row">
            <a href="https://www.facebook.com/share/1CmedtMgi9/" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com/herspace_youth/?hl=en" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.linkedin.com/in/herspace-♀️-538444318?utm_source=share_via&utm_content=profile&utm_medium=member_android" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        <div>
          <h5>Useful Links</h5>
          <ul>
            <li><a onClick={() => scrollToId('about-us')}>About Us</a></li>
            <li><a onClick={() => scrollToId('approach')}>Our Approach</a></li>
            <li><a onClick={() => scrollToId('internships')}>Internships</a></li>
            <li><a onClick={() => scrollToId('blogs')}>Blogs</a></li>
          </ul>
        </div>
        <div>
          <h5>Contact Us</h5>
          <ul>
            <li>
              <img src="/assets/icon_location_large.png" alt="" className="loc-icon" width="14" height="14" style={{ verticalAlign: 'middle' }} />
              Jamshoro, 76090, Sindh, Pakistan
            </li>
            <li>
              <img src="/assets/icon_email.png" alt="" width="14" height="14" style={{ verticalAlign: 'middle' }} />
              <a href="mailto:herspaceyouth@gmail.com">herspaceyouth@gmail.com</a>
            </li>
            <li>
              <img src="/assets/icon_phone.png" alt="" width="14" height="14" style={{ verticalAlign: 'middle' }} />
              <a href="tel:+92 311-1796626">+92 311-1796626</a>
            </li>
          </ul>
        </div>
        <div>
          <h5>Subscribe to our Newsletter</h5>
          <form className="foot-sub" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? '...' : 'Subscribe'}
            </button>
          </form>
          {feedback.text && (
            <div
              style={{
                marginTop: '8px',
                fontSize: '12px',
                color: feedback.type === 'success' ? '#FFDD00' : '#FF8F8F',
                lineHeight: 1.4,
              }}
            >
              {feedback.text}
            </div>
          )}
        </div>
      </div>
      <div className="copyright">© 2026 HerSpace. All rights reserved.</div>
    </footer>
  );
}

