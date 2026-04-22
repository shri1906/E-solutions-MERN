import { Link } from 'react-router-dom';

const services = [
  { icon: 'fa-solid fa-network-wired', label: 'Networking' },
  { icon: 'fa-solid fa-code', label: 'Web Development' },
  { icon: 'fa-solid fa-shield-halved', label: 'Cyber Security' },
  { icon: 'fa-solid fa-headset', label: 'IT Consulting' },
  { icon: 'fa-solid fa-database', label: 'Datacenter Solutions' },
  { icon: 'fa-solid fa-briefcase', label: 'Professional Services' },
];

const whyCards = [
  {
    icon: 'fa-solid fa-building-circle-check',
    title: 'Trusted Company',
    text: 'Trust is the foundation of our success. We are committed to delivering excellence in every interaction, prioritizing transparency, integrity, and reliability with a proven track record of successful projects.',
  },
  {
    icon: 'fa-solid fa-network-wired',
    title: 'Strong Network',
    text: 'Our company thrives on the strength of its robust network spanning industries, technologies, and global markets — built on strategic partnerships and expert collaborations.',
  },
  {
    icon: 'fa-solid fa-laptop-code',
    title: 'Quality Products',
    text: 'From initial design to final implementation, every step is guided by meticulous attention to detail. We leverage cutting-edge technology and rigorous testing to ensure reliable, efficient results.',
  },
];

const Home = () => (
  <>
    {/* ─── HERO ─── */}
    <section className="hero-section">
      <div className="hero-grid-lines" />
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Digital Transformation Partner
            </div>
            <h1 className="hero-title">
              Powering Your<br />
              <span className="accent-word">Digital Future</span><br />
              With Smart IT
            </h1>
            <p className="hero-desc">
              We specialize in innovative, scalable technology solutions — from software development
              and IT consulting to cloud computing and cybersecurity — empowering businesses to thrive
              in the competitive digital landscape.
            </p>
            <div className="hero-cta-group">
              <Link to="/contact-us" className="btn-primary-custom ">
                Get Started <i className="fa-solid fa-arrow-right"></i>
              </Link>
              <Link to="/what-we-do" className="btn-outline-custom">
                Our Services
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-value">5<span>+</span></div>
                <div className="hero-stat-label">Years Experience</div>
              </div>
              <div>
                <div className="hero-stat-value">200<span>+</span></div>
                <div className="hero-stat-label">Projects Delivered</div>
              </div>
              <div>
                <div className="hero-stat-value">98<span>%</span></div>
                <div className="hero-stat-label">Client Satisfaction</div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="hero-visual">
              <div className="hero-glow-orb" />
              <div className="hero-img-wrapper">
                <img src="/data-center.jpg" alt="IT Infrastructure" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ─── WHAT WE DO ─── */}
    <section className="section-block section-block-alt">
      <div className="container">
        <div className="text-center mb-2">
          <div className="section-label mx-auto" style={{justifyContent:'center'}}>What We Do</div>
          <h2 className="section-title">Comprehensive IT Solutions</h2>
          <p className="section-subtitle mx-auto" style={{textAlign:'center'}}>
            A forward-thinking IT solutions provider committed to driving digital transformation
            for businesses of every scale.
          </p>
        </div>
        <div className="services-grid">
          {services.map(({ icon, label }) => (
            <div className="service-card" key={label}>
              <div className="service-icon-wrapper">
                <i className={icon}></i>
              </div>
              <h5>{label}</h5>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ─── MISSION & VISION ─── */}
    <section className="section-block">
      <div className="container">
        <div className="text-center mb-5">
          <div className="section-label mx-auto" style={{justifyContent:'center'}}>Our Purpose</div>
          <h2 className="section-title">Guiding Your Digital Transformation</h2>
        </div>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="mv-card">
              <div className="mv-card-accent" />
              <h5>Our Mission</h5>
              <p>
                To empower businesses by delivering cutting-edge, reliable, and scalable IT solutions.
                We are committed to providing innovative technology services that enhance productivity,
                streamline processes, and drive digital transformation — helping our clients achieve
                sustainable growth and stay ahead in the competitive digital landscape.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mv-card">
              <div className="mv-card-accent" />
              <h5>Our Vision</h5>
              <p>
                To be a global leader in IT services, recognized for our commitment to excellence,
                innovation, and sustainability. With a strong focus on quality, integrity, and
                collaboration, Gauri E-Solutions is dedicated to helping you achieve your business
                goals and staying ahead in the digital age.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ─── CTA BANNER ─── */}
    <div className="cta-banner">
      <div className="cta-banner-content container">
        <div className="section-label mx-auto mb-3" style={{justifyContent:'center', color:'var(--accent-secondary)'}}>
          Let's Get Started
        </div>
        <h2>Ready for a More Productive Business?</h2>
        <p>
          Stop worrying about technology problems. Focus on your business.
          Let us provide the support you deserve.
        </p>
        <Link to="/contact-us" className="btn-primary-custom" style={{fontSize:'1rem', padding:'1rem 2.5rem'}}>
          Contact Us Now <i className="fa-solid fa-arrow-right ms-1"></i>
        </Link>
      </div>
    </div>

    {/* ─── WHY CHOOSE US ─── */}
    <section className="section-block">
      <div className="container">
        <div className="text-center mb-5">
          <div className="section-label mx-auto" style={{justifyContent:'center'}}>Why Choose Us</div>
          <h2 className="section-title">Your Trusted Technology Partner</h2>
          <p className="section-subtitle mx-auto" style={{textAlign:'center'}}>
            At our core, we deliver tailored IT solutions that empower businesses to thrive — with
            expert professionals, seamless integration, and robust security on every project.
          </p>
        </div>
        <div className="row g-4">
          {whyCards.map(({ icon, title, text }) => (
            <div className="col-md-4" key={title}>
              <div className="why-card">
                <div className="why-icon"><i className={icon}></i></div>
                <h5>{title}</h5>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default Home;
