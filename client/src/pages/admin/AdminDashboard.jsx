import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productAPI, orderAPI } from "../../utils/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Hardware",
    image: null,
    stock: "",
    isAvailable: true,
    features: "",
    specifications: "",
  });

  const categories = [
    "Hardware",
    "Software",
    "Services",
    "Networking",
    "Security",
    "Other",
  ];

  useEffect(() => {
    checkAuth();
    fetchProducts();
    fetchOrders();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin/login");
  };

  const fetchProducts = async () => {
    try {
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (error) {
      alert("Error fetching products: " + error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await orderAPI.getAll();
      setOrders(data);
    } catch (error) {
      alert("Error fetching orders: " + error.message);
    }
  };

  const handleProductFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setProductForm({
        ...productForm,
        image: files[0], // ✅ store file
      });
    } else {
      setProductForm({
        ...productForm,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", productForm.name);
      formData.append("description", productForm.description);
      formData.append("price", parseFloat(productForm.price));
      formData.append("category", productForm.category);
      formData.append("stock", parseInt(productForm.stock));
      formData.append("isAvailable", productForm.isAvailable);

      if (productForm.image instanceof File) {
        formData.append("image", productForm.image);
      }

      const featuresObject = {};

      productForm.features
        ?.split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .forEach((line, index) => {
          // remove "feature1:" if user typed it
          const cleanedValue = line.includes(":")
            ? line.split(":").slice(1).join(":").trim()
            : line;

          featuresObject[`feature${index + 1}`] = cleanedValue;
        });

      formData.append("features", JSON.stringify(featuresObject));

      const specsObject = {};

      productForm.specifications
        ?.split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && line.includes(":"))
        .forEach((line) => {
          const [key, ...rest] = line.split(":");
          specsObject[key.trim()] = rest.join(":").trim();
        });

      formData.append("specifications", JSON.stringify(specsObject));

      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }

      if (editingProduct) {
        await productAPI.update(editingProduct._id, formData);
      } else {
        await productAPI.create(formData);
      }

      resetProductForm();
      fetchProducts();
      setShowProductModal(false);
    } catch (error) {
      alert("Error saving product: " + error.message);
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
      image: null,
      stock: product.stock,
      isAvailable: product.isAvailable,
      features: product.features
        ? Object.entries(product.features)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n")
        : "",
      specifications: product.specifications
        ? Object.entries(product.specifications)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n")
        : "",
    });

    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productAPI.delete(id);
        alert("Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        alert("Error deleting product: " + error.message);
      }
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      await productAPI.toggleAvailability(id);
      fetchProducts();
    } catch (error) {
      alert("Error toggling availability: " + error.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      alert("Order status updated!");
      fetchOrders();
    } catch (error) {
      alert("Error updating order status: " + error.message);
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "Hardware",
      image: "",
      stock: "",
      isAvailable: true,
      features: "",
      specifications: "",
    });
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* HEADER */}
      <div className="bg-primary text-white py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="h4 fw-bold mb-0">Admin Dashboard</h1>
          <button onClick={handleLogout} className="btn btn-outline-light">
            Logout
          </button>
        </div>
      </div>

      <div className="container py-4">
        {/* TABS */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              Products ({products.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Orders ({orders.length})
            </button>
          </li>
        </ul>

        {activeTab === "products" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 fw-bold mb-0">Manage Products</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  resetProductForm();
                  setShowProductModal(true);
                }}
              >
                + Add Product
              </button>
            </div>

            <div className="table-responsive bg-white rounded shadow-sm">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="product-img-sm"
                            style={{ backgroundImage: `url(${product.image})` }}
                          />
                          <span className="fw-semibold">{product.name}</span>
                        </div>
                      </td>

                      <td>{product.category}</td>
                      <td className="fw-semibold">₹{product.price}</td>
                      <td>{product.stock}</td>

                      <td>
                        <span
                          className={`badge ${
                            product.isAvailable ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {product.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>

                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="btn btn-primary"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleToggleAvailability(product._id)
                            }
                            className={`btn ${
                              product.isAvailable
                                ? "btn-warning"
                                : "btn-success"
                            }`}
                          >
                            {product.isAvailable ? "Hide" : "Show"}
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="btn btn-danger"
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
          </>
        )}

        {activeTab === "orders" && (
          <>
            <h2 className="h5 fw-bold mb-3">Manage Orders</h2>

            <div className="table-responsive bg-white rounded shadow-sm">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="fw-semibold">{order.orderId}</td>

                      <td>
                        <div>{order.customerInfo.name}</div>
                        <small className="text-muted">
                          {order.customerInfo.email}
                        </small>
                      </td>

                      <td>{order.items.length} items</td>

                      <td className="fw-semibold">
                        ₹{order.totalAmount.toLocaleString()}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            order.paymentInfo.paymentStatus === "completed"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {order.paymentInfo.paymentStatus}
                        </span>
                      </td>

                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order._id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => alert(JSON.stringify(order, null, 2))}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showProductModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowProductModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleSubmitProduct}>
                  <div className="mb-3">
                    <label className="form-label">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={productForm.name}
                      onChange={handleProductFormChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description *</label>
                    <textarea
                      name="description"
                      value={productForm.description}
                      onChange={handleProductFormChange}
                      className="form-control"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Price *</label>
                      <input
                        type="number"
                        name="price"
                        value={productForm.price}
                        onChange={handleProductFormChange}
                        className="form-control"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Features (one per line)
                      </label>
                      <textarea
                        name="features"
                        value={productForm.features}
                        onChange={handleProductFormChange}
                        className="form-control"
                        rows="3"
                        placeholder={`Feature 1\nFeature 2\nFeature 3`}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        Specifications (one per line)
                      </label>
                      <textarea
                        name="specifications"
                        value={productForm.specifications}
                        onChange={handleProductFormChange}
                        className="form-control"
                        rows="3"
                        placeholder={`RAM: 8GB\nStorage: 256GB\nProcessor: i5`}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Stock *</label>
                      <input
                        type="number"
                        name="stock"
                        value={productForm.stock}
                        onChange={handleProductFormChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Category *</label>
                    <select
                      name="category"
                      value={productForm.category}
                      onChange={handleProductFormChange}
                      className="form-select"
                    >
                      {categories.map((cat) => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Product Image *</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleProductFormChange}
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="isAvailable"
                      checked={productForm.isAvailable}
                      onChange={handleProductFormChange}
                    />
                    <label className="form-check-label">
                      Available for purchase
                    </label>
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-primary w-100" type="submit">
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary w-100"
                      onClick={() => setShowProductModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
