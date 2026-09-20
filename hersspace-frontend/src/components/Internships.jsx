import React from 'react';

const jobs = [
  {
    tagClass: 'tag-remote',
    tagLabel: 'Remote',
    title: 'Social Media Intern',
    desc: "Help amplify HerSpace's voice across digital platforms. Create engaging content, write blog posts, and support newsletter production.",
    location: 'Remote',
    duration: '3 months',
    deadline: 'Deadline: 23 Aug 2026'
  },
  {
    tagClass: 'tag-onsite',
    tagLabel: 'On-Site',
    title: 'Community Engagement Intern',
    desc: "Work directly with communities to support HerSpace's grassroots programs. Help organize workshops and coordinate with local partners.",
    location: 'Jamshoro, Sindh',
    duration: '6 months',
    deadline: 'Deadline: 26 Aug 2026'
  },
  {
    tagClass: 'tag-hybrid',
    tagLabel: 'Hybrid',
    title: 'Research Intern',
    desc: 'Assist with SRHR and climate justice research and reporting, supporting the team with literature reviews and policy briefs.',
    location: 'Karachi, Sindh',
    duration: '4 months',
    deadline: 'Deadline: 30 Aug 2026'
  },
  {
    tagClass: 'tag-remote',
    tagLabel: 'Remote',
    title: 'Advocacy & Legal Aid Intern',
    desc: 'Support policy advocacy and legal aid casework for youth, drafting briefs and coordinating with partner legal networks.',
    location: 'Remote',
    duration: '3 months',
    deadline: 'Deadline: 30 Aug 2026'
  }
];

export default function Internships({ onOpenApply }) {
  return (
    <section className="internships" id="internships">
      <div className="container">
        <h2 className="section-title">Internship Opportunities</h2>
        <p className="sub">Want to learn and work on real projects with us? We are looking for interns to join our teams, share their ideas, and grow their skills. Take a look at our open roles and apply today</p>
        <div className="job-grid">
          {jobs.map((job) => (
            <div className="job-card" key={job.title}>
              <div className="job-tags">
                <span className={`tag-pill ${job.tagClass}`}>{job.tagLabel}</span>
                <span className="tag-pill tag-open">Open</span>
              </div>
              <h4>{job.title}</h4>
              <p>{job.desc}</p>
              <div className="job-meta">
                <img src="/assets/icon_location.png" alt="" width="14" height="14" style={{ verticalAlign: 'middle' }} />
                {job.location}
              </div>
              <div className="job-meta">
                <img src="/assets/icon_clock.png" alt="" width="14" height="14" style={{ verticalAlign: 'middle' }} />
                {job.duration}
              </div>
              <div className="job-meta">
                <img src="/assets/icon_calendar.png" alt="" width="14" height="14" style={{ verticalAlign: 'middle' }} />
                {job.deadline}
              </div>
              <a className="btn btn-purple" onClick={() => onOpenApply(job.title)}>Apply Now</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
