import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await adminAPI.login(formData.email, formData.password);
      
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminData', JSON.stringify(data));
        navigate('/admin/dashboard');
      } else if (data.message) {
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="d-flex align-items-center justify-content-center py-4">
    <div className="card shadow-lg border-0 p-4 p-md-5 auth-card">
      <img src="/gauri.png" alt="Logo" className="mb-4 w-50 mx-auto"/>
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="fw-bold">Admin Login</h1>
        <p className="text-muted mb-0">
          Sign in to access the admin panel
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        
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
              value={formData.email}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Footer */}
      <div className="text-center text-muted small mt-4">
        For first time setup, use the register endpoint
      </div>

    </div>
  </div>
);
};

export default AdminLogin;
