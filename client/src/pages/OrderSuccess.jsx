import { useLocation, Link } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const { order } = location.state || {};

  return (
    <div
      className="d-flex align-items-center justify-content-center"
    >
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">
            <div className="card border-0 shadow-lg rounded-4 text-center p-4">
              <div className="mb-4">
                <div
                  className="mx-auto d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "#d1f7e8",
                    fontSize: "40px",
                  }}
                >
                  ✅
                </div>
              </div>
              <h2 className="fw-bold text-success mb-3">
                Order Placed Successfully!
              </h2>

              <p className="text-muted mb-4">
                Thank you for your purchase. Your order has been confirmed and will be processed shortly.
              </p>

              <div
                className="mb-4 p-3 rounded-3"
                style={{ backgroundColor: "#f1f3f5" }}
              >
                <span className="text-muted">Order ID</span>
                <h5 className="fw-bold mb-0 text-dark">
                  {order?.orderId || "N/A"}
                </h5>
              </div>

              <div className="d-flex justify-content-center flex-wrap">
                <Link to="/" className="btn btn-success px-4">
                  Continue Shopping
                </Link>
              </div>

              <p className="text-muted small mt-4 mb-0">
                A confirmation email has been sent with your order details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;