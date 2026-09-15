const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Token management helpers
 */
export const tokenStorage = {
  get: () => localStorage.getItem('herspace_token'),
  set: (token) => localStorage.setItem('herspace_token', token),
  remove: () => localStorage.removeItem('herspace_token')
};

/**
 * Generic API request wrapper
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = tokenStorage.get();

  const defaultHeaders = {
    Accept: 'application/json',
  };

  // Add Auth header if token exists
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Only add Content-Type: application/json if body is NOT FormData
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Auto logout on 401 Unauthorized
      if (response.status === 401 && token) {
        tokenStorage.remove();
      }

      const errorMessage =
        data?.message ||
        data?.errors?.[0]?.message ||
        `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (!error.status) {
      // Network error (server offline / connection refused)
      throw new Error('Unable to connect to HerSpace server. Please check your network or try again shortly.');
    }
    throw error;
  }
}

/**
 * Auth API
 */
export const authApi = {
  login: async (email, password) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res?.data?.token) {
      tokenStorage.set(res.data.token);
    }
    return res;
  },
  register: (registrationData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    }),
  verifyEmail: (token) =>
    request(`/auth/verify-email?token=${token}`, {
      method: 'GET',
    }),
  getMe: () => request('/auth/me'),
  logout: () => {
    tokenStorage.remove();
  },
  getToken: () => tokenStorage.get()
};


/**
 * Admin API
 */
export const adminApi = {
  // Volunteers
  getVolunteers: (status, search) => {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') params.append('status', status);
    if (search) params.append('search', search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request(`/admin/volunteers${qs}`);
  },
  updateVolunteer: (id, payload) =>
    request(`/admin/volunteers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  exportVolunteersUrl: () => `${API_BASE_URL}/admin/volunteers/export`,

  // Internships & Applications
  createInternship: (jobData) =>
    request('/admin/internships', {
      method: 'POST',
      body: JSON.stringify(jobData),
    }),
  updateInternship: (id, jobData) =>
    request(`/admin/internships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    }),
  deleteInternship: (id) =>
    request(`/admin/internships/${id}`, {
      method: 'DELETE',
    }),
  getApplications: (status, internship_id) => {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') params.append('status', status);
    if (internship_id) params.append('internship_id', internship_id);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request(`/admin/applications${qs}`);
  },
  updateApplication: (id, payload) =>
    request(`/admin/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  // Blogs
  createBlog: (blogData) =>
    request('/admin/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData),
    }),
  updateBlog: (id, blogData) =>
    request(`/admin/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData),
    }),
  deleteBlog: (id) =>
    request(`/admin/blogs/${id}`, {
      method: 'DELETE',
    }),

  // Newsletter
  getSubscribers: () => request('/admin/subscribers'),
  exportSubscribersUrl: () => `${API_BASE_URL}/admin/subscribers/export`,

  // Staff (SUPER_ADMIN only)
  getStaff: () => request('/admin/staff'),
  createStaff: (staffData) =>
    request('/admin/staff', {
      method: 'POST',
      body: JSON.stringify(staffData),
    }),
  toggleStaffStatus: (id, is_active) =>
    request(`/admin/staff/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active }),
    }),

  // Registrations & Approvals (SUPER_ADMIN only)
  getRegistrations: () => request('/admin/registrations'),
  approveRegistration: (id) =>
    request(`/admin/registrations/${id}/approve`, {
      method: 'PATCH',
    }),
  rejectRegistration: (id) =>
    request(`/admin/registrations/${id}`, {
      method: 'DELETE',
    }),
};


/**
 * Newsletter API (Public)
 */
export const newsletterApi = {
  subscribe: (email, source = 'FOOTER') =>
    request('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, source }),
    }),
};

/**
 * Volunteers API (Public)
 */
export const volunteersApi = {
  apply: (applicationData) =>
    request('/volunteers/apply', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    }),
};

/**
 * Internships API (Public)
 */
export const internshipsApi = {
  getAll: () => request('/internships'),
  getById: (id) => request(`/internships/${id}`),
  apply: (formData) =>
    request('/internships/apply', {
      method: 'POST',
      body: formData,
    }),
};

/**
 * Blogs API (Public)
 */
export const blogsApi = {
  getAll: () => request('/blogs'),
  getBySlug: (slug) => request(`/blogs/${slug}`),
};
