import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from './CartContext';
import '../css/OrderSummary.css';

const OrderSummary = () => {
    const { clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();

    const {
        formData = {
            fullName: '',
            phone: '',
            address: '',
            city: '',
            zipCode: ''
        },
        cart = [],
        cartTotal = 0,
        orderItems = [],
        orderTotal = 0
    } = location.state || {};

    const displayCart = orderItems.length > 0 ? orderItems : cart;
    const displayTotal = orderTotal || cartTotal;

    const handleContinueShopping = () => {
        if (typeof clearCart === 'function') {
            clearCart();
        }
        navigate('/');
    };

    return (
        <div className="order-confirmation">
            <div className="confirmation-header">
                <svg className="confirmation-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                </svg>
                <h1>ORDER CONFIRMED!</h1>
                <p className="confirmation-subtext">Thank you for your order. A team member will be in touch shortly via text message. For any questions, contact us at {process.env.REACT_APP_BUSINESS_PHONE}</p>
            </div>

            <div className="confirmation-content">
                <div className="order-details">
                    <div className="shipping-info">
                        <h2>Delivery Information</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Name:</span>
                                <span className="info-value">{formData.fullName || 'Not provided'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Phone:</span>
                                <span className="info-value">{formData.phone || 'Not provided'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Address:</span>
                                <span className="info-value">{formData.address || 'Not provided'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">City:</span>
                                <span className="info-value">{formData.city || 'Not provided'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">ZIP Code:</span>
                                <span className="info-value">{formData.zipCode || 'Not provided'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="order-items-section">
                        <h2>Order Items</h2>
                        <div className="order-items-container">
                            {displayCart.length > 0 ? (
                                displayCart.map(item => (
                                    <div key={`${item.id}-${item.quantity}`} className="order-item">
                                        <div className="item-image-container">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="item-image"
                                                onError={(e) => {
                                                    e.target.src = '/images/placeholder-product.jpg';
                                                    e.target.className = 'item-image placeholder';
                                                }}
                                            />
                                        </div>
                                        <div className="item-details">
                                            <span className="item-name">{item.name}</span>
                                            <div className="item-meta">
                                                <span className="item-quantity">Qty: {item.quantity}</span>
                                                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-cart-message">
                                    <p>No items in your order</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>${displayTotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping:</span>
                        <span>Free</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total:</span>
                        <span>${displayTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="confirmation-actions">
                <button
                    onClick={handleContinueShopping}
                    className="continue-shopping-btn"
                >
                    Continue Shopping
                </button>
                <button
                    className="order-details-btn"
                    onClick={() => window.print()}
                >
                    Print Receipt
                </button>
            </div>
        </div>
    );
};

export default OrderSummary;