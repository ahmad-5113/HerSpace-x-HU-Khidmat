import React from 'react';
import blogsData from '../data/blogsData.js';

export default function BlogModal({ open, blog, blogIndex, onClose }) {
  // Support both passing the dynamic blog object or the legacy blogIndex
  const currentBlog =
    typeof blog === 'object' && blog !== null
      ? blog
      : blogIndex !== null && blogIndex !== undefined
      ? blogsData[blogIndex]
      : null;

  const imageSrc = currentBlog?.cover_image || currentBlog?.img || '';
  const paragraphs = Array.isArray(currentBlog?.body)
    ? currentBlog.body
    : currentBlog?.body
    ? [currentBlog.body]
    : [];

  return (
    <div
      className={`modal-overlay${open ? ' show' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card blog-modal-card">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {imageSrc && (
          <div className="blog-img-frame">
            <img className="blog-img-bg" src={imageSrc} alt="" />
            <img className="blog-img-fg" src={imageSrc} alt="" />
          </div>
        )}
        <h3>{currentBlog ? currentBlog.title : ''}</h3>
        {currentBlog?.author_name && (
          <div
            style={{
              fontSize: '13px',
              color: '#6F57A4',
              fontWeight: 600,
              marginBottom: '16px',
            }}
          >
            By {currentBlog.author_name}
            {currentBlog.published_at && (
              <span style={{ color: '#888', fontWeight: 400, marginLeft: '8px' }}>
                • {new Date(currentBlog.published_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            )}
          </div>
        )}
        <div>
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
