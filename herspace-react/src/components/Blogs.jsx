import React, { useState, useEffect } from 'react';
import { blogsApi } from '../services/api';

const DECORATIVE_ASSETS = [
  { blob: '/assets/img_016.png', fallbackPhoto: '/assets/img_017.jpg', alt: 'Workshop session' },
  { blob: '/assets/img_018.png', fallbackPhoto: '/assets/img_019.jpg', alt: 'Team discussion' },
  { blob: '/assets/img_020.png', fallbackPhoto: '/assets/img_021.jpg', alt: 'Award ceremony' }
];

export default function Blogs({ onOpenBlog }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchBlogs() {
      try {
        setLoading(true);
        setError(null);
        const res = await blogsApi.getAll();
        if (isMounted) {
          setBlogs(res?.data || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching blogs from API:', err);
          setError('Unable to load articles right now. Please check back shortly.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchBlogs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="blogs" id="blogs">
      <div className="container">
        <h2 className="section-title">Blogs</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#6F57A4' }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>📖✨</div>
            <p style={{ fontSize: '16px', fontWeight: 600 }}>Loading latest articles...</p>
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
        ) : blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>
            <p>No blog posts published yet. Please check back soon!</p>
          </div>
        ) : (
          blogs.map((blog, idx) => {
            const isReverse = idx % 2 === 1;
            const asset = DECORATIVE_ASSETS[idx % DECORATIVE_ASSETS.length];
            const photoSrc = blog.cover_image || asset.fallbackPhoto;

            return (
              <div
                className={`blog-row${isReverse ? ' reverse' : ''}`}
                key={blog.id || blog.slug || idx}
              >
                {isReverse ? (
                  <>
                    <div className="blob-wrap">
                      <img className="blob-img" src={asset.blob} alt="" />
                      <img src="/assets/asterisk.png" alt="" className="asterisk-img" />
                      <img src="/assets/diamond.png" alt="" className="diamond-img" />
                      <img className="photo" src={photoSrc} alt={asset.alt} />
                    </div>
                    <div className="blog-text">
                      <h4>{blog.title}</h4>
                      <p>{blog.snippet || (Array.isArray(blog.body) ? blog.body[0] : blog.body)}</p>
                      <a
                        className="btn btn-yellow"
                        onClick={() => onOpenBlog(blog)}
                        style={{ cursor: 'pointer' }}
                      >
                        View More
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="blog-text">
                      <h4>{blog.title}</h4>
                      <p>{blog.snippet || (Array.isArray(blog.body) ? blog.body[0] : blog.body)}</p>
                      <a
                        className="btn btn-yellow"
                        onClick={() => onOpenBlog(blog)}
                        style={{ cursor: 'pointer' }}
                      >
                        View More
                      </a>
                    </div>
                    <div className="blob-wrap">
                      <img className="blob-img" src={asset.blob} alt="" />
                      <img src="/assets/asterisk.png" alt="" className="asterisk-img" />
                      <img src="/assets/diamond.png" alt="" className="diamond-img" />
                      <img className="photo" src={photoSrc} alt={asset.alt} />
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
