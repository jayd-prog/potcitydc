import React, { useContext, useState } from 'react';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import '../css/CheckoutPage.css';

const CheckoutPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [errors, setErrors] = useState({});

  // Calculate cart total properly
  const calculateCartTotal = () => {
    return cart.reduce((total, item) => {
      const itemPrice = item.isDealItem ? item.dealPrice : item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const cartTotal = calculateCartTotal();

  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, '');
    let formattedInput = input;
    
    if (input.length > 3 && input.length <= 6) {
      formattedInput = `${input.slice(0, 3)}-${input.slice(3)}`;
    } else if (input.length > 6) {
      formattedInput = `${input.slice(0, 3)}-${input.slice(3, 6)}-${input.slice(6, 10)}`;
    }
    
    setFormData(prev => ({
      ...prev,
      phone: formattedInput
    }));
    
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) newErrors.zipCode = 'Invalid ZIP code';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const sendOrderEmail = async (orderDetails) => {
    try {
      const emailParams = {
        ...orderDetails,
        to_email: process.env.REACT_APP_BUSINESS_EMAIL,
        from_name: process.env.REACT_APP_BUSINESS_NAME,
        reply_to: process.env.REACT_APP_BUSINESS_EMAIL,
        subject: `New Order #${orderDetails.order_id}`
      };

      const response = await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        emailParams,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      return response.status === 200;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const orderId = `ORD-${Date.now()}`;
      const currentCartTotal = calculateCartTotal();

      const orderDetails = {
        business_name: process.env.REACT_APP_BUSINESS_NAME,
        business_email: process.env.REACT_APP_BUSINESS_EMAIL,
        business_phone: process.env.REACT_APP_BUSINESS_PHONE,
        order_id: orderId,
        customer_name: formData.fullName,
        customer_phone: formData.phone,
        delivery_address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        order_items: cart.map(item => {
          const itemPrice = item.isDealItem ? item.dealPrice : item.price;
          const itemTotal = itemPrice * item.quantity;
          
          return `
            <tr>
              <td>${item.name} (Qty: ${item.quantity})</td>
              <td>$${itemTotal.toFixed(2)}</td>
            </tr>
          `;
        }).join(''),
        order_total: currentCartTotal.toFixed(2),
        order_date: new Date().toLocaleString()
      };

      const emailSent = await sendOrderEmail(orderDetails);

      navigate('/order-summary', {
        state: {
          formData,
          orderId,
          orderTotal: currentCartTotal,
          orderItems: [...cart],
          emailSent,
          businessInfo: {
            name: process.env.REACT_APP_BUSINESS_NAME,
            email: process.env.REACT_APP_BUSINESS_EMAIL,
            phone: process.env.REACT_APP_BUSINESS_PHONE
          }
        }
      });

      if (clearCart) {
        clearCart();
      }
    } catch (error) {
      console.error('Order processing error:', error);
      setError('Order placed! If you don\'t receive confirmation within 24 hours, please contact us.');
      navigate('/order-summary', {
        state: {
          formData,
          orderTotal: cartTotal,
          orderItems: cart,
          emailSent: false,
          businessInfo: {
            name: process.env.REACT_APP_BUSINESS_NAME,
            email: process.env.REACT_APP_BUSINESS_EMAIL,
            phone: process.env.REACT_APP_BUSINESS_PHONE
          }
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getItemDisplayPrice = (item) => {
    return item.isDealItem ? item.dealPrice : item.price;
  };

  const getItemTotal = (item) => {
    return getItemDisplayPrice(item) * item.quantity;
  };

  return (
    <div className="checkout-page">
      <h1>CHECKOUT</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="checkout-container">
        <div className="shipping-form">
          <h2>DELIVERY/PICKUP INFORMATION</h2>
          <form onSubmit={handlePlaceOrder}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}|[0-9]{10}"
                placeholder="1234567890"
                inputMode="numeric"
                required
                className={`form-input ${errors.phone ? 'error' : ''}`}
                title="Please enter a 10-digit phone number"
                maxLength="12"
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>
              <div className="form-group">
                <label>ZIP Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  pattern="\d{5}(-\d{4})?"
                  placeholder="12345 or 12345-6789"
                  required
                  className={errors.zipCode ? 'error' : ''}
                />
                {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
              </div>
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={isLoading || cart.length === 0}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span> PROCESSING...
                </>
              ) : (
                'PLACE ORDER'
              )}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h2>YOUR ORDER</h2>
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="order-items">
                {cart.map(item => {
                  const itemTotal = getItemTotal(item);
                  const originalTotal = item.isDealItem && item.originalPrice 
                    ? (item.originalPrice * item.quantity) 
                    : null;

                  return (
                    <div key={item.id} className="order-item">
                      <span>
                        {item.name} × {item.quantity}
                        {item.isDealItem && <span className="deal-badge">Deal</span>}
                      </span>
                      <span>
                        ${itemTotal.toFixed(2)}
                        {originalTotal && (
                          <span className="original-price">${originalTotal.toFixed(2)}</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="order-total">
                <span>TOTAL</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;