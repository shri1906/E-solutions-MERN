import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const ContactUs = () => {
  const form = useRef();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      form.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    ).then(
      () => { setStatus('success'); setLoading(false); form.current.reset(); },
      (err) => { console.log('FAILED...', err.text); setStatus('error'); setLoading(false); }
    );
  };

  return (
    <div className="contact-section">
      <div className="container">
        <div className="text-center mb-5">
          <div className="section-label mx-auto mb-3" style={{justifyContent:'center'}}>Get In Touch</div>
          <h1 className="section-title">Let's Work Together</h1>
          <p className="section-subtitle mx-auto" style={{textAlign:'center'}}>
            Have a question or ready to start your digital transformation journey? We'd love to hear from you.
          </p>
        </div>

        <div className="row g-4 align-items-start rounded p-4 shadow-lg ">
          {/* Info card */}
          <div className="col-md-5">
            <div className="contact-info-card" >
              <img src="/gauri.png" alt="Gauri E-Solutions" className="contact-logo" />

              <div className="contact-item">
                <div className="contact-item-icon"><i className="fa-solid fa-envelope"></i></div>
                <div>
                  <div className="contact-item-label">Email</div>
                  <div className="contact-item-value">
                    <a href="mailto:shivam0626.soi@gmail.com">shivam0626.soi@gmail.com</a>
                  </div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon"><i className="fa-solid fa-phone"></i></div>
                <div>
                  <div className="contact-item-label">Phone</div>
                  <div className="contact-item-value">+91-7310941087</div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon"><i className="fa-solid fa-location-dot"></i></div>
                <div>
                  <div className="contact-item-label">Address</div>
                  <div className="contact-item-value">
                    120, Karanpur, Near Survey Chowk<br />
                    Dehradun – 248001, India
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form card */}
          <div className="col-md-7">
            <div className="contact-form-card">
              <h3 style={{fontFamily:'var(--font-display)', fontWeight:700, marginBottom:'1.5rem', fontSize:'1.3rem'}}>
                Send Us a Message
              </h3>
              <form ref={form} onSubmit={handleSubmit}>
                <div className="form-group-custom">
                  <label className="form-label-custom">Name</label>
                  <input type="text" className="form-control-custom" name="user_name" placeholder="Your full name" required />
                </div>
                <div className="form-group-custom">
                  <label className="form-label-custom">Email</label>
                  <input type="email" className="form-control-custom" name="user_email" placeholder="your@email.com" required />
                </div>
                <div className="form-group-custom">
                  <label className="form-label-custom">Message</label>
                  <textarea className="form-control-custom" name="message" rows={5} placeholder="How can we help you?" required />
                </div>
                <button type="submit" className="btn-primary-custom" disabled={loading}
                  style={{width:'100%', justifyContent:'center', marginTop:'0.5rem', fontSize:'0.95rem', padding:'0.9rem'}}>
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending…</>
                    : <><i className="fa-solid fa-paper-plane me-2"></i>Send Message</>
                  }
                </button>
              </form>

              {status === 'success' && (
                <div style={{marginTop:'1rem', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)',
                  borderRadius:'10px', padding:'0.9rem 1.2rem', color:'#4ade80', fontFamily:'var(--font-display)',
                  fontSize:'0.9rem', fontWeight:600}}>
                  <i className="fa-solid fa-circle-check me-2"></i>Message sent successfully!
                </div>
              )}
              {status === 'error' && (
                <div style={{marginTop:'1rem', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)',
                  borderRadius:'10px', padding:'0.9rem 1.2rem', color:'#f87171', fontFamily:'var(--font-display)',
                  fontSize:'0.9rem', fontWeight:600}}>
                  <i className="fa-solid fa-circle-xmark me-2"></i>Something went wrong. Please try again.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
