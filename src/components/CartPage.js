import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import {products} from '../products';
import '../css/CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Filter cart items
  const dealItems = cart.filter(item => item.isDeal);
  const regularItems = cart.filter(item => !item.isDeal && !item.isDealItem);
  const dealProductItems = cart.filter(item => item.isDealItem);

  // Group deal product items by their dealId
  const groupedDealItems = dealProductItems.reduce((acc, item) => {
    if (!acc[item.dealId]) {
      acc[item.dealId] = {
        items: [],
        dealName: item.dealName,
        total: 0,
        originalTotal: 0,
        savings: 0
      };
    }
    acc[item.dealId].items.push(item);
    acc[item.dealId].total += item.dealPrice * item.quantity;
    acc[item.dealId].originalTotal += item.originalPrice * item.quantity;
    acc[item.dealId].savings = acc[item.dealId].originalTotal - acc[item.dealId].total;
    return acc;
  }, {});

  // Calculate totals
  const regularTotal = regularItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const dealTotals = Object.values(groupedDealItems).reduce((sum, deal) => sum + deal.total, 0);
  const originalDealTotals = Object.values(groupedDealItems).reduce((sum, deal) => sum + deal.originalTotal, 0);
  
  const displayTotal = regularTotal + dealTotals;
  const originalTotal = regularTotal + originalDealTotals;
  const totalSavings = originalTotal - displayTotal;

  // Deal requirements configuration
  const dealRequirements = {
    'desposable-deal': { 
      totalQuantity: 4, 
      productsNeeded: 4,
      category: 'Disposable Cart',
      description: 'Select 4 vape products (get 4 total)',
      price: 150
    },
    'cartage-deal': { 
      totalQuantity: 4, 
      productsNeeded: 4,
      category: 'Cartages',
      description: 'Select 4 Cartages product',
      price: 100
    },
    'edible-deal': { 
      totalQuantity: 5, 
      productsNeeded: 5,
      category: 'Edibles',
      description: 'Select 5 edibles products',
      price: 100
    },
    'flower-deal-2oz': { 
      totalQuantity: 2, 
      productsNeeded: 2,
      category: 'flower',
      description: 'Select 2 flower products (get 2oz total)',
      price: 180
    },
    'flower-deal-4oz': { 
      totalQuantity: 4, 
      productsNeeded: 4,
      category: 'flower',
      description: 'Select 4 flower products (get 4oz total)',
      price: 350
    },
    'preroll-deal': { 
      totalQuantity: 1, 
      productsNeeded: 1,
      category: 'Prerolls',
      description: '10 Prerolls',
      price: 80
    },
    'preroll-deal2': { 
      totalQuantity: 1, 
      productsNeeded: 1,
      category: 'Prerolls',
      description: '20 Prerolls',
      price: 150
    },
  };

  // Get products for each deal type
  const dealProducts = {
    'desposable-deal': products.filter(p => p.category === 'Disposable Cart').slice(0, 14),
    'cartage-deal': products.filter(p => p.category === 'Cartages').slice(0, 14),
    'edible-deal': products.filter(p => p.category === 'Edibles').slice(0, 14),
    'flower-deal-2oz': products.filter(p => p.category === 'flower').slice(0, 14),
    'flower-deal-4oz': products.filter(p => p.category === 'flower').slice(0, 14),
    'preroll-deal': products.filter(p => p.category === 'Prerolls').slice(0, 2),
    'preroll-deal2': products.filter(p => p.category === 'Prerolls').slice(0, 2),
  };

  const handleProductSelect = (dealId, product, e) => {
    e.preventDefault();
    e.stopPropagation();

    const dealReq = dealRequirements[dealId];
    if (!dealReq) return;

    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      let newSelection;
      
      if (isSelected) {
        newSelection = prev.filter(p => p.id !== product.id);
      } else {
        if (prev.length < dealReq.productsNeeded) {
          newSelection = [...prev, product];
        } else {
          return prev;
        }
      }
      
      return newSelection;
    });
  };

  const completeDealSelection = (dealId) => {
    const dealItem = cart.find(item => item.id === dealId);
    const dealReq = dealRequirements[dealId];
    
    if (!dealItem || !dealReq || selectedProducts.length !== dealReq.productsNeeded) return;

    // Remove existing deal items for this deal
    const existingDealItems = cart.filter(item => item.dealId === dealId);
    existingDealItems.forEach(item => removeFromCart(item.id));
    
    // Remove the deal placeholder
    removeFromCart(dealId);

    const quantityPerProduct = Math.ceil(dealReq.totalQuantity / selectedProducts.length);

    // Add the new deal items
    selectedProducts.forEach(product => {
      addToCart({
        ...product,
        quantity: quantityPerProduct,
        dealPrice: dealItem.price / dealReq.totalQuantity * quantityPerProduct,
        originalPrice: product.price,
        isDealItem: true,
        dealId: dealId,
        dealName: dealItem.name
      });
    });

    setSelectedDeal(null);
    setSelectedProducts([]);
  };

  const cancelSelection = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedDeal(null);
    setSelectedProducts([]);
  };

  return (
    <div className="cart-page">
      <button onClick={() => navigate(-1)} className="go-back-button">
        ← Go Back
      </button>
      
      <h1>YOUR CART</h1>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/products" className="bold-link">SHOP NOW</Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {/* Regular items */}
            {regularItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>${item.price.toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)}>
                    REMOVE
                  </button>
                </div>
              </div>
            ))}

            {/* Deal items */}
            {dealItems.map(deal => {
              const dealReq = dealRequirements[deal.id];
              if (!dealReq) return null;
              
              return (
                <React.Fragment key={deal.id}>
                  {/* Deal placeholder */}
                  <div className="cart-item deal-item">
                    <div className="deal-header">
                      <h3>{deal.name}</h3>
                      <p>${deal.price.toFixed(2)}</p>
                      <p className="deal-description">{dealReq.description}</p>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedDeal(deal.id);
                        setSelectedProducts([]);
                      }}
                      className="select-products-btn"
                    >
                      {groupedDealItems[deal.id] 
                        ? 'CHANGE SELECTION' 
                        : 'SELECT PRODUCTS'}
                    </button>

                    <button 
                      onClick={() => {
                        removeFromCart(deal.id);
                        const itemsToRemove = cart.filter(item => item.dealId === deal.id);
                        itemsToRemove.forEach(item => removeFromCart(item.id));
                      }}
                      className="remove-deal-btn"
                    >
                      REMOVE DEAL
                    </button>
                  </div>

                  {/* Associated deal products */}
                  {groupedDealItems[deal.id]?.items.map(item => (
                    <div key={`${item.id}-${item.dealId}`} className="cart-item deal-product-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p className="price-display">
                          <span className="original-price">${item.originalPrice.toFixed(2)}</span>
                          <span className="deal-price">${item.dealPrice.toFixed(2)}</span>
                        </p>
                        <div className="deal-badge">Deal Item</div>
                        <div className="quantity-controls">
                          <span>{item.quantity}</span>
                        </div>
                        <button onClick={() => removeFromCart(item.id)}>
                          REMOVE
                        </button>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              );
            })}
          </div>

          {/* Product selection modal */}
          {selectedDeal && dealRequirements[selectedDeal] && (
            <div className="deal-products-modal">
              <div className="modal-content">
                <h3>Select products for your deal</h3>
                <p className="modal-subtitle">
                  {dealRequirements[selectedDeal].description}
                </p>
                <p className="selection-status">
                  {selectedProducts.length > 0 
                    ? `Selected ${selectedProducts.length}/${dealRequirements[selectedDeal].productsNeeded} products`
                    : `Choose from ${dealRequirements[selectedDeal].category}`}
                </p>
                
                <div className="products-carousel">
                  {(dealProducts[selectedDeal] || []).map(product => (
                    <div 
                      key={product.id} 
                      className={`product-option ${
                        selectedProducts.some(p => p.id === product.id) ? 'selected' : ''
                      } ${
                        selectedProducts.length >= dealRequirements[selectedDeal].productsNeeded && 
                        !selectedProducts.some(p => p.id === product.id) ? 'disabled' : ''
                      }`}
                      onClick={(e) => handleProductSelect(selectedDeal, product, e)}
                    >
                      <img src={product.image} alt={product.name} className="product-image" />
                      <div className="product-info">
                        <p className="product-name">{product.name}</p>
                        <p className="product-price">${product.price.toFixed(2)}</p>
                        {selectedProducts.some(p => p.id === product.id) && (
                          <div className="selected-badge">Selected</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="modal-actions">
                  <button 
                    onClick={cancelSelection}
                    className="cancel-btn"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={(e) => completeDealSelection(selectedDeal)}
                    className={`confirm-btn ${
                      selectedProducts.length !== dealRequirements[selectedDeal].productsNeeded ? 'disabled' : ''
                    }`}
                    disabled={selectedProducts.length !== dealRequirements[selectedDeal].productsNeeded}
                  >
                    {selectedProducts.length === dealRequirements[selectedDeal].productsNeeded 
                      ? 'CONFIRM SELECTION' 
                      : `SELECT ${dealRequirements[selectedDeal].productsNeeded - selectedProducts.length} MORE`}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="cart-summary">
            <h2>ORDER SUMMARY</h2>
            
            {/* Regular items */}
            <div className="product-list-summary">
              <h3>Regular Items</h3>
              {regularItems.map(item => (
                <div key={`regular-summary-${item.id}`} className="summary-product-item">
                  <span>{item.name}</span>
                  <span>{item.quantity} × ${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Deal items grouped by deal */}
            {Object.entries(groupedDealItems).map(([dealId, dealGroup]) => (
              <div key={`deal-group-${dealId}`} className="deal-group-summary">
                <h3>{dealGroup.dealName}</h3>
                {dealGroup.items.map(item => (
                  <div key={`deal-summary-${item.id}`} className="summary-product-item deal-item">
                    <span>{item.name}</span>
                    <span>
                      {item.quantity} × ${item.dealPrice.toFixed(2)}
                      <span className="original-price">${item.originalPrice?.toFixed(2)}</span>
                    </span>
                  </div>
                ))}
                <div className="deal-subtotal">
                  <span>Deal Subtotal:</span>
                  <span>${dealGroup.total.toFixed(2)}</span>
                </div>
                <div className="deal-savings">
                  <span>Savings:</span>
                  <span>-${dealGroup.savings.toFixed(2)}</span>
                </div>
              </div>
            ))}

            {/* Totals */}
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${originalTotal.toFixed(2)}</span>
            </div>
            {totalSavings > 0 && (
              <div className="summary-row deal-savings">
                <span>Total Savings</span>
                <span>-${totalSavings.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>TOTAL</span>
              <span>${displayTotal.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="checkout-btn">
              PROCEED TO CHECKOUT
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;