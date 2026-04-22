const featureItems = [
  {
    number: '01',
    title: 'Web Development',
    text: 'Our web development services create dynamic, user-friendly websites and applications. We specialize in building custom websites that are visually appealing, functional, responsive, and optimized for performance. With expertise in React, Angular, HTML5, and CSS3, we deliver exceptional user experiences.',
    img: '/coding.jpg',
    imgAlt: 'Web Development',
    reverse: false,
    alt: false,
  },
  {
    number: '02',
    title: 'Networking',
    text: 'Our network solutions ensure seamless connectivity and high reliability. We design secure, scalable, and efficient network infrastructures — from routers and switches to firewalls and load balancers — with proactive monitoring to keep your business running uninterrupted.',
    img: '/network.png',
    imgAlt: 'Networking',
    reverse: true,
    alt: true,
  },
  {
    number: '03',
    title: 'IT Consulting',
    text: 'We work closely with you to assess your current IT infrastructure, identify areas for improvement, and develop tailored strategies aligned with your business goals. Our consultants provide guidance on innovation, scalability, and cost-effectiveness.',
    img: '/it-consult.jpg',
    imgAlt: 'IT Consulting',
    reverse: false,
    alt: false,
  },
  {
    number: '04',
    title: 'Cyber Security',
    text: 'We provide robust protection against data breaches, hacking, malware, and ransomware. Our comprehensive solutions include firewall management, encryption, vulnerability assessments, and real-time threat monitoring to safeguard your sensitive information.',
    img: '/security.jpg',
    imgAlt: 'Cyber Security',
    reverse: true,
    alt: true,
  },
  {
    number: '05',
    title: 'Professional Services',
    text: 'From system integration and IT project management to cloud solutions and digital transformation, our expert team provides comprehensive support throughout every stage of your technology journey — delivering tailored solutions that improve efficiency and enable growth.',
    img: '/professional.jpg',
    imgAlt: 'Professional Services',
    reverse: false,
    alt: false,
  },
  {
    number: '06',
    title: 'Datacenter Solutions',
    text: 'We provide secure, scalable, and high-performance infrastructures for critical IT operations. From colocation services to hybrid cloud environments, we design datacenter architectures ensuring reliability, uptime, and security with cutting-edge technologies.',
    img: '/data-center.jpg',
    imgAlt: 'Datacenter Solutions',
    reverse: true,
    alt: true,
  },
];

const Features = () => (
  <>
    <div className="page-hero">
      <div className="container">
        <div className="section-label mx-auto mb-3" style={{justifyContent:'center'}}>What We Do</div>
        <h1 className="section-title">Innovative IT Solutions for<br />Modern Businesses</h1>
        <p className="section-subtitle mx-auto mt-3" style={{textAlign:'center'}}>
          At Gauri E-Solutions, we specialize in cutting-edge IT solutions — from robust network
          infrastructures to custom web development — tailored to meet each client's unique needs.
        </p>
      </div>
    </div>

    {featureItems.map(({ number, title, text, img, imgAlt, reverse, alt }) => (
      <section key={number} className={`feature-section${alt ? ' feature-section-alt' : ''}`}>
        <div className="container">
          <div className={`row align-items-center g-5${reverse ? ' flex-md-row-reverse' : ''}`}>
            <div className="col-md-6">
              <div className="feature-number">{number} / 06</div>
              <h2 className="feature-title">{title}</h2>
              <p className="feature-text">{text}</p>
            </div>
            <div className="col-md-6">
              <div className="content-img">
                <img src={img} alt={imgAlt} />
              </div>
            </div>
          </div>
        </div>
      </section>
    ))}
  </>
);

export default Features;
