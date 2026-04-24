import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else if (user) {
      // Pre-fill form with user data
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
        country: user.address?.country || 'India'
      });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load Razorpay SDK. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // Create Razorpay order
      const totalAmount = getCartTotal();
      const razorpayOrder = await orderAPI.createRazorpayOrder(totalAmount);

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY', // Replace with your Razorpay key
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Gauri E-Solutions',
        description: 'Product Purchase',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verificationResult = await orderAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verificationResult.success) {
              // Create order in database
              const orderData = {
                customerInfo: {
                  name: formData.name,
                  email: formData.email,
                  phone: formData.phone,
                  address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    country: formData.country
                  }
                },
                items: cartItems.map(item => ({
                  product: item._id,
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price
                })),
                totalAmount,
                paymentInfo: {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  paymentStatus: 'completed'
                }
              };

              const order = await orderAPI.create(orderData);
              
              // Clear cart
              clearCart();
              
              // Navigate to success page
              toast.success('Payment successful! Order ID: ' + order.orderId);
              navigate('/order-success', { state: { order } });
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Failed to create order. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#667eea'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '3rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your cart is empty</h2>
          <button onClick={() => navigate('/products')} style={{
            padding: '0.8rem 2rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '3rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>Checkout</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Billing Form */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Billing Details</h2>
            <form onSubmit={handlePayment}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
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
                  background: loading ? '#ccc' : '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Processing...' : `Pay ₹${getCartTotal().toLocaleString()}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Order Summary</h2>
            
            {cartItems.map(item => (
              <div key={item._id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1rem 0',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.3rem' }}>{item.name}</h4>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Qty: {item.quantity}</p>
                </div>
                <span style={{ fontWeight: '600' }}>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 'bold' }}>
                <span>Total:</span>
                <span style={{ color: '#667eea' }}>₹{getCartTotal().toLocaleString()}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                🔒 Secure payment powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
