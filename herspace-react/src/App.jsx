import React, { useState } from 'react';

import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import AboutStrip from './components/AboutStrip.jsx';
import AboutUs from './components/AboutUs.jsx';
import Thematic from './components/Thematic.jsx';
import Mission from './components/Mission.jsx';
import Supporters from './components/Supporters.jsx';
import Approach from './components/Approach.jsx';
import Join from './components/Join.jsx';
import Internships from './components/Internships.jsx';
import Blogs from './components/Blogs.jsx';
import Newsletter from './components/Newsletter.jsx';
import Footer from './components/Footer.jsx';

import DonateModal from './components/DonateModal.jsx';
import VolunteerModal from './components/VolunteerModal.jsx';
import ApplyModal from './components/ApplyModal.jsx';
import BlogModal from './components/BlogModal.jsx';
import AdminModal from './components/AdminModal.jsx';

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [volunteerOpen, setVolunteerOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyRole, setApplyRole] = useState('Research Intern');
  const [applyJobId, setApplyJobId] = useState(null);
  const [blogOpen, setBlogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [langLabel, setLangLabel] = useState('اردو / English');

  const anyModalOpen = donateOpen || volunteerOpen || applyOpen || blogOpen || adminOpen;

  React.useEffect(() => {
    document.body.classList.toggle('no-scroll', drawerOpen || anyModalOpen);
  }, [drawerOpen, anyModalOpen]);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const openDonate = () => setDonateOpen(true);
  const closeDonate = () => setDonateOpen(false);

  const openVolunteer = () => setVolunteerOpen(true);
  const closeVolunteer = () => setVolunteerOpen(false);

  const openApply = (roleOrJob) => {
    if (typeof roleOrJob === 'object' && roleOrJob !== null) {
      setApplyRole(roleOrJob.title || 'General Internship');
      setApplyJobId(roleOrJob.id || null);
    } else {
      setApplyRole(roleOrJob || 'General Internship');
      setApplyJobId(null);
    }
    setApplyOpen(true);
  };
  const closeApply = () => setApplyOpen(false);

  const openBlog = (blogOrIdx) => {
    setSelectedBlog(blogOrIdx);
    setBlogOpen(true);
  };
  const closeBlog = () => {
    setBlogOpen(false);
    setSelectedBlog(null);
  };

  const toggleLang = () => {
    setLangLabel((prev) => (prev === 'اردو / English' ? 'English / اردو' : 'اردو / English'));
  };

  const openAdmin = () => {
    setAdminOpen(true);
  };
  const closeAdmin = () => {
    setAdminOpen(false);
  };

  return (
    <>
      <Header
        drawerOpen={drawerOpen}
        onOpenDrawer={openDrawer}
        onCloseDrawer={closeDrawer}
        onOpenDonate={openDonate}
        onOpenVolunteer={openVolunteer}
        onOpenAdmin={openAdmin}
        scrollToId={scrollToId}
        langLabel={langLabel}
        onToggleLang={toggleLang}
      />

      <Hero />
      <AboutStrip scrollToId={scrollToId} />
      <AboutUs />
      <Thematic />
      <Mission />
      <Supporters />
      <Approach />
      <Join onOpenVolunteer={openVolunteer} />
      <Internships onOpenApply={openApply} />
      <Blogs onOpenBlog={openBlog} />
      <Newsletter />
      <Footer scrollToId={scrollToId} />

      <DonateModal open={donateOpen} onClose={closeDonate} />
      <VolunteerModal open={volunteerOpen} onClose={closeVolunteer} />
      <ApplyModal open={applyOpen} role={applyRole} jobId={applyJobId} onClose={closeApply} />
      <BlogModal
        open={blogOpen}
        blog={typeof selectedBlog === 'object' ? selectedBlog : null}
        blogIndex={typeof selectedBlog === 'number' ? selectedBlog : null}
        onClose={closeBlog}
      />
      <AdminModal open={adminOpen} onClose={closeAdmin} />
    </>
  );
}

