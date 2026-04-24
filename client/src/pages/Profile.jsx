import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../utils/api";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
      });
    }

    fetchOrders();
  }, [isAuthenticated, user, navigate]);

  const fetchOrders = async () => {
    try {
      const data = await userAPI.getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: "India",
        },
      };

      const data = await userAPI.updateProfile(updateData);

      if (data.token) {
        updateUser(data);
        toast.success("Profile updated successfully!");
        setEditing(false);
      } else if (data.message) {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating profile",
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      confirmed: "#3b82f6",
      processing: "#8b5cf6",
      shipped: "#06b6d4",
      delivered: "#10b981",
      cancelled: "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* HEADER */}
      <div className="py-4">
        <div className="container">
          <h1 className="fw-bold mb-1">My Account</h1>
          <p className="mb-0">Manage your profile and orders</p>
        </div>
      </div>

      <div className="container py-4">
        {/* TABS */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              My Orders ({orders.length})
            </button>
          </li>
        </ul>

        {activeTab === "profile" && (
          <div
            className="card shadow-sm border-0"
            style={{ maxWidth: "700px" }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Profile Information</h5>

                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="btn btn-primary btn-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editing}
                      required
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editing}
                      required
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-mobile"></i>
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editing}
                      required
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Street Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fa-solid fa-map-location-dot"></i>
                    </span>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      disabled={!editing}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">City</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fa-solid fa-city"></i>
                      </span>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={!editing}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">State</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fa-solid fa-flag-usa"></i>
                      </span>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        disabled={!editing}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Pincode</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fa-solid fa-location-dot"></i>
                      </span>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        disabled={!editing}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                {editing && (
                  <div className="d-flex gap-2 mt-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-100"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary w-100"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: user.name || "",
                          email: user.email || "",
                          phone: user.phone || "",
                          street: user.address?.street || "",
                          city: user.address?.city || "",
                          state: user.address?.state || "",
                          pincode: user.address?.pincode || "",
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <>
            {orders.length === 0 ? (
              <div className="card text-center p-5 shadow-sm">
                <p className="text-muted mb-3">
                  You haven't placed any orders yet
                </p>
                <button
                  onClick={() => navigate("/products")}
                  className="btn btn-primary"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {orders.map((order) => (
                  <div key={order._id} className="card shadow-sm border-0">
                    <div className="card-body">
                      {/* Header */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="fw-bold mb-1">
                            Order #{order.orderId}
                          </h6>
                          <small className="text-muted">
                            Placed on{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </small>
                        </div>

                        <span
                          className="badge"
                          style={{
                            backgroundColor: `${getStatusColor(order.orderStatus)}20`,
                            color: getStatusColor(order.orderStatus),
                          }}
                        >
                          {order.orderStatus}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="border-top pt-3">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="d-flex justify-content-between mb-2"
                          >
                            <span>
                              {item.name} × {item.quantity}
                            </span>
                            <span className="fw-semibold">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="border-top pt-3 mt-3 d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span className="text-primary">
                          ₹{order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
