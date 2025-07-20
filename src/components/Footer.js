import React from 'react';
import '../css/Footer.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            {/* <li><a href="/about">About Us</a></li> */}
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul className="contact-info">
            <li>
              <FaPhone className="icon" />
              <a href="tel:2022099605">(202) 209-9605</a>
            </li>
            <li>
              <FaEnvelope className="icon" />
              <a href="mailto:info@example.com">potcitydc@gmail.com</a>
            </li>
            <li>
              <FaMapMarkerAlt className="icon" />
              <span>Washington, DC</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Hours</h3>
          <ul>
            <li>Monday - Saturday: 9am - 10pm</li>
            <li>Sunday: 9am - 9pm</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://instagram.com" aria-label="Instagram">
              <FaInstagram className="social-icon" />
            </a>
            <a href="https://twitter.com" aria-label="Twitter">
              <FaTwitter className="social-icon" />
            </a>
            <a href="https://facebook.com" aria-label="Facebook">
              <FaFacebook className="social-icon" />
            </a>
          </div>
          <div className="newsletter">
            <h4>Subscribe to our newsletter</h4>
            <form>
              <input type="email" placeholder="Your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PotCityDC. All rights reserved.</p>
        <div className="legal-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/compliance">Compliance</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;