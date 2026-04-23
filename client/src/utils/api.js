import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ================= COMMON REQUEST ================= */
const apiRequest = async (
  endpoint,
  method = "GET",
  data = null,
  isAdmin = false,
) => {
  const token = isAdmin
    ? localStorage.getItem("adminToken")
    : localStorage.getItem("userToken");

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // ✅ Handle FormData vs JSON
  if (!(data instanceof FormData) && data) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await axios({
      url: `${API_URL}${endpoint}`,
      method,
      headers,
      data, // axios handles both JSON & FormData automatically
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(errorMessage);
  }
};

/* ================= USER APIs ================= */
export const userAPI = {
  register: (userData) => apiRequest("/users/register", "POST", userData),

  login: (email, password) =>
    apiRequest("/users/login", "POST", { email, password }),

  getProfile: () => apiRequest("/users/profile"),

  updateProfile: (userData) => apiRequest("/users/profile", "PUT", userData),

  getOrders: () => apiRequest("/users/orders"),
};

/* ================= ADMIN APIs ================= */
export const adminAPI = {
  login: (email, password) =>
    apiRequest("/admin/login", "POST", { email, password }),

  register: (username, email, password) =>
    apiRequest("/admin/register", "POST", { username, email, password }),

  getProfile: () => apiRequest("/admin/profile", "GET", null, true),
};

/* ================= PRODUCT APIs ================= */
export const productAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/products?${params}`);
  },

  getById: (id) => apiRequest(`/products/${id}`),

  // ✅ FILE UPLOAD SUPPORT
  create: (productData) => apiRequest("/products", "POST", productData, true),

  update: (id, productData) =>
    apiRequest(`/products/${id}`, "PUT", productData, true),

  delete: (id) => apiRequest(`/products/${id}`, "DELETE", null, true),

  toggleAvailability: (id) =>
    apiRequest(`/products/${id}/availability`, "PATCH", null, true),
};

/* ================= ORDER APIs ================= */
export const orderAPI = {
  createRazorpayOrder: (amount) =>
    apiRequest("/orders/create-razorpay-order", "POST", { amount }),

  verifyPayment: (paymentData) =>
    apiRequest("/orders/verify-payment", "POST", paymentData),

  create: (orderData) => apiRequest("/orders", "POST", orderData),

  getAll: () => apiRequest("/orders", "GET", null, true),

  getById: (id) => apiRequest(`/orders/${id}`),

  updateStatus: (id, orderStatus) =>
    apiRequest(`/orders/${id}/status`, "PUT", { orderStatus }, true),
};
