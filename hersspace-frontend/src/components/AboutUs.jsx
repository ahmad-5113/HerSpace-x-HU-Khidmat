import React from 'react';

export default function AboutUs() {
  return (
    <section className="about-us" id="about-us">
      <div className="container">
        <h2 className="section-title">Herspace: An Overview</h2>
        <img src="/assets/squiggle.png" alt="" className="squiggle" />
        <div className="about-grid">
          <div className="about-photo-wrap">
            <img src="/assets/img_004.jpg" alt="HerSpace youth leaders — for her to reclaim, for us to redefine" />
          </div>
          <div className="about-text">
            <h3>About Us</h3>
            <p>HerSpace is a grassroots, youth-led, women-led organization working at the intersection of gender equality and climate action. Through leadership development, community building, and intersectional advocacy, we aim to prevent gender-based violence, strengthen SRHR, and embed feminist and indigenous approaches into climate solutions.</p>
            <p>Our work is grounded in decolonial feminist values and aligns with the Sustainable Development Goals:</p>
            <div className="sdg-row">
              <img src="/assets/img_005.png" alt="SDG 5: Gender Equality" />
              <img src="/assets/img_006.png" alt="SDG 13: Climate Action" />
              <img src="/assets/img_007.png" alt="SDG 16: Peace, Justice and Strong Institutions" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
