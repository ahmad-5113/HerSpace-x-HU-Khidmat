import React from 'react';

export default function Blogs({ onOpenBlog }) {
  return (
    <section className="blogs" id="blogs">
      <div className="container">
        <h2 className="section-title">Blogs</h2>

        <div className="blog-row">
          <div className="blog-text">
            <h4>Developing Confident and Successful Learners</h4>
            <p>True academic success begins with a secure and supportive foundation. By grounding our educational spaces in fundamental values like dignity and mutual respect, we empower students to confidently embrace challenges and reach their full potential.</p>
            <a className="btn btn-yellow" onClick={() => onOpenBlog(0)}>View More</a>
          </div>
          <div className="blob-wrap">
            <img className="blob-img" src="/assets/img_016.png" alt="" />
            <img src="/assets/asterisk.png" alt="" className="asterisk-img" />
            <img src="/assets/diamond.png" alt="" className="diamond-img" />
            <img className="photo" src="/assets/img_017.jpg" alt="Workshop session" />
          </div>
        </div>

        <div className="blog-row reverse">
          <div className="blob-wrap">
            <img className="blob-img" src="/assets/img_018.png" alt="" />
            <img src="/assets/asterisk.png" alt="" className="asterisk-img" />
            <img src="/assets/diamond.png" alt="" className="diamond-img" />
            <img className="photo" src="/assets/img_019.jpg" alt="Team discussion" />
          </div>
          <div className="blog-text">
            <h4>Enjoy Learning with a Unique Classroom Experience</h4>
            <p>Education is most effective when it is dynamic and collaborative. Our unique classroom model moves beyond traditional lectures to create an engaging, inclusive environment where diverse perspectives drive meaningful learning.</p>
            <a className="btn btn-yellow" onClick={() => onOpenBlog(1)}>View More</a>
          </div>
        </div>

        <div className="blog-row">
          <div className="blog-text">
            <h4>Passionate Teachers That Make a Difference</h4>
            <p>Our educators are dedicated mentors who look beyond the standard curricula. Whether conducting lessons in the classroom or facilitating open-air discussions, they are committed to supporting individual growth and inspiring lifelong curiosity.</p>
            <a className="btn btn-yellow" onClick={() => onOpenBlog(2)}>View More</a>
          </div>
          <div className="blob-wrap">
            <img className="blob-img" src="/assets/img_020.png" alt="" />
            <img src="/assets/asterisk.png" alt="" className="asterisk-img" />
            <img src="/assets/diamond.png" alt="" className="diamond-img" />
            <img className="photo" src="/assets/img_021.jpg" alt="Award ceremony" />
          </div>
        </div>

      </div>
    </section>
  );
}
