import React from 'react';
import blogsData from '../data/blogsData.js';

export default function BlogModal({ open, blogIndex, onClose }) {
  const blog = blogIndex !== null ? blogsData[blogIndex] : null;

  return (
    <div
      className={`modal-overlay${open ? ' show' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-card blog-modal-card">
        <span className="close" onClick={onClose}>&times;</span>
        <div className="blog-img-frame">
          <img className="blog-img-bg" src={blog ? blog.img : ''} alt="" />
          <img className="blog-img-fg" src={blog ? blog.img : ''} alt="" />
        </div>
        <h3>{blog ? blog.title : ''}</h3>
        <div>
          {blog && blog.body.map((para, i) => <p key={i}>{para}</p>)}
        </div>
      </div>
    </div>
  );
}
