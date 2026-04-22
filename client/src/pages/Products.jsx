import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCart, setShowCart] = useState(false);
  const { cartItems, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const { isAuthenticated, user } = useAuth();

  const categories = ['All', 'Hardware', 'Software', 'Services', 'Networking', 'Security', 'Other'];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const filters = selectedCategory && selectedCategory !== 'All' 
        ? { category: selectedCategory, available: 'true' } 
        : { available: 'true' };
      const data = await productAPI.getAll(filters);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated()) {
      // Redirect to login with return path
      navigate('/login', { state: { from: { pathname: '/products' } } });
      return;
    }
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Our Products</h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Premium IT solutions for your business</p>
            </div>
            <button 
              onClick={() => setShowCart(!showCart)}
              style={{
                background: 'white',
                color: '#667eea',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                position: 'relative',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              🛒 Cart ({getCartCount()})
              {getCartCount() > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#ff4757',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 0' }}>
        {/* Category Filter */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
              style={{
                padding: '0.6rem 1.2rem',
                border: 'none',
                borderRadius: '25px',
                background: (selectedCategory === cat || (selectedCategory === '' && cat === 'All')) ? '#667eea' : 'white',
                color: (selectedCategory === cat || (selectedCategory === '' && cat === 'All')) ? 'white' : '#333',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.3s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '1.2rem', color: '#666' }}>No products available</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {products.map(product => (
              <div key={product._id} style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}>
                <div style={{
                  height: '200px',
                  background: `url(${product.image}) center/cover`,
                  backgroundColor: '#f0f0f0',
                  position: 'relative'
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#667eea',
                    color: 'white',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {product.category}
                  </span>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>
                    {product.name}
                  </h3>
                  <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    {product.description.substring(0, 100)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: product.stock > 0 ? '#10b981' : '#ef4444' }}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: 'none',
                      borderRadius: '8px',
                      background: product.stock === 0 ? '#ccc' : '#667eea',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                      transition: 'background 0.3s'
                    }}
                    onMouseOver={(e) => {
                      if (product.stock > 0) e.target.style.background = '#5568d3';
                    }}
                    onMouseOut={(e) => {
                      if (product.stock > 0) e.target.style.background = '#667eea';
                    }}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '400px',
          maxWidth: '100%',
          height: '100vh',
          background: 'white',
          boxShadow: '-4px 0 12px rgba(0,0,0,0.2)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '2px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Your Cart</h2>
            <button onClick={() => setShowCart(false)} style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666'
            }}>×</button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666' }}>
                Your cart is empty
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item._id} style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  borderBottom: '1px solid #f0f0f0',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: `url(${item.image}) center/cover`,
                    backgroundColor: '#f0f0f0',
                    borderRadius: '8px'
                  }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.3rem' }}>{item.name}</h4>
                    <p style={{ color: '#667eea', fontWeight: 'bold', marginBottom: '0.5rem' }}>₹{item.price}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        style={{
                          width: '30px',
                          height: '30px',
                          border: '1px solid #ddd',
                          background: 'white',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}>-</button>
                      <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        style={{
                          width: '30px',
                          height: '30px',
                          border: '1px solid #ddd',
                          background: 'white',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}>+</button>
                      <button onClick={() => removeFromCart(item._id)}
                        style={{
                          marginLeft: 'auto',
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}>Remove</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div style={{ padding: '1.5rem', borderTop: '2px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <span>Total:</span>
                <span style={{ color: '#667eea' }}>₹{getCartTotal().toLocaleString()}</span>
              </div>
              <Link to="/checkout" onClick={() => setShowCart(false)}>
                <button style={{
                  width: '100%',
                  padding: '1rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: '#667eea',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Overlay */}
      {showCart && (
        <div onClick={() => setShowCart(false)} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 999
        }} />
      )}
    </div>
  );
};

export default Products;
