import React from 'react';

export default function AboutStrip({ scrollToId }) {
  return (
    <section className="about-strip" id="about">
      <img src="/assets/img_003_full.jpg" alt="Community gathering" />
      <div className="content">
        <h2>About Us</h2>
        <p>From grassroots organizing to nationwide advocacy, HerSpace equips young leaders with the tools, community, and confidence to drive gender justice and climate action.</p>
        <a className="btn btn-yellow" onClick={() => scrollToId('about-us')}>See More</a>
      </div>
    </section>
  );
}
