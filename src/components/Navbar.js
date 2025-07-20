import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { CartContext } from './CartContext';
import '../css/Navbar.css';

const Navbar = () => {
    const { cart } = useContext(CartContext);
    
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/" className="logo-link">PotCityDC</Link>
            </div>
            <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/products" className="nav-link">All Products</Link>
                <Link to="/deals" className="nav-link deals-link">🔥 Deals 🔥</Link>
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
    );
};

export default Navbar;