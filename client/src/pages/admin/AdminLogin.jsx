import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../utils/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await adminAPI.login(formData.email, formData.password);
      
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminData', JSON.stringify(data));
        navigate('/admin/dashboard');
      } else if (data.message) {
        setError(data.message);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        padding: '3rem',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>
            Admin Login
          </h1>
          <p style={{ color: '#666' }}>Sign in to access the admin panel</p>
        </div>

        {error && (
          <div style={{
            padding: '0.8rem',
            background: '#fee2e2',
            color: '#dc2626',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.9rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.9rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: loading ? '#9ca3af' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => {
              if (!loading) e.target.style.background = '#5568d3';
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.background = '#667eea';
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
          <p>For first time setup, use the register endpoint</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
