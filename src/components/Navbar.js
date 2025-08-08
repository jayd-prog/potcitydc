import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import { CartContext } from './CartContext';
import '../css/Navbar.css';

const Navbar = () => {
    const { cart } = useContext(CartContext);
    const [showPopup, setShowPopup] = useState(false);
    
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        // Show popup after 3 seconds, only if not dismissed before
        const timer = setTimeout(() => {
            const hasDismissed = localStorage.getItem('reviewPopupDismissed');
            if (!hasDismissed) {
                setShowPopup(true);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setShowPopup(false);
        localStorage.setItem('reviewPopupDismissed', 'true');
    };

    const handleReviewClick = () => {
        window.open('https://www.google.com/search?sca_esv=caf2cde9e91e65c3&sxsrf=AE3TifPaCo7us_lzFmrkqeZchwR7mMeKzg:1754662414929&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-EyT75tH1TDJ7PeltVztctB7t_JWjF1gCM_soOgQHEo879ECH3uFild3uABgqip1ExVZvZZ7l9GtlzQneBZsw_a6ASDFDaqhpNDDhBHnwS86-DZXYfI9mhDS1xKEUHYpaIXMUM8Q%3D&q=Potcity+Weed+Dispensary+%26+Delivery+Reviews&sa=X&ved=2ahUKEwjo-b_vsvuOAxWRElkFHZBqFOYQ0bkNegQILhAE&biw=1600&bih=740&dpr=1#cobssid=s', '_blank');
        handleClose();
    };

    return (
        <>
            <nav className="navbar">
                <div className="nav-brand">
                    <Link to="/" className="logo-link">PotCityDC</Link>
                </div>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/products" className="nav-link">All Products</Link>
                    <Link to="/deals" className="nav-link deals-link">🔥 Hot Deals 🔥</Link>
                </div>
                <div className="nav-cart">
                    <Link to="/cart" className="cart-link">
                        <FaShoppingCart className="cart-icon" />
                        {cartCount > 0 && (
                            <span className="cart-count">{cartCount}</span>
                        )}
                    </Link>
                </div>
            </nav>

            {/* Simple Text Popup */}
            {showPopup && (
                <div className="text-popup">
                    <div className="popup-content">
                        <span>Leave a google review for a </span>
                        <strong>FREE edible!</strong>
                        <button onClick={handleReviewClick} className="popup-link">Click here</button>
                        <button onClick={handleClose} className="popup-close">
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;