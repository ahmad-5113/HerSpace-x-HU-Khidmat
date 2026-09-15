import React from 'react';

export default function Header({
  drawerOpen,
  onOpenDrawer,
  onCloseDrawer,
  onOpenDonate,
  onOpenVolunteer,
  onOpenAdmin,
  scrollToId,
  langLabel,
  onToggleLang
}) {
  return (
    <>
      {/* ================= NAV ================= */}
      <header>
        <div className="nav-inner">
          <a href="#home" className="logo">
            <img src="/assets/img_001.png" alt="HerSpace logo" />
          </a>
          <nav className="links">
            <a onClick={() => scrollToId('home')}>Home</a>
            <a onClick={() => scrollToId('about-us')}>About Us</a>
            <a onClick={() => scrollToId('approach')}>Our Approach</a>
            <a onClick={onOpenVolunteer}>Volunteer</a>
            <a onClick={() => scrollToId('internships')}>Internships</a>
            <a onClick={() => scrollToId('blogs')}>Blogs</a>
            <a onClick={() => scrollToId('contact')}>Contact Us</a>
          </nav>
          <div className="nav-right">
            <button className="btn btn-yellow" onClick={onOpenDonate}>
              Donate
              <img src="/assets/icon_arrow_right.png" alt="" width="16" height="14" style={{ verticalAlign: 'middle' }} />
            </button>
            <div className="hamburger" onClick={onOpenDrawer}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </header>

      <div className={`overlay${drawerOpen ? ' show' : ''}`} onClick={onCloseDrawer}></div>

      <div className={`drawer${drawerOpen ? ' open' : ''}`}>
        <div className="drawer-close" onClick={onCloseDrawer}>&times;</div>
        <a onClick={() => { scrollToId('home'); onCloseDrawer(); }}>Home</a>
        <a onClick={() => { scrollToId('about-us'); onCloseDrawer(); }}>About Us</a>
        <a onClick={() => { scrollToId('approach'); onCloseDrawer(); }}>Our Approach</a>
        <a onClick={() => { onOpenVolunteer(); onCloseDrawer(); }}>Volunteer</a>
        <a onClick={() => { scrollToId('internships'); onCloseDrawer(); }}>Internships</a>
        <a onClick={() => { scrollToId('blogs'); onCloseDrawer(); }}>Blogs</a>
        <a onClick={() => { scrollToId('contact'); onCloseDrawer(); }}>Contact Us</a>
        <button className="btn btn-outline lang-toggle" onClick={onToggleLang}>
          <img src="/assets/icon_globe.png" alt="Language" width="16" height="16" style={{ verticalAlign: 'middle' }} />
          <span>{langLabel}</span>
        </button>
        <button
          className="btn btn-outline"
          onClick={() => { onOpenAdmin(); onCloseDrawer(); }}
          style={{ width: '100%', justifyContent: 'center', marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <img src="/assets/img2.png" alt="" width="18" height="18" style={{ verticalAlign: 'middle' }} />
          Admin Dashboard
        </button>
        <button className="btn btn-purple" onClick={() => { onOpenDonate(); onCloseDrawer(); }}>Donate</button>
      </div>
    </>
  );
}
