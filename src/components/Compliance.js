import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import '../css/Compliance.css';

const Compliance = () => {
  const [verified, setVerified] = useState(() => {
    return localStorage.getItem('ageVerified') === 'true';
  });
  // const navigate = useNavigate();

  useEffect(() => {
    if (!verified) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [verified]);

  const handleVerification = (isVerified) => {
    if (isVerified) {
      localStorage.setItem('ageVerified', 'true');
      setVerified(true);
    } else {
      window.location.href = 'https://www.google.com';
    }
  };

  if (verified) return null;

  return (
    <div className="compliance-overlay">
      <div className="compliance-modal">
        <h2>Age Verification</h2>
        <p>This website contains cannabis products and is only suitable for those 21 years or older.</p>
        <div className="compliance-buttons">
          <button 
            className="compliance-confirm"
            onClick={() => handleVerification(true)}
          >
            I am 21 or older
          </button>
          <button 
            className="compliance-deny"
            onClick={() => handleVerification(false)}
          >
            I am under 21
          </button>
        </div>
        <p className="compliance-disclaimer">
          By entering this site, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Compliance;