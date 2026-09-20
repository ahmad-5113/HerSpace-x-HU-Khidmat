import React from 'react';

export default function Newsletter() {
  return (
    <section className="newsletter">
      <div className="container">
        <h3>Sign up for our Newsletter</h3>
        <p>Stay in the loop with everything you need to know</p>
        <form className="subscribe" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}>
          <input type="email" placeholder="Enter your email" required />
          <button type="submit" className="btn btn-yellow">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
