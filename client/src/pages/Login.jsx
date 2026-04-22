import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const from = location.state?.from?.pathname || '/products';

  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await userAPI.login(loginForm.email, loginForm.password);
      
      if (data.token) {
        login(data);
        navigate(from, { replace: true });
      } else if (data.message) {
        setError(data.message);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters');
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
          country: 'India'
        }
      };

      const data = await userAPI.register(userData);
      
      if (data.token) {
        login(data);
        navigate(from, { replace: true });
      } else if (data.message) {
        setError(data.message);
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '1rem 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="container">
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: isLogin ? '1fr' : '1fr', gap: 0 }}>
            {/* Login/Register Form */}
            <div style={{ padding: '3rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p style={{ color: '#666' }}>
                  {isLogin ? 'Sign in to continue shopping' : 'Register to start shopping'}
                </p>
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

              {isLogin ? (
                <form onSubmit={handleLoginSubmit}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.9rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.9rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
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
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={registerForm.name}
                        onChange={handleRegisterChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={registerForm.phone}
                        onChange={handleRegisterChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                        required
                        minLength={6}
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={registerForm.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={registerForm.street}
                      onChange={handleRegisterChange}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={registerForm.city}
                        onChange={handleRegisterChange}
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={registerForm.state}
                        onChange={handleRegisterChange}
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={registerForm.pincode}
                        onChange={handleRegisterChange}
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
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
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              )}

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: '#666' }}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#667eea',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    {isLogin ? 'Register' : 'Sign In'}
                  </button>
                </p>
              </div>

              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <Link to="/products" style={{ color: '#666', fontSize: '0.9rem', textDecoration: 'none' }}>
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
