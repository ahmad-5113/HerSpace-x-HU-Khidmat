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
  const [blogOpen, setBlogOpen] = useState(false);
  const [blogIndex, setBlogIndex] = useState(null);
  const [langLabel, setLangLabel] = useState('اردو / English');

  const anyModalOpen = donateOpen || volunteerOpen || applyOpen || blogOpen;

  React.useEffect(() => {
    document.body.classList.toggle('no-scroll', drawerOpen || anyModalOpen);
  }, [drawerOpen, anyModalOpen]);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const openDonate = () => setDonateOpen(true);
  const closeDonate = () => setDonateOpen(false);

  const openVolunteer = () => setVolunteerOpen(true);
  const closeVolunteer = () => setVolunteerOpen(false);

  const openApply = (role) => {
    setApplyRole(role);
    setApplyOpen(true);
  };
  const closeApply = () => setApplyOpen(false);

  const openBlog = (idx) => {
    setBlogIndex(idx);
    setBlogOpen(true);
  };
  const closeBlog = () => setBlogOpen(false);

  const toggleLang = () => {
    setLangLabel((prev) => (prev === 'اردو / English' ? 'English / اردو' : 'اردو / English'));
  };

  const openAdmin = () => {
    alert('Admin Dashboard coming soon!');
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
      <ApplyModal open={applyOpen} role={applyRole} onClose={closeApply} />
      <BlogModal open={blogOpen} blogIndex={blogIndex} onClose={closeBlog} />
    </>
  );
}
