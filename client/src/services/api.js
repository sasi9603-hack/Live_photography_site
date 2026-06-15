const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';


// Helper to get auth header
const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const api = {
  // Authentication
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
    return data;
  },

  // Events Management
  async getEvents() {
    const res = await fetch(`${API_BASE}/events`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch events');
    return data;
  },

  async createEvent(eventData) {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(eventData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create event');
    return data;
  },

  async deleteEvent(id) {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete event');
    return data;
  },

  // Photo Uploads
  async uploadPhotos(eventId, files) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }

    const res = await fetch(`${API_BASE}/events/${eventId}/photos`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to upload photos');
    return data;
  },

  // Public Gallery access
  async getGallery(code) {
    const res = await fetch(`${API_BASE}/events/gallery/${code}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load gallery');
    return data;
  },

  async incrementDownloads(code) {
    const res = await fetch(`${API_BASE}/events/gallery/${code}/download`, {
      method: 'PUT'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to register download');
    return data;
  },

  // Face Recognition APIs
  async searchFace(eventId, selfieFile, threshold = 0.85) {
    const formData = new FormData();
    formData.append('selfie', selfieFile);
    formData.append('threshold', threshold);

    const res = await fetch(`${API_BASE}/events/${eventId}/face-search`, {
      method: 'POST',
      headers: getHeaders(true), // multipart/form-data
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Face search failed');
    return data;
  },

  async getFaceStats() {
    const res = await fetch(`${API_BASE}/events/stats/face-recognition`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch face recognition stats');
    return data;
  }
};

export default api;
