import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../utils/api";
import toast from "react-hot-toast";
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const from = location.state?.from?.pathname || "/products";

  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await userAPI.login(loginForm.email, loginForm.password);

      if (data.token) {
        login(data);
        navigate(from, { replace: true });
      } else if (data.message) {
        toast.success(data.message);
      }
    } catch (error) {
    toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (registerForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        phone: registerForm.phone,
        address: {
          street: registerForm.street,
          city: registerForm.city,
          state: registerForm.state,
          pincode: registerForm.pincode,
          country: "India",
        },
      };

      const data = await userAPI.register(userData);

      if (data.token) {
        login(data);
        navigate(from, { replace: true });
      } else if (data.message) {
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-4 bg-light">
      <div className="container">
        <div
          className="mx-auto shadow-lg rounded-4 overflow-hidden bg-white"
          style={{ maxWidth: "450px" }}
        >
          <div className="row g-0">
            <div className="col-12 p-5">
              {/* Header */}
              <div className="text-center mb-4">
                <h1 className="fw-bold">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h1>
                <p className="text-muted">
                  {isLogin
                    ? "Sign in to continue shopping"
                    : "Register to start shopping"}
                </p>
              </div>
              {/* LOGIN FORM */}
              {isLogin ? (
                <form onSubmit={handleLoginSubmit}>
                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={loginForm.email}
                        onChange={handleLoginChange}
                        required
                        className="form-control"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-lock"></i>
                      </span>
                      <input
                        type="password"
                        name="password"
                        value={loginForm.password}
                        onChange={handleLoginChange}
                        required
                        className="form-control"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-100"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>
              ) : (
                /* REGISTER FORM */
                <form onSubmit={handleRegisterSubmit}>
                  {/* Full Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Full Name *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-user"></i>
                      </span>
                      <input
                        type="text"
                        name="name"
                        value={registerForm.name}
                        onChange={handleRegisterChange}
                        required
                        className="form-control"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Phone *</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-phone"></i>
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={registerForm.phone}
                        onChange={handleRegisterChange}
                        required
                        className="form-control"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email *</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={registerForm.email}
                        onChange={handleRegisterChange}
                        required
                        className="form-control"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password *</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-lock"></i>
                      </span>
                      <input
                        type="password"
                        name="password"
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                        required
                        className="form-control"
                        placeholder="Enter password"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Confirm Password *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-lock"></i>
                      </span>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={registerForm.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                        className="form-control"
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>

                  {/* Street */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Street Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-road"></i>
                      </span>
                      <input
                        type="text"
                        name="street"
                        value={registerForm.street}
                        onChange={handleRegisterChange}
                        className="form-control"
                        placeholder="Enter street address"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">City</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-city"></i>
                      </span>
                      <input
                        type="text"
                        name="city"
                        value={registerForm.city}
                        onChange={handleRegisterChange}
                        className="form-control"
                        placeholder="Enter city"
                      />
                    </div>
                  </div>

                  {/* State */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">State</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-map"></i>
                      </span>
                      <input
                        type="text"
                        name="state"
                        value={registerForm.state}
                        onChange={handleRegisterChange}
                        className="form-control"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>

                  {/* Pincode */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Pincode</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-mail-bulk"></i>
                      </span>
                      <input
                        type="text"
                        name="pincode"
                        value={registerForm.pincode}
                        onChange={handleRegisterChange}
                        className="form-control"
                        placeholder="Enter pincode"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-100"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </form>
              )}

              {/* Toggle */}
              <div className="text-center mt-4">
                <p className="text-muted">
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                    }}
                    className="btn btn-link p-0 fw-semibold"
                  >
                    {isLogin ? "Register" : "Sign In"}
                  </button>
                </p>
              </div>

              {/* Back */}
              <div className="text-center mt-2">
                <Link
                  to="/products"
                  className="text-muted small text-decoration-none"
                >
                  ← Back to Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
