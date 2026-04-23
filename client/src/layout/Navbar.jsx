 import  { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user?.role === 'admin';

  // 🔥 THIS HIDES NAVBAR COMPLETELY FOR ADMIN
  if (isAdmin) return null;

  return (
    <nav className="navbar-custom">
      <div className="container d-flex align-items-center justify-content-between">
        
        <Link className="navbar-brand-custom" to="/">
          <img src="/gauri.png" alt="Gauri E-Solutions" />
        </Link>

        {/* Desktop */}
        <div className="d-none d-lg-flex align-items-center gap-4">
          {[
            { to: '/', label: 'Home' },
            { to: '/what-we-do', label: 'What We Do' },
            { to: '/who-we-are', label: 'Who We Are' },
            { to: '/products', label: 'Products' },
            { to: '/contact-us', label: 'Contact Us' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-link-custom${isActive ? ' active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}

          {isAuthenticated() ? (
            <div className="d-flex align-items-center gap-3">
              <NavLink to="/profile" className="nav-link-custom">
                My Account
              </NavLink>
              <button onClick={handleLogout} className="btn-primary-custom">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary-custom">
              Login / Register
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler-custom d-lg-none"
          onClick={() => setMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile */}
      <div className="container">
        <div className={`mobile-nav-menu${menuOpen ? ' open' : ''}`}>
          
          {[
            { to: '/', label: 'Home' },
            { to: '/what-we-do', label: 'What We Do' },
            { to: '/who-we-are', label: 'Who We Are' },
            { to: '/products', label: 'Products' },
            { to: '/contact-us', label: 'Contact Us' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="mobile-nav-link"
            >
              {label}
            </NavLink>
          ))}

          {isAuthenticated() ? (
            <>
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="mobile-nav-link"
              >
                My Account
              </NavLink>

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="btn btn-primary w-100 mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="mobile-nav-link btn btn-primary text-white mt-2"
            >
              Login / Register
            </NavLink>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;