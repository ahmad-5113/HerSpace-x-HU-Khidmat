import React from 'react';

export default function Mission() {
  return (
    <section className="mission">
      <div className="container mission-grid">
        <div className="mission-card">
          <h3>Our Mission</h3>
          <p>HerSpace powers an interconnected movement of young leaders across Pakistan to advance gender justice and climate justice. We create the space, support, and community young people need to transform their ideas into action. This purpose drives everything we do.</p>
          <img src="/assets/img_011.jpg" alt="HerSpace mission group photo" />
        </div>
        <div className="mission-card">
          <h3>Our Belief</h3>
          <p><strong>Real and lasting change starts with youth.</strong> When young people, especially girls and women, have the space, resources, and solidarity to act, they can shift mindsets, mobilize communities, and transform entire systems.</p>
          <img src="/assets/img_012.jpg" alt="HerSpace belief workshop photo" />
        </div>
      </div>
    </section>
  );
}
