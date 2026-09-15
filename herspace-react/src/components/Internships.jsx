import React, { useState, useEffect } from 'react';
import { internshipsApi } from '../services/api';

export default function Internships({ onOpenApply }) {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchInternships() {
      try {
        setLoading(true);
        setError(null);
        const res = await internshipsApi.getAll();
        if (isMounted) {
          setInternships(res?.data || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching internships from database:', err);
          setError('Unable to load current opportunities. Please check your connection.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchInternships();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleJobs = expanded ? internships : internships.slice(0, 4);

  return (
    <section className="internships" id="internships">
      <div className="container">
        <h2 className="section-title">Internship Opportunities</h2>
        <p className="sub">
          Want to learn and work on real projects with us? We are looking for interns to join our teams,
          share their ideas, and grow their skills. Take a look at our open roles and apply today.
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#6F57A4' }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>⏳</div>
            <p style={{ fontSize: '16px', fontWeight: 600 }}>Loading latest internship opportunities...</p>
          </div>
        ) : error ? (
          <div
            style={{
              maxWidth: '500px',
              margin: '30px auto',
              padding: '20px',
              textAlign: 'center',
              background: '#FFF3F3',
              borderRadius: '12px',
              border: '1px solid #FFCDCD',
              color: '#B00020'
            }}
          >
            <p style={{ margin: '0 0 12px 0', fontSize: '15px' }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-purple"
              style={{ fontSize: '13px', padding: '8px 18px' }}
            >
              Retry
            </button>
          </div>
        ) : internships.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>
            <p>There are no open internship positions at this time. Please check back soon!</p>
          </div>
        ) : (
          <>
            <div className="job-grid">
              {visibleJobs.map((job) => (
                <div className="job-card" key={job.id || job.title}>
                  <div className="job-tags">
                    <span className={`tag-pill ${job.tagClass}`}>{job.tagLabel}</span>
                    <span className="tag-pill tag-open">Open</span>
                  </div>
                  <h4>{job.title}</h4>
                  <p>{job.desc}</p>
                  <div className="job-meta">
                    <img
                      src="/assets/icon_location.png"
                      alt=""
                      width="14"
                      height="14"
                      style={{ verticalAlign: 'middle' }}
                    />
                    {job.location}
                  </div>
                  <div className="job-meta">
                    <img
                      src="/assets/icon_clock.png"
                      alt=""
                      width="14"
                      height="14"
                      style={{ verticalAlign: 'middle' }}
                    />
                    {job.duration}
                  </div>
                  <div className="job-meta">
                    <img
                      src="/assets/icon_calendar.png"
                      alt=""
                      width="14"
                      height="14"
                      style={{ verticalAlign: 'middle' }}
                    />
                    {job.deadline}
                  </div>
                  <a
                    className="btn btn-purple"
                    onClick={() => onOpenApply(job)}
                    style={{ cursor: 'pointer' }}
                  >
                    Apply Now
                  </a>
                </div>
              ))}
            </div>

            {/* "See More" / "See Less" Button if more than 4 internships */}
            {internships.length > 4 && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '14px 32px',
                    borderRadius: '30px',
                    border: '2px solid #6F57A4',
                    color: '#420071',
                    background: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(66, 0, 113, 0.08)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#6F57A4';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(111, 87, 164, 0.25)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.color = '#420071';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(66, 0, 113, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>
                    {expanded
                      ? 'Show Less Opportunities'
                      : `See More Opportunities (${internships.length - 4} more)`}
                  </span>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '16px',
                      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                    }}
                  >
                    ▼
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
