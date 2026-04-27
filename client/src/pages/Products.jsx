import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { productAPI } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
  } = useCart();
  const { isAuthenticated, user } = useAuth();

  const categories = [
    "All",
    "Hardware",
    "Software",
    "Services",
    "Networking",
    "Security",
    "Other",
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const filters =
        selectedCategory && selectedCategory !== "All"
          ? { category: selectedCategory, available: "true" }
          : { available: "true" };
      const data = await productAPI.getAll(filters);
      setProducts(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: { pathname: "/products" } } });
      return;
    }
    const existingItem = cartItems.find((item) => item._id === product._id);
    const currentQty = existingItem ? existingItem.quantity : 0;

    if (currentQty >= product.stock) {
      toast.error("Maximum available quantity reached");
      return;
    }

     addToCart({ ...product, stock: product.stock });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="py-4">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 className="fw-bold mb-1">Our Products</h1>
              <p className="mb-0 opacity-75">
                Premium IT solutions for your business
              </p>
            </div>

            <button
              onClick={() => setShowCart(!showCart)}
              className="btn-primary-cart position-relative fw-semibold"
            >
              <i className="fa-solid fa-cart-plus"></i> Cart ({getCartCount()})
              {getCartCount() > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-5">
        <div className="mb-4 d-flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === "All" ? "" : cat)}
              className={`btn rounded-pill ${
                selectedCategory === cat ||
                (selectedCategory === "" && cat === "All")
                  ? "btn-primary"
                  : "btn-outline-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="text-center py-5 text-muted">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-5 text-muted">
            No products available
          </div>
        ) : (

          <div className="row g-4">
            {products.map((product) => (
              <div key={product._id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0 product-card">
                  <div
                    className="card h-100 shadow-sm border-0 product-card"
                    onClick={() => setSelectedProduct(product)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Image */}
                    <div className="card-img-top position-relative product-img">
                      <img
                        src={`${BACKEND_URL}${product.image}`}
                        alt={product.name}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <span className="category-tag position-absolute top-0 end-0 m-2">
                        {product.category}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="card-body d-flex flex-column">
                      <h5 className="fw-bold">{product.name}</h5>

                      <p className="text-muted small flex-grow-1">
                        {product.description.substring(0, 100)}...
                      </p>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-bold price-tag fs-5">
                          ₹{product.price.toLocaleString()}
                        </span>

                        <span
                          className={`small ${
                            product.stock > 0 ? "text-success" : "text-danger"
                          }`}
                        >
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={product.stock === 0}
                      className={`${
                        product.stock === 0
                          ? "btn-secondary"
                          : "btn-primary-cart"
                      }`}
                    >
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <>
          <div className="cart-sidebar bg-white shadow position-fixed top-0 end-0 h-100 d-flex flex-column">
            {/* Header */}
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">
                <i className="fa-solid fa-cart-plus"></i> Your Cart
              </h5>
              <button
                onClick={() => setShowCart(false)}
                className="btn-close"
              ></button>
            </div>
            <div className="flex-grow-1 overflow-auto p-3">
              {cartItems.length === 0 ? (
                <div className="text-center text-muted py-5">
                  Your cart is empty
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="d-flex gap-3 mb-3 border-bottom pb-3"
                  >
                    <img
                      alt={item.name}
                      src={`${BACKEND_URL}${item.image}`}
                      className="cart-img"
                    />

                    <div className="flex-grow-1">
                      <h6 className="fw-semibold mb-1">{item.name}</h6>
                      <p className="price-tag fw-bold mb-2">₹{item.price}</p>

                      <div className="d-flex align-items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="btn btn-sm btn-outline-secondary"
                        >
                          -
                        </button>

                        <span className="fw-semibold">{item.quantity}</span>

                        <button
                          disabled={item.quantity >= item.stock}
                          onClick={() => {
                            if (item.quantity >= item.stock) {
                              toast.error("Maximum available quantity reached");
                              return;
                            }
                            updateQuantity(item._id, item.quantity + 1);
                          }}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          +
                        </button>

                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="btn btn-sm text-danger ms-auto"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-3 border-top">
                <div className="d-flex justify-content-between fw-bold mb-3">
                  <span>Total:</span>
                  <span className="price-tag">
                    ₹{getCartTotal().toLocaleString()}
                  </span>
                </div>

                <Link className="checkout-link" to="/checkout" onClick={() => setShowCart(false)}>
                  <button className="btn-primary-cart w-100">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Overlay */}
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50"
            onClick={() => setShowCart(false)}
          ></div>
        </>
      )}
      {selectedProduct && (
        <>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                {/* Header */}
                <div className="modal-header">
                  <h5 className="modal-title ">{selectedProduct.name}</h5>
                  <button
                    className="btn-close"
                    onClick={() => setSelectedProduct(null)}
                  ></button>
                </div>

                {/* Body */}
                <div className="modal-body">
                  <div className="row">
                    {/* Image */}
                    <div className="col-md-6">
                      <img
                        src={`${BACKEND_URL}${selectedProduct.image}`}
                        alt={selectedProduct.name}
                        className="img-fluid rounded"
                      />
                    </div>

                    {/* Details */}
                    <div className="col-md-6">
                      <p className="product-desc">
                        {selectedProduct.description}
                      </p>

                      <h5 className="price-tag">
                        ₹{selectedProduct.price.toLocaleString()}
                      </h5>

                      <p>
                        <strong>Status:</strong>
                        {selectedProduct.stock > 0
                          ? `${selectedProduct.stock} in stock`
                          : "Out of stock"}
                      </p>

                      {/* Features */}
                      <h6>Features:</h6>
                      <ul>
                        {Object.values(selectedProduct.features || {}).map(
                          (value, index) => (
                            <li key={index}>{value}</li>
                          ),
                        )}
                      </ul>

                      {/* Specifications */}
                      <h6>Specifications:</h6>
                      <ul>
                        {Object.entries(
                          selectedProduct.specifications || {},
                        ).map(([key, value]) => (
                          <li key={key}>
                            <strong>{key}:</strong> {value}
                          </li>
                        ))}
                      </ul>

                      <button
                        className="btn-primary-cart w-100 mt-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(selectedProduct);
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay */}
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50"
            onClick={() => setSelectedProduct(null)}
          ></div>
        </>
      )}
    </div>
  );
};

export default Products;
