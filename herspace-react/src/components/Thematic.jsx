import React from 'react';

export default function Thematic() {
  return (
    <section className="thematic" id="thematic">
      <div className="container">
        <span className="eyebrow">Our Thematic Areas</span>
        <div className="thematic-grid">
          <div className="theme-card">
            <img src="/assets/img_008.png" alt="Feminist Climate Justice icon" />
            <h4>Feminist Climate Justice</h4>
            <p>Addressing gendered impacts of climate change</p>
          </div>
          <div className="theme-card">
            <img src="/assets/img_009.png" alt="SRHR icon" />
            <h4>Sexuality, Gender, Health, and Rights (SRHR)</h4>
            <p>Advancing SRHR &amp; tackling taboos</p>
          </div>
          <div className="theme-card">
            <img src="/assets/img_010.png" alt="Youth-led Feminist Movement Building icon" />
            <h4>Youth-led Feminist Movement Building</h4>
            <p>Grassroots advocacy</p>
          </div>
        </div>
      </div>
    </section>
  );
}
