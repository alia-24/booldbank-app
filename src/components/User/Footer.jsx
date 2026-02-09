import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          
          {/* القسم الأول - الشعار */}
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon"><i className="fas fa-heartbeat"></i></div>
              <h3>بنك الدم - درعا</h3>
              <p>نظام لخدمة أهل المحافظة</p>
            </div>
          </div>

          {/* القسم الثالث - تواصل معنا */}
          <div className="footer-section">
            <h4>تواصل معنا</h4>
            <ul className="footer-contacts">
              <li><i className="fas fa-phone"></i> 6778610</li>
              <li><i className="fas fa-ambulance"></i> طوارئ: 112</li>
              <li><i className="fas fa-envelope"></i> bloodbank@daraa.gov.sy</li>
              <li><i className="fas fa-map-marker-alt"></i> درعا، سوريا</li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2024 بنك الدم - درعا. كل الحقوق محفوظة.</p>
          <p className="footer-note">
            <i className="fas fa-heart"></i> سوا بننقذ حياة أهل درعا
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;