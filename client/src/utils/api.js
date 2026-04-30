import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ================= COMMON REQUEST ================= */
const apiRequest = async (
  endpoint,
  method = "GET",
  data = null,
  isAdmin = false,
) => {
 const token = isAdmin
  ? sessionStorage.getItem("adminToken")
  : sessionStorage.getItem("userToken");
  
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
  register: (userData) => apiRequest("/api/users/register", "POST", userData),

  login: (email, password) =>
    apiRequest("/api/users/login", "POST", { email, password }),

  getProfile: () => apiRequest("/api/users/profile"),

  updateProfile: (userData) => apiRequest("/api/users/profile", "PUT", userData),

  getOrders: () => apiRequest("/api/users/orders"),
};

/* ================= ADMIN APIs ================= */
export const adminAPI = {
  login: (email, password) =>
    apiRequest("/api/admin/login", "POST", { email, password }),

  register: (username, email, password) =>
    apiRequest("/api/admin/register", "POST", { username, email, password }),

  getProfile: () => apiRequest("/api/admin/profile", "GET", null, true),

  updateProfile: (adminData) =>
    apiRequest("/api/admin/update-profile", "PUT", adminData, true),
};

/* ================= PRODUCT APIs ================= */
export const productAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/api/products?${params}`);
  },

  getById: (id) => apiRequest(`/api/products/${id}`),

  // ✅ FILE UPLOAD SUPPORT
  create: (productData) => apiRequest("/api/products", "POST", productData, true),

  update: (id, productData) =>
    apiRequest(`/api/products/${id}`, "PUT", productData, true),

  delete: (id) => apiRequest(`/api/products/${id}`, "DELETE", null, true),

  toggleAvailability: (id) =>
    apiRequest(`/api/products/${id}/availability`, "PATCH", null, true),
};

/* ================= ORDER APIs ================= */
export const orderAPI = {
  createRazorpayOrder: (amount) =>
    apiRequest("/api/orders/create-razorpay-order", "POST", { amount }),

  verifyPayment: (paymentData) =>
    apiRequest("/api/orders/verify-payment", "POST", paymentData),

  create: (orderData) => apiRequest("/api/orders", "POST", orderData),

  getAll: () => apiRequest("/api/orders", "GET", null, true),

  getById: (id) => apiRequest(`/api/orders/${id}`),

  updateStatus: (id, orderStatus) =>
    apiRequest(`/api/orders/${id}/status`, "PUT", { orderStatus }, true),
};
