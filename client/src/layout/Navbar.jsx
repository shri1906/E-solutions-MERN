import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar-custom">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link className="navbar-brand-custom" to="/">
          <img src="/gauri.png" alt="Gauri E-Solutions" />
        </Link>

        {/* Desktop nav */}
        <div className="d-none d-lg-flex" style={{ gap: '2.5rem', alignItems: 'center' }}>
          {[
            { to: '/', label: 'Home' },
            { to: '/what-we-do', label: 'What We Do' },
            { to: '/who-we-are', label: 'Who We Are' },
            { to: '/products', label: 'Products' },
            { to: '/contact-us', label: 'Contact Us' },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-link-custom${isActive ? ' active' : ''}`}>
              {label}
            </NavLink>
          ))}
          {isAuthenticated() ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <NavLink to="/profile" className={({ isActive }) => `nav-link-custom${isActive ? ' active' : ''}`}>
                My Account
              </NavLink>
              <button
                onClick={handleLogout}
                className="btn-primary-custom"
                style={{ padding: '0.6rem 1.4rem', fontSize: '0.82rem' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary-custom" style={{ padding: '0.6rem 1.4rem', fontSize: '0.82rem' }}>
              Login / Register
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="navbar-toggler-custom d-lg-none" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className="container">
        <div className={`mobile-nav-menu${menuOpen ? ' open' : ''}`}>
          {[
            { to: '/', label: 'Home' },
            { to: '/what-we-do', label: 'What We Do' },
            { to: '/who-we-are', label: 'Who We Are' },
            { to: '/products', label: 'Products' },
            { to: '/contact-us', label: 'Contact Us' },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}>
              {label}
            </NavLink>
          ))}
          {isAuthenticated() ? (
            <>
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
              >
                My Account
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="mobile-nav-link"
              style={{ background: '#667eea', color: 'white', fontWeight: '600' }}
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
