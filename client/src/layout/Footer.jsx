const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-6">
            <img src="/logo-rs.png" alt="Gauri E-Solutions" className="footer-logo" />
            <p className="footer-address ">
              <i className="fa-solid fa-location-dot me-2" style={{color:'var(--accent)'}}></i>
              120, Karanpur, Near Survey Chowk<br />
              Dehradun – 248001, India
            </p>
          </div>
          <div className="col-md-6 d-flex flex-column align-items-md-end justify-content-between">
            <div>
              <p className="footer-heading">Follow Us</p>
              <div className="social-links">
                {[
                  { icon: 'fab fa-facebook-f', href: '#' },
                  { icon: 'fab fa-twitter', href: '#' },
                  { icon: 'fab fa-instagram', href: '#' },
                  { icon: 'fab fa-linkedin-in', href: '#' },
                ].map(({ icon, href }, i) => (
                  <a key={i} href={href} className="social-link">
                    <i className={icon}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <hr className="footer-divider" />
        <p className="footer-copy">© {year} Gauri E-Solutions — All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
