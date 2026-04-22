const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to get user auth headers
const getUserAuthHeaders = () => {
  const token = localStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// User APIs
export const userAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: getUserAuthHeaders()
    });
    return response.json();
  },

  updateProfile: async (userData) => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: getUserAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  getOrders: async () => {
    const response = await fetch(`${API_URL}/users/orders`, {
      headers: getUserAuthHeaders()
    });
    return response.json();
  }
};

// Admin APIs
export const adminAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  register: async (username, email, password) => {
    const response = await fetch(`${API_URL}/admin/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_URL}/admin/profile`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Product APIs
export const productAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/products?${params}`);
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    return response.json();
  },

  create: async (productData) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    return response.json();
  },

  update: async (id, productData) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  toggleAvailability: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}/availability`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Order APIs
export const orderAPI = {
  createRazorpayOrder: async (amount) => {
    const response = await fetch(`${API_URL}/orders/create-razorpay-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    return response.json();
  },

  verifyPayment: async (paymentData) => {
    const response = await fetch(`${API_URL}/orders/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return response.json();
  },

  create: async (orderData) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/orders`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/orders/${id}`);
    return response.json();
  },

  updateStatus: async (id, orderStatus) => {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderStatus })
    });
    return response.json();
  }
};
