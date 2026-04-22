import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../utils/api';

const Profile = () => {
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || ''
      });
    }

    fetchOrders();
  }, [isAuthenticated, user, navigate]);

  const fetchOrders = async () => {
    try {
      const data = await userAPI.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

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
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: 'India'
        }
      };

      const data = await userAPI.updateProfile(updateData);
      
      if (data.token) {
        updateUser(data);
        alert('Profile updated successfully!');
        setEditing(false);
      } else if (data.message) {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      processing: '#8b5cf6',
      shipped: '#06b6d4',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem 0'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>My Account</h1>
          <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>Manage your profile and orders</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 0' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb' }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '1rem 2rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'profile' ? '3px solid #667eea' : 'none',
              color: activeTab === 'profile' ? '#667eea' : '#666',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '1rem 2rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'orders' ? '3px solid #667eea' : 'none',
              color: activeTab === 'orders' ? '#667eea' : '#666',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            My Orders ({orders.length})
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={{
            maxWidth: '700px',
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Profile Information</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    padding: '0.6rem 1.2rem',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    background: editing ? 'white' : '#f9fafb'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    background: editing ? 'white' : '#f9fafb'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    background: editing ? 'white' : '#f9fafb'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  disabled={!editing}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    background: editing ? 'white' : '#f9fafb'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!editing}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      background: editing ? 'white' : '#f9fafb'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!editing}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      background: editing ? 'white' : '#f9fafb'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    disabled={!editing}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      background: editing ? 'white' : '#f9fafb'
                    }}
                  />
                </div>
              </div>

              {editing && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '0.9rem',
                      background: loading ? '#ccc' : '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      // Reset form
                      setFormData({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        street: user.address?.street || '',
                        city: user.address?.city || '',
                        state: user.address?.state || '',
                        pincode: user.address?.pincode || ''
                      });
                    }}
                    style={{
                      flex: 1,
                      padding: '0.9rem',
                      background: '#e5e7eb',
                      color: '#333',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div style={{
                background: 'white',
                padding: '3rem',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>You haven't placed any orders yet</p>
                <button
                  onClick={() => navigate('/products')}
                  style={{
                    marginTop: '1rem',
                    padding: '0.8rem 2rem',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map(order => (
                  <div key={order._id} style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                          Order #{order.orderId}
                        </h3>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <span style={{
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        background: `${getStatusColor(order.orderStatus)}20`,
                        color: getStatusColor(order.orderStatus)
                      }}>
                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                      </span>
                    </div>

                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0'
                        }}>
                          <span>{item.name} × {item.quantity}</span>
                          <span style={{ fontWeight: '600' }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      borderTop: '2px solid #f0f0f0',
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}>
                      <span>Total Amount:</span>
                      <span style={{ color: '#667eea' }}>₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
