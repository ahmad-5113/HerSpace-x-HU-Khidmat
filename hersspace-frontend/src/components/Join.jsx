import React from 'react';

export default function Join({ onOpenVolunteer }) {
  return (
    <section className="join">
      <div className="container">
        <img src="/assets/img_015.jpg" alt="Volunteers group" />
        <h3>Join Our Movement</h3>
        <p>Be part of a growing community of changemakers. Register as a volunteer and help us build a gender-just and climate-resilient future.</p>
        <a className="btn btn-yellow" onClick={onOpenVolunteer}>Join As a Volunteer</a>
      </div>
    </section>
  );
}
