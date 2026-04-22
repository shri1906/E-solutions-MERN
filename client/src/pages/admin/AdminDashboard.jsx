import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, orderAPI } from '../../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Hardware',
    image: '',
    stock: '',
    isAvailable: true,
    features: '',
    specifications: ''
  });

  const categories = ['Hardware', 'Software', 'Services', 'Networking', 'Security', 'Other'];

  useEffect(() => {
    checkAuth();
    fetchProducts();
    fetchOrders();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  const fetchProducts = async () => {
    try {
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await orderAPI.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleProductFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm({
      ...productForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        features: productForm.features ? productForm.features.split('\n').filter(f => f.trim()) : [],
        specifications: productForm.specifications ? JSON.parse(productForm.specifications) : {}
      };

      if (editingProduct) {
        await productAPI.update(editingProduct._id, productData);
        alert('Product updated successfully!');
      } else {
        await productAPI.create(productData);
        alert('Product created successfully!');
      }

      resetProductForm();
      fetchProducts();
      setShowProductModal(false);
    } catch (error) {
      alert('Error saving product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
      isAvailable: product.isAvailable,
      features: product.features?.join('\n') || '',
      specifications: JSON.stringify(Object.fromEntries(product.specifications || new Map()), null, 2)
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        alert('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        alert('Error deleting product: ' + error.message);
      }
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      await productAPI.toggleAvailability(id);
      fetchProducts();
    } catch (error) {
      alert('Error toggling availability: ' + error.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      alert('Order status updated!');
      fetchOrders();
    } catch (error) {
      alert('Error updating order status: ' + error.message);
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'Hardware',
      image: '',
      stock: '',
      isAvailable: true,
      features: '',
      specifications: ''
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1.5rem 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Admin Dashboard</h1>
          <button onClick={handleLogout} style={{
            padding: '0.6rem 1.2rem',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid white',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}>
            Logout
          </button>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 0' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb' }}>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '1rem 2rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'products' ? '3px solid #667eea' : 'none',
              color: activeTab === 'products' ? '#667eea' : '#666',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Products ({products.length})
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
            Orders ({orders.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Manage Products</h2>
              <button
                onClick={() => {
                  resetProductForm();
                  setShowProductModal(true);
                }}
                style={{
                  padding: '0.8rem 1.5rem',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                + Add Product
              </button>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Product</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Category</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Price</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Stock</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            width: '50px',
                            height: '50px',
                            background: `url(${product.image}) center/cover`,
                            backgroundColor: '#f0f0f0',
                            borderRadius: '6px'
                          }} />
                          <span style={{ fontWeight: '600' }}>{product.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>{product.category}</td>
                      <td style={{ padding: '1rem', fontWeight: '600' }}>₹{product.price}</td>
                      <td style={{ padding: '1rem' }}>{product.stock}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.3rem 0.8rem',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          background: product.isAvailable ? '#d1fae5' : '#fee2e2',
                          color: product.isAvailable ? '#059669' : '#dc2626'
                        }}>
                          {product.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleEditProduct(product)}
                            style={{
                              padding: '0.4rem 0.8rem',
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleAvailability(product._id)}
                            style={{
                              padding: '0.4rem 0.8rem',
                              background: product.isAvailable ? '#f59e0b' : '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                              cursor: 'pointer'
                            }}
                          >
                            {product.isAvailable ? 'Hide' : 'Show'}
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            style={{
                              padding: '0.4rem 0.8rem',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Manage Orders</h2>
            
            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Order ID</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Customer</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Items</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Total</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Payment</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '1rem', fontWeight: '600' }}>{order.orderId}</td>
                      <td style={{ padding: '1rem' }}>
                        <div>{order.customerInfo.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>{order.customerInfo.email}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>{order.items.length} items</td>
                      <td style={{ padding: '1rem', fontWeight: '600' }}>₹{order.totalAmount.toLocaleString()}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.3rem 0.8rem',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          background: order.paymentInfo.paymentStatus === 'completed' ? '#d1fae5' : '#fef3c7',
                          color: order.paymentInfo.paymentStatus === 'completed' ? '#059669' : '#d97706'
                        }}>
                          {order.paymentInfo.paymentStatus}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          style={{
                            padding: '0.4rem 0.8rem',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '0.9rem'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button
                          onClick={() => alert(JSON.stringify(order, null, 2))}
                          style={{
                            padding: '0.4rem 0.8rem',
                            background: '#6366f1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <>
          <div onClick={() => setShowProductModal(false)} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }} />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            zIndex: 1000
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmitProduct}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={productForm.name}
                  onChange={handleProductFormChange}
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Description *</label>
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleProductFormChange}
                  required
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={productForm.price}
                    onChange={handleProductFormChange}
                    required
                    min="0"
                    step="0.01"
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
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={productForm.stock}
                    onChange={handleProductFormChange}
                    required
                    min="0"
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

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Category *</label>
                <select
                  name="category"
                  value={productForm.category}
                  onChange={handleProductFormChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={productForm.image}
                  onChange={handleProductFormChange}
                  placeholder="https://example.com/image.jpg"
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Features (one per line)
                </label>
                <textarea
                  name="features"
                  value={productForm.features}
                  onChange={handleProductFormChange}
                  rows="3"
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={productForm.isAvailable}
                    onChange={handleProductFormChange}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontWeight: '600' }}>Available for purchase</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
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
                  {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
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
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
