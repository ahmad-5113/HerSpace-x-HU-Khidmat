import React, { useState, useEffect } from 'react';
import { authApi, adminApi } from '../services/api';

export default function AdminModal({ open, onClose }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [activeTab, setActiveTab] = useState('volunteers');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@herspace.org');
  const [loginPassword, setLoginPassword] = useState('AdminPassword123!');

  // Self-Registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('HR_MANAGER');
  const [regSuccess, setRegSuccess] = useState(null);

  // Volunteers state
  const [volunteers, setVolunteers] = useState([]);
  const [volunteerFilter, setVolunteerFilter] = useState('ALL');

  // Internships state
  const [applications, setApplications] = useState([]);
  const [internships, setInternships] = useState([]);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    location: 'Jamshoro, Sindh',
    workplace_type: 'Remote',
    duration: '3 months',
    deadline: ''
  });
  const [showAddJob, setShowAddJob] = useState(false);

  // Blogs state
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({
    title: '',
    author_name: 'HerSpace Team',
    cover_image: '/assets/img_027.jpg',
    status: 'PUBLISHED',
    body: ''
  });
  const [showAddBlog, setShowAddBlog] = useState(false);

  // Newsletter state
  const [subscribers, setSubscribers] = useState([]);
  const [subscribersTotal, setSubscribersTotal] = useState(0);

  // Staff state
  const [staffList, setStaffList] = useState([]);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    role: 'HR_MANAGER'
  });
  const [showAddStaff, setShowAddStaff] = useState(false);

  // Approvals & Registrations state (SuperAdmin only)
  const [registrations, setRegistrations] = useState([]);

  // Check auth on open
  useEffect(() => {
    if (open) {
      setError('');
      setActionSuccess('');
      setRegSuccess(null);
      checkCurrentUser();
    }
  }, [open]);

  // Load active tab data when user changes or tab changes
  useEffect(() => {
    if (currentUser && open) {
      loadTabData();
    }
  }, [currentUser, activeTab, open]);

  const checkCurrentUser = async () => {
    const token = authApi.getToken();
    if (!token) {
      setCurrentUser(null);
      return;
    }
    try {
      const res = await authApi.getMe();
      setCurrentUser(res.data);
      if (res.data.role === 'CONTENT_EDITOR') setActiveTab('blogs');
      else setActiveTab('volunteers');
    } catch {
      setCurrentUser(null);
      authApi.logout();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(loginEmail, loginPassword);
      setCurrentUser(res.data.user);
      if (res.data.user.role === 'CONTENT_EDITOR') setActiveTab('blogs');
      else setActiveTab('volunteers');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setRegSuccess(null);
    setLoading(true);
    try {
      const res = await authApi.register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
      });

      setRegSuccess({
        message: res.message,
        verificationUrl: res.data?.verificationUrl,
        email: res.data?.user?.email,
      });
      setRegName('');
      setRegEmail('');
      setRegPassword('');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    setCurrentUser(null);
    setAuthMode('login');
    onClose();
  };

  const loadTabData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'volunteers') {
        const res = await adminApi.getVolunteers(volunteerFilter);
        setVolunteers(res.data || []);
      } else if (activeTab === 'internships') {
        const appsRes = await adminApi.getApplications();
        setApplications(appsRes.data || []);
      } else if (activeTab === 'blogs') {
        const res = await fetch('http://localhost:5000/api/v1/blogs').then((r) => r.json());
        setBlogs(res.data || []);
      } else if (activeTab === 'newsletter') {
        const subRes = await adminApi.getSubscribers();
        setSubscribers(subRes.data?.subscribers || []);
        setSubscribersTotal(subRes.data?.total || 0);
      } else if (activeTab === 'staff' && currentUser?.role === 'SUPER_ADMIN') {
        const staffRes = await adminApi.getStaff();
        setStaffList(staffRes.data || []);
      } else if (activeTab === 'approvals' && currentUser?.role === 'SUPER_ADMIN') {
        const regRes = await adminApi.getRegistrations();
        setRegistrations(regRes.data || []);
      }
    } catch (err) {
      console.error('Tab loading error:', err);
      setError(err.message || 'Failed to load data for this section.');
    } finally {
      setLoading(false);
    }
  };

  // Status updaters
  const handleUpdateVolunteer = async (id, newStatus) => {
    try {
      await adminApi.updateVolunteer(id, { status: newStatus });
      setVolunteers((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
      );
      showFlashSuccess(`Volunteer status updated to ${newStatus}`);
    } catch (err) {
      alert(err.message || 'Failed to update volunteer status.');
    }
  };

  const handleUpdateApplication = async (id, newStatus) => {
    try {
      await adminApi.updateApplication(id, { status: newStatus });
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
      showFlashSuccess(`Application status updated to ${newStatus}`);
    } catch (err) {
      alert(err.message || 'Failed to update application status.');
    }
  };

  // Add new Internship
  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createInternship(newJob);
      showFlashSuccess('New internship opportunity posted successfully!');
      setShowAddJob(false);
      setNewJob({
        title: '',
        description: '',
        location: 'Jamshoro, Sindh',
        workplace_type: 'Remote',
        duration: '3 months',
        deadline: ''
      });
      loadTabData();
    } catch (err) {
      alert(err.message || 'Failed to create internship.');
    }
  };

  // Add new Blog
  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      const paragraphs = newBlog.body
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean);

      await adminApi.createBlog({
        ...newBlog,
        body: paragraphs
      });
      showFlashSuccess('New blog published successfully!');
      setShowAddBlog(false);
      setNewBlog({
        title: '',
        author_name: 'HerSpace Team',
        cover_image: '/assets/img_027.jpg',
        status: 'PUBLISHED',
        body: ''
      });
      loadTabData();
    } catch (err) {
      alert(err.message || 'Failed to create blog post.');
    }
  };

  // Delete Blog
  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await adminApi.deleteBlog(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      showFlashSuccess('Blog post deleted.');
    } catch (err) {
      alert(err.message || 'Failed to delete blog.');
    }
  };

  // Add new Staff (Direct Admin Creation)
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createStaff(newStaff);
      showFlashSuccess(`Staff member created with role ${newStaff.role}!`);
      setShowAddStaff(false);
      setNewStaff({
        name: '',
        email: '',
        password: '',
        role: 'HR_MANAGER'
      });
      loadTabData();
    } catch (err) {
      alert(err.message || 'Failed to create staff member.');
    }
  };

  // Toggle staff status
  const handleToggleStaff = async (id, currentStatus) => {
    try {
      await adminApi.toggleStaffStatus(id, !currentStatus);
      setStaffList((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_active: !currentStatus } : s))
      );
      showFlashSuccess(`Staff status updated.`);
    } catch (err) {
      alert(err.message || 'Failed to update staff status.');
    }
  };

  // Approve Registration
  const handleApproveRegistration = async (id, name) => {
    try {
      await adminApi.approveRegistration(id);
      showFlashSuccess(`Registration for ${name} approved! The user can now log in.`);
      loadTabData();
    } catch (err) {
      alert(err.message || 'Failed to approve registration.');
    }
  };

  // Disapprove & Delete Registration
  const handleRejectRegistration = async (id, name) => {
    if (!window.confirm(`Are you sure you want to disapprove ${name}? This will permanently delete their registration.`)) return;
    try {
      await adminApi.rejectRegistration(id);
      showFlashSuccess(`Registration for ${name} has been disapproved and deleted.`);
      loadTabData();
    } catch (err) {
      alert(err.message || 'Failed to reject registration.');
    }
  };

  const showFlashSuccess = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3500);
  };

  if (!open) return null;

  return (
    <div
      className="modal-overlay show"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ zIndex: 1100 }}
    >
      <div
        className="modal-card"
        style={{
          maxWidth: currentUser ? '980px' : '460px',
          width: '94%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 28px',
          borderRadius: '16px',
        }}
      >
        <span className="close" onClick={onClose} style={{ alignSelf: 'flex-end' }}>
          &times;
        </span>

        {/* UNAUTHENTICATED: LOGIN OR REGISTER VIEW */}
        {!currentUser ? (
          <div>
            <div style={{ display: 'flex', borderBottom: '2px solid #EDE6F7', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setError('');
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'none',
                  border: 'none',
                  borderBottom: authMode === 'login' ? '3px solid #6F57A4' : 'none',
                  color: authMode === 'login' ? '#420071' : '#6B7280',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setError('');
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'none',
                  border: 'none',
                  borderBottom: authMode === 'register' ? '3px solid #6F57A4' : 'none',
                  color: authMode === 'register' ? '#420071' : '#6B7280',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Register Staff ID
              </button>
            </div>

            {error && (
              <div
                style={{
                  background: '#FFEAEA',
                  color: '#C5221F',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  marginBottom: '16px',
                  lineHeight: 1.4,
                }}
              >
                {error}
              </div>
            )}

            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin}>
                <h4 style={{ color: '#420071', fontWeight: 800, margin: '0 0 6px 0' }}>
                  HerSpace Staff Portal
                </h4>
                <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '18px' }}>
                  Sign in to access your administrative workspace.
                </p>

                <div className="field" style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600 }}>Email Address</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@herspace.org"
                    required
                  />
                </div>
                <div className="field" style={{ marginBottom: '18px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600 }}>Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                {/* Quick Demo Credentials */}
                <div
                  style={{
                    background: '#FAF7FD',
                    padding: '10px',
                    borderRadius: '8px',
                    marginBottom: '18px',
                    fontSize: '11px',
                    color: '#555',
                  }}
                >
                  <span style={{ fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Demo Accounts (Autofill):
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail('admin@herspace.org');
                        setLoginPassword('AdminPassword123!');
                      }}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        borderRadius: '4px',
                        border: '1px solid #CCC',
                        cursor: 'pointer',
                        background: '#FFF',
                      }}
                    >
                      SuperAdmin
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail('hr@herspace.org');
                        setLoginPassword('HrPassword123!');
                      }}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        borderRadius: '4px',
                        border: '1px solid #CCC',
                        cursor: 'pointer',
                        background: '#FFF',
                      }}
                    >
                      HR Manager
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail('editor@herspace.org');
                        setLoginPassword('EditorPassword123!');
                      }}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        borderRadius: '4px',
                        border: '1px solid #CCC',
                        cursor: 'pointer',
                        background: '#FFF',
                      }}
                    >
                      Content Editor
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-purple"
                  disabled={loading}
                  style={{ width: '100%', padding: '12px' }}
                >
                  {loading ? 'Authenticating...' : 'Sign In to Portal'}
                </button>
              </form>
            )}

            {/* SELF-REGISTRATION FORM */}
            {authMode === 'register' && (
              <div>
                {regSuccess ? (
                  <div
                    style={{
                      background: '#F3EBF9',
                      borderRadius: '12px',
                      padding: '24px 18px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '36px', marginBottom: '10px' }}>📬✨</div>
                    <h5 style={{ color: '#420071', fontSize: '18px', fontWeight: 800, margin: '0 0 8px 0' }}>
                      Verification Email Sent!
                    </h5>
                    <p style={{ color: '#555', fontSize: '13px', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                      We sent an email verification link to <strong>{regSuccess.email}</strong>.
                      <br />
                      Please verify your email address. Once verified, the <strong>Super Admin</strong> will review and approve your account.
                    </p>

                    {/* Instant Local Testing Button */}
                    {regSuccess.verificationUrl && (
                      <div style={{ margin: '14px 0', padding: '10px', background: '#FFF', borderRadius: '8px', border: '1px solid #D8BFD8' }}>
                        <span style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '6px' }}>
                          Local Test Shortcut:
                        </span>
                        <a
                          href={regSuccess.verificationUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-block',
                            background: '#6F57A4',
                            color: '#FFF',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          Verify Email in 1-Click 🚀
                        </a>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setRegSuccess(null);
                      }}
                      className="btn btn-purple"
                      style={{ fontSize: '13px', padding: '8px 20px', marginTop: '6px' }}
                    >
                      Back to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRegister}>
                    <h4 style={{ color: '#420071', fontWeight: 800, margin: '0 0 6px 0' }}>
                      Register for Staff Access
                    </h4>
                    <p style={{ color: '#6B7280', fontSize: '12px', marginBottom: '16px', lineHeight: 1.4 }}>
                      Create your staff ID. Your email must be verified, and registration approved by the Super Admin before login is enabled.
                    </p>

                    <div className="field" style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>Full Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Sara Ahmed"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="field" style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>Email Address *</label>
                      <input
                        type="email"
                        placeholder="sara@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="field" style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>Password *</label>
                      <input
                        type="password"
                        placeholder="Choose a secure password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="field" style={{ marginBottom: '18px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>Requested Staff Role *</label>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #DDD' }}
                      >
                        <option value="HR_MANAGER">HR & Volunteer Manager (HR_MANAGER)</option>
                        <option value="CONTENT_EDITOR">Content & Media Editor (CONTENT_EDITOR)</option>
                      </select>
                      <span style={{ fontSize: '11px', color: '#888', marginTop: '4px', display: 'block' }}>
                        * Super Admin accounts can only be provisioned internally.
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-purple"
                      disabled={loading}
                      style={{ width: '100%', padding: '12px' }}
                    >
                      {loading ? 'Submitting Registration...' : 'Register Account'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            {/* Top Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #EDE6F7',
                paddingBottom: '12px',
                marginBottom: '14px',
              }}
            >
              <div>
                <h4 style={{ margin: 0, color: '#420071', fontSize: '20px' }}>
                  HerSpace Management Dashboard
                </h4>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '3px' }}>
                  Signed in as <strong>{currentUser.name}</strong> •{' '}
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: '#EDE6F7',
                      color: '#420071',
                      fontWeight: 700,
                    }}
                  >
                    {currentUser.role}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid #E5E7EB',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: '#4B5563',
                  fontWeight: 600,
                }}
              >
                Sign Out
              </button>
            </div>

            {/* Flash Success Notification */}
            {actionSuccess && (
              <div
                style={{
                  background: '#E8F5E9',
                  color: '#2E7D32',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '12px',
                }}
              >
                ✓ {actionSuccess}
              </div>
            )}

            {/* Navigation Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                borderBottom: '2px solid #F3EBF9',
                paddingBottom: '8px',
                marginBottom: '16px',
                overflowX: 'auto',
              }}
            >
              {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'HR_MANAGER') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('volunteers')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 700,
                    background: activeTab === 'volunteers' ? '#6F57A4' : '#F3EBF9',
                    color: activeTab === 'volunteers' ? '#FFF' : '#420071',
                  }}
                >
                  Volunteers
                </button>
              )}

              {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'HR_MANAGER') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('internships')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 700,
                    background: activeTab === 'internships' ? '#6F57A4' : '#F3EBF9',
                    color: activeTab === 'internships' ? '#FFF' : '#420071',
                  }}
                >
                  Internships & CVs
                </button>
              )}

              {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CONTENT_EDITOR') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('blogs')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 700,
                    background: activeTab === 'blogs' ? '#6F57A4' : '#F3EBF9',
                    color: activeTab === 'blogs' ? '#FFF' : '#420071',
                  }}
                >
                  Blogs CMS
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('newsletter')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: activeTab === 'newsletter' ? '#6F57A4' : '#F3EBF9',
                  color: activeTab === 'newsletter' ? '#FFF' : '#420071',
                }}
              >
                Newsletter
              </button>

              {/* SUPER_ADMIN ONLY TABS */}
              {currentUser.role === 'SUPER_ADMIN' && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveTab('approvals')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 700,
                      background: activeTab === 'approvals' ? '#420071' : '#EDE6F7',
                      color: activeTab === 'approvals' ? '#FFF' : '#420071',
                    }}
                  >
                    Staff Approvals ⚖️
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('staff')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 700,
                      background: activeTab === 'staff' ? '#6F57A4' : '#F3EBF9',
                      color: activeTab === 'staff' ? '#FFF' : '#420071',
                    }}
                  >
                    Staff Accounts
                  </button>
                </>
              )}
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
              {/* TAB: SUPER ADMIN APPROVALS PIPELINE */}
              {activeTab === 'approvals' && currentUser?.role === 'SUPER_ADMIN' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '14px',
                    }}
                  >
                    <div>
                      <h5 style={{ margin: 0, color: '#420071', fontSize: '15px' }}>
                        Staff Self-Registrations ({registrations.length})
                      </h5>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        Review incoming staff registrations. Email must be verified before approval. Disapproving permanently deletes the registration.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={loadTabData}
                      className="btn btn-outline"
                      style={{ fontSize: '11px', padding: '5px 12px' }}
                    >
                      Refresh
                    </button>
                  </div>

                  {registrations.length === 0 ? (
                    <p style={{ color: '#888', fontSize: '13px' }}>
                      No staff self-registrations at this time.
                    </p>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ background: '#F9FAFB', textAlign: 'left' }}>
                          <th style={{ padding: '8px' }}>Name / Email</th>
                          <th style={{ padding: '8px' }}>Requested Role</th>
                          <th style={{ padding: '8px' }}>Email Verification</th>
                          <th style={{ padding: '8px' }}>Approval Status</th>
                          <th style={{ padding: '8px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.map((reg) => (
                          <tr key={reg.id} style={{ borderBottom: '1px solid #EEE' }}>
                            <td style={{ padding: '8px' }}>
                              <strong>{reg.name}</strong>
                              <br />
                              <span style={{ color: '#666' }}>{reg.email}</span>
                            </td>
                            <td style={{ padding: '8px' }}>
                              <span
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  background: '#EDE6F7',
                                  color: '#420071',
                                  fontWeight: 700,
                                  fontSize: '11px',
                                }}
                              >
                                {reg.role}
                              </span>
                            </td>
                            <td style={{ padding: '8px' }}>
                              {reg.is_email_verified ? (
                                <span
                                  style={{
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    background: '#E8F5E9',
                                    color: '#2E7D32',
                                    fontWeight: 700,
                                    fontSize: '11px',
                                  }}
                                >
                                  Verified ✓
                                </span>
                              ) : (
                                <span
                                  style={{
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    background: '#FFF3E0',
                                    color: '#E65100',
                                    fontWeight: 700,
                                    fontSize: '11px',
                                  }}
                                >
                                  Unverified ⏳
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '8px' }}>
                              <span
                                style={{
                                  fontWeight: 600,
                                  color: reg.approval_status === 'APPROVED' ? '#2E7D32' : '#F57C00',
                                }}
                              >
                                {reg.approval_status}
                              </span>
                            </td>
                            <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                {reg.approval_status !== 'APPROVED' ? (
                                  <button
                                    type="button"
                                    disabled={!reg.is_email_verified}
                                    onClick={() => handleApproveRegistration(reg.id, reg.name)}
                                    title={!reg.is_email_verified ? 'User must verify their email first' : 'Approve registration'}
                                    style={{
                                      padding: '4px 10px',
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      borderRadius: '4px',
                                      border: 'none',
                                      cursor: reg.is_email_verified ? 'pointer' : 'not-allowed',
                                      background: reg.is_email_verified ? '#2E7D32' : '#CCC',
                                      color: '#FFF',
                                    }}
                                  >
                                    Approve ✓
                                  </button>
                                ) : (
                                  <span style={{ color: '#2E7D32', fontWeight: 700, fontSize: '11px' }}>
                                    Approved (Active)
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleRejectRegistration(reg.id, reg.name)}
                                  style={{
                                    padding: '4px 8px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: '#FFEAEA',
                                    color: '#C5221F',
                                  }}
                                >
                                  Disapprove ✕
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* TAB: VOLUNTEERS */}
              {activeTab === 'volunteers' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>Filter:</span>
                      <select
                        value={volunteerFilter}
                        onChange={(e) => {
                          setVolunteerFilter(e.target.value);
                          adminApi.getVolunteers(e.target.value).then((r) => setVolunteers(r.data || []));
                        }}
                        style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>

                    <a
                      href="http://localhost:5000/api/v1/admin/volunteers/export"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '6px 12px',
                        background: '#EDE6F7',
                        color: '#420071',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      Export to CSV 📥
                    </a>
                  </div>

                  {volunteers.length === 0 ? (
                    <p style={{ color: '#888', fontSize: '13px' }}>No volunteer applications found.</p>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ background: '#F9FAFB', textAlign: 'left' }}>
                          <th style={{ padding: '8px' }}>Applicant</th>
                          <th style={{ padding: '8px' }}>Phone / City</th>
                          <th style={{ padding: '8px' }}>Statement</th>
                          <th style={{ padding: '8px' }}>Status</th>
                          <th style={{ padding: '8px' }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {volunteers.map((v) => (
                          <tr key={v.id} style={{ borderBottom: '1px solid #EEE' }}>
                            <td style={{ padding: '8px' }}>
                              <strong>{v.full_name}</strong>
                              <br />
                              <span style={{ color: '#666' }}>{v.email}</span>
                            </td>
                            <td style={{ padding: '8px' }}>
                              {v.phone}
                              <br />
                              <span style={{ color: '#888' }}>{v.city || 'N/A'}</span>
                            </td>
                            <td style={{ padding: '8px', maxWidth: '240px' }}>
                              <p style={{ margin: 0, maxHeight: '48px', overflow: 'hidden', color: '#555' }}>
                                {v.statement}
                              </p>
                            </td>
                            <td style={{ padding: '8px' }}>
                              <select
                                value={v.status}
                                onChange={(e) => handleUpdateVolunteer(v.id, e.target.value)}
                                style={{
                                  padding: '4px',
                                  fontSize: '11px',
                                  borderRadius: '4px',
                                  border: '1px solid #DDD',
                                  background:
                                    v.status === 'ACCEPTED'
                                      ? '#E8F5E9'
                                      : v.status === 'SHORTLISTED'
                                      ? '#FFF8E1'
                                      : '#FFF',
                                }}
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="SHORTLISTED">SHORTLISTED</option>
                                <option value="ACCEPTED">ACCEPTED</option>
                                <option value="REJECTED">REJECTED</option>
                              </select>
                            </td>
                            <td style={{ padding: '8px', color: '#888' }}>
                              {new Date(v.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* TAB: INTERNSHIPS & CANDIDATE APPLICATIONS */}
              {activeTab === 'internships' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '14px',
                    }}
                  >
                    <h5 style={{ margin: 0, color: '#420071', fontSize: '15px' }}>
                      Candidate Applications ({applications.length})
                    </h5>

                    <button
                      type="button"
                      onClick={() => setShowAddJob(!showAddJob)}
                      className="btn btn-purple"
                      style={{ fontSize: '12px', padding: '6px 14px' }}
                    >
                      {showAddJob ? 'Cancel' : '+ Post New Internship'}
                    </button>
                  </div>

                  {/* Add Internship Form */}
                  {showAddJob && (
                    <form
                      onSubmit={handleCreateJob}
                      style={{
                        background: '#FAF7FD',
                        padding: '16px',
                        borderRadius: '10px',
                        marginBottom: '16px',
                        fontSize: '12px',
                      }}
                    >
                      <h6 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#420071' }}>
                        Post New Internship
                      </h6>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input
                          placeholder="Job Title *"
                          value={newJob.title}
                          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                          required
                        />
                        <input
                          placeholder="Location (e.g. Jamshoro / Remote) *"
                          value={newJob.location}
                          onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                          required
                        />
                        <select
                          value={newJob.workplace_type}
                          onChange={(e) => setNewJob({ ...newJob, workplace_type: e.target.value })}
                        >
                          <option value="Remote">Remote</option>
                          <option value="On-Site">On-Site</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                        <input
                          placeholder="Duration (e.g. 3 months) *"
                          value={newJob.duration}
                          onChange={(e) => setNewJob({ ...newJob, duration: e.target.value })}
                          required
                        />
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                            Application Deadline *
                          </label>
                          <input
                            type="date"
                            value={newJob.deadline}
                            onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                            required
                          />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <textarea
                            rows="2"
                            placeholder="Job Description and responsibilities *"
                            value={newJob.description}
                            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                            required
                          ></textarea>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-purple"
                        style={{ marginTop: '10px', fontSize: '12px', padding: '6px 16px' }}
                      >
                        Publish Role
                      </button>
                    </form>
                  )}

                  {applications.length === 0 ? (
                    <p style={{ color: '#888', fontSize: '13px' }}>
                      No candidate applications submitted yet.
                    </p>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ background: '#F9FAFB', textAlign: 'left' }}>
                          <th style={{ padding: '8px' }}>Candidate</th>
                          <th style={{ padding: '8px' }}>Role Applied</th>
                          <th style={{ padding: '8px' }}>CV Document</th>
                          <th style={{ padding: '8px' }}>Status</th>
                          <th style={{ padding: '8px' }}>Applied Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app) => (
                          <tr key={app.id} style={{ borderBottom: '1px solid #EEE' }}>
                            <td style={{ padding: '8px' }}>
                              <strong>{app.full_name}</strong>
                              <br />
                              <span style={{ color: '#666' }}>
                                {app.email} • {app.phone}
                              </span>
                            </td>
                            <td style={{ padding: '8px' }}>
                              <span style={{ fontWeight: 600, color: '#420071' }}>
                                {app.role_title}
                              </span>
                            </td>
                            <td style={{ padding: '8px' }}>
                              {app.cv_url ? (
                                <a
                                  href={`http://localhost:5000${app.cv_url}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    background: '#EDE6F7',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    color: '#420071',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    fontSize: '11px',
                                  }}
                                >
                                  📄 View CV
                                </a>
                              ) : (
                                'No CV attached'
                              )}
                            </td>
                            <td style={{ padding: '8px' }}>
                              <select
                                value={app.status}
                                onChange={(e) => handleUpdateApplication(app.id, e.target.value)}
                                style={{
                                  padding: '4px',
                                  fontSize: '11px',
                                  borderRadius: '4px',
                                  border: '1px solid #DDD',
                                  background:
                                    app.status === 'ACCEPTED'
                                      ? '#E8F5E9'
                                      : app.status === 'INTERVIEWED'
                                      ? '#E0F2FE'
                                      : '#FFF',
                                }}
                              >
                                <option value="APPLIED">APPLIED</option>
                                <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                                <option value="INTERVIEWED">INTERVIEWED</option>
                                <option value="ACCEPTED">ACCEPTED</option>
                                <option value="REJECTED">REJECTED</option>
                              </select>
                            </td>
                            <td style={{ padding: '8px', color: '#888' }}>
                              {new Date(app.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* TAB: BLOGS CMS */}
              {activeTab === 'blogs' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '14px',
                    }}
                  >
                    <h5 style={{ margin: 0, color: '#420071', fontSize: '15px' }}>
                      Manage Articles ({blogs.length})
                    </h5>

                    <button
                      type="button"
                      onClick={() => setShowAddBlog(!showAddBlog)}
                      className="btn btn-purple"
                      style={{ fontSize: '12px', padding: '6px 14px' }}
                    >
                      {showAddBlog ? 'Cancel' : '+ Write New Article'}
                    </button>
                  </div>

                  {/* Add Blog Form */}
                  {showAddBlog && (
                    <form
                      onSubmit={handleCreateBlog}
                      style={{
                        background: '#FAF7FD',
                        padding: '16px',
                        borderRadius: '10px',
                        marginBottom: '16px',
                        fontSize: '12px',
                      }}
                    >
                      <h6 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#420071' }}>
                        Create Blog Post
                      </h6>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                        <input
                          placeholder="Article Title *"
                          value={newBlog.title}
                          onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                          required
                        />
                        <input
                          placeholder="Author Name"
                          value={newBlog.author_name}
                          onChange={(e) => setNewBlog({ ...newBlog, author_name: e.target.value })}
                        />
                        <input
                          placeholder="Cover Image URL (/assets/img_027.jpg)"
                          value={newBlog.cover_image}
                          onChange={(e) => setNewBlog({ ...newBlog, cover_image: e.target.value })}
                        />
                        <select
                          value={newBlog.status}
                          onChange={(e) => setNewBlog({ ...newBlog, status: e.target.value })}
                        >
                          <option value="PUBLISHED">Published</option>
                          <option value="DRAFT">Draft</option>
                        </select>
                        <div style={{ gridColumn: 'span 2' }}>
                          <textarea
                            rows="4"
                            placeholder="Write your article body paragraphs here... Separate paragraphs with a blank line."
                            value={newBlog.body}
                            onChange={(e) => setNewBlog({ ...newBlog, body: e.target.value })}
                            required
                          ></textarea>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-purple"
                        style={{ marginTop: '10px', fontSize: '12px', padding: '6px 16px' }}
                      >
                        Publish Blog
                      </button>
                    </form>
                  )}

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#F9FAFB', textAlign: 'left' }}>
                        <th style={{ padding: '8px' }}>Title</th>
                        <th style={{ padding: '8px' }}>Author</th>
                        <th style={{ padding: '8px' }}>Published Date</th>
                        <th style={{ padding: '8px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map((b) => (
                        <tr key={b.id} style={{ borderBottom: '1px solid #EEE' }}>
                          <td style={{ padding: '8px' }}>
                            <strong>{b.title}</strong>
                          </td>
                          <td style={{ padding: '8px', color: '#666' }}>{b.author_name}</td>
                          <td style={{ padding: '8px', color: '#888' }}>
                            {new Date(b.published_at).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteBlog(b.id)}
                              style={{
                                border: 'none',
                                background: '#FFEAEA',
                                color: '#C5221F',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB: NEWSLETTER SUBSCRIBERS */}
              {activeTab === 'newsletter' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '14px',
                    }}
                  >
                    <div>
                      <h5 style={{ margin: 0, color: '#420071', fontSize: '15px' }}>
                        Total Subscribers: {subscribersTotal}
                      </h5>
                    </div>

                    <a
                      href="http://localhost:5000/api/v1/admin/subscribers/export"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '6px 12px',
                        background: '#EDE6F7',
                        color: '#420071',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      Export Emails CSV 📥
                    </a>
                  </div>

                  {subscribers.length === 0 ? (
                    <p style={{ color: '#888', fontSize: '13px' }}>No subscribers collected yet.</p>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ background: '#F9FAFB', textAlign: 'left' }}>
                          <th style={{ padding: '8px' }}>Subscriber Email</th>
                          <th style={{ padding: '8px' }}>Source</th>
                          <th style={{ padding: '8px' }}>Subscribed On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map((s) => (
                          <tr key={s.id} style={{ borderBottom: '1px solid #EEE' }}>
                            <td style={{ padding: '8px', fontWeight: 600 }}>{s.email}</td>
                            <td style={{ padding: '8px' }}>
                              <span
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  background: '#F3EBF9',
                                  fontSize: '11px',
                                }}
                              >
                                {s.source}
                              </span>
                            </td>
                            <td style={{ padding: '8px', color: '#888' }}>
                              {new Date(s.subscribed_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* TAB: STAFF ACCOUNTS (SUPER_ADMIN ONLY) */}
              {activeTab === 'staff' && currentUser?.role === 'SUPER_ADMIN' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '14px',
                    }}
                  >
                    <h5 style={{ margin: 0, color: '#420071', fontSize: '15px' }}>
                      All Staff Accounts ({staffList.length})
                    </h5>

                    <button
                      type="button"
                      onClick={() => setShowAddStaff(!showAddStaff)}
                      className="btn btn-purple"
                      style={{ fontSize: '12px', padding: '6px 14px' }}
                    >
                      {showAddStaff ? 'Cancel' : '+ Add Staff Account'}
                    </button>
                  </div>

                  {showAddStaff && (
                    <form
                      onSubmit={handleCreateStaff}
                      style={{
                        background: '#FAF7FD',
                        padding: '16px',
                        borderRadius: '10px',
                        marginBottom: '16px',
                        fontSize: '12px',
                      }}
                    >
                      <h6 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#420071' }}>
                        Direct Staff Creation (Pre-Approved)
                      </h6>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input
                          placeholder="Full Name *"
                          value={newStaff.name}
                          onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email Address *"
                          value={newStaff.email}
                          onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                          required
                        />
                        <input
                          type="password"
                          placeholder="Password *"
                          value={newStaff.password}
                          onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                          required
                        />
                        <select
                          value={newStaff.role}
                          onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                        >
                          <option value="HR_MANAGER">HR_MANAGER</option>
                          <option value="CONTENT_EDITOR">CONTENT_EDITOR</option>
                          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-purple"
                        style={{ marginTop: '10px', fontSize: '12px', padding: '6px 16px' }}
                      >
                        Create Account
                      </button>
                    </form>
                  )}

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#F9FAFB', textAlign: 'left' }}>
                        <th style={{ padding: '8px' }}>Name</th>
                        <th style={{ padding: '8px' }}>Email</th>
                        <th style={{ padding: '8px' }}>Role</th>
                        <th style={{ padding: '8px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffList.map((st) => (
                        <tr key={st.id} style={{ borderBottom: '1px solid #EEE' }}>
                          <td style={{ padding: '8px', fontWeight: 600 }}>{st.name}</td>
                          <td style={{ padding: '8px', color: '#666' }}>{st.email}</td>
                          <td style={{ padding: '8px' }}>
                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: '12px',
                                background: '#EDE6F7',
                                color: '#420071',
                                fontWeight: 700,
                              }}
                            >
                              {st.role}
                            </span>
                          </td>
                          <td style={{ padding: '8px' }}>
                            {st.id !== currentUser.id ? (
                              <button
                                type="button"
                                onClick={() => handleToggleStaff(st.id, st.is_active)}
                                style={{
                                  border: 'none',
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  background: st.is_active ? '#E8F5E9' : '#FFEAEA',
                                  color: st.is_active ? '#2E7D32' : '#C5221F',
                                  fontWeight: 700,
                                }}
                              >
                                {st.is_active ? 'Active' : 'Deactivated'}
                              </button>
                            ) : (
                              <span style={{ color: '#888', fontStyle: 'italic' }}>You (Current)</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
