const sections = [
  {
    title: 'Our Mission',
    text: 'Our mission is to deliver innovative, reliable, and scalable IT solutions that help businesses achieve long-term success. We strive to provide the best technology and services, ensuring our clients are always a step ahead in today\'s fast-paced digital world.',
    img: '/mission.jpg',
    imgAlt: 'Mission',
    reverse: false,
    alt: false,
  },
  {
    title: 'Our Vision',
    text: 'Our vision is to be a leading IT solutions provider, known for delivering innovative services that make a significant impact on businesses worldwide. We aim to revolutionize how companies utilize technology, offering tools to enhance performance, security, and competitiveness.',
    img: '/vision.jpg',
    imgAlt: 'Vision',
    reverse: true,
    alt: true,
  },
  {
    title: 'Our Core Values',
    isList: true,
    items: [
      { key: 'Innovation', val: 'Embracing the latest technologies and ideas to provide unique and effective solutions.' },
      { key: 'Integrity', val: 'Maintaining honesty, transparency, and trust in every interaction.' },
      { key: 'Excellence', val: 'Striving for excellence in every project and ensuring high-quality results.' },
      { key: 'Collaboration', val: 'Working together as a team and with our clients to achieve the best outcomes.' },
    ],
    img: '/values.jpg',
    imgAlt: 'Values',
    reverse: false,
    alt: false,
  },
  {
    title: 'Meet Our Team',
    text: 'Our team is composed of experienced professionals with diverse backgrounds in IT, business, and design. United by our commitment to innovation, excellence, and customer satisfaction, each member brings valuable expertise to tackle new challenges.',
    img: '/team.jpg',
    imgAlt: 'Team',
    reverse: true,
    alt: true,
  },
  {
    title: 'Why Choose Us?',
    isList: true,
    items: [
      { key: 'Customer-Centric Approach', val: 'We put your business needs at the forefront of everything we do.' },
      { key: 'Expertise & Experience', val: 'Our team is highly skilled in the latest technologies.' },
      { key: 'Tailored Solutions', val: 'We create solutions customized to fit your business goals.' },
      { key: 'Proven Track Record', val: 'A history of delivering successful projects for businesses of all sizes.' },
    ],
    img: '/why-choose.jpg',
    imgAlt: 'Why Choose Us',
    reverse: false,
    alt: false,
  },
];

const AboutUs = () => (
  <>
    <div className="page-hero">
      <div className="container">
        <div className="section-label mx-auto mb-3" style={{justifyContent:'center'}}>Who We Are</div>
        <h1 className="section-title">Dedicated to Empowering Businesses<br />Through Technology</h1>
        <p className="section-subtitle mx-auto mt-3" style={{textAlign:'center'}}>
          At Gauri E-Solutions, we believe in the transformative power of technology. Since our inception,
          we've helped businesses navigate the digital landscape through cutting-edge IT solutions.
        </p>
      </div>
    </div>

    {sections.map(({ title, text, isList, items, img, imgAlt, reverse, alt }, i) => (
      <section key={i} className={`content-block${alt ? ' content-block-alt' : ''}`}>
        <div className="container">
          <div className={`row align-items-center g-5${reverse ? ' flex-md-row-reverse' : ''}`}>
            <div className="col-md-6">
              <div className="section-label mb-3">{title}</div>
              <h2 className="feature-title">{title}</h2>
              {isList ? (
                <ul className="values-list">
                  {items.map(({ key, val }) => (
                    <li key={key}><span><strong>{key}:</strong> {val}</span></li>
                  ))}
                </ul>
              ) : (
                <p className="feature-text">{text}</p>
              )}
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

export default AboutUs;
