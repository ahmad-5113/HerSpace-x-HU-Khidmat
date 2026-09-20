import React from 'react';

export default function Footer({ scrollToId }) {
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
          <form className="foot-sub" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="copyright">© 2026 HerSpace. All rights reserved.</div>
    </footer>
  );
}
