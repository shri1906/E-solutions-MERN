import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Footer from "./layout/Footer";
import Home from "./pages/Home";
import Navbar from "./layout/Navbar";
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import OrderSuccess from "./pages/OrderSuccess";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <CartProvider>
        {!isAdminRoute && <Navbar />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/who-we-are" element={<About />} />
          <Route path="/what-we-do" element={<Features />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>

        {!isAdminRoute && <Footer />}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
