import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import { products } from '../products';
import '../css/ProductPage.css';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = products.find(p => p.id === id);
    const [selectedWeight, setSelectedWeight] = useState('ounce');
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useContext(CartContext);

    if (!product) {
        return <div className="product-not-found">Product not found</div>;
    }

    const isFlower = product.category === 'flower';
    const priceOptions = isFlower ? {
        ounce: product.price,
        half: product.price * 0.6, 
        quarter: product.price * 0.4,
        eighth: product.price * 0.3 
    } : { default: product.price };

    const currentPrice = (isFlower ? priceOptions[selectedWeight] : product.price) * quantity;

    const handleAddToCart = () => {
        const cartItem = {
            id: product.id,
            name: product.name,
            image: product.image,
            price: isFlower ? priceOptions[selectedWeight] : product.price,
            ...(isFlower && { weight: selectedWeight }),
            quantity: quantity,
            countInStock: product.countInStock,
            totalPrice: currentPrice
        };
        
        addToCart(cartItem);
    };

    return (
        <div className="product-container">
            <button 
                onClick={() => navigate(-1)}
                className="go-back-button"
            >
                ← Back to Products
            </button>
            
            <div className="product-content">
                <div className="product-image-container">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="product-image"
                        onError={(e) => {
                            e.target.src = '/images/placeholder-product.jpg';
                            e.target.className = 'product-image placeholder';
                        }}
                    />
                </div>
                
                <div className="product-details">
                    <div className="product-header">
                        <h1 className="product-title">{product.name}</h1>
                        <div className="product-meta">
                            <span className="product-brand">{product.brand}</span>
                            <span className="product-category">{product.category}</span>
                        </div>
                    </div>
                    
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-options">
                        {isFlower && (
                            <div className="product-option-group">
                                <label className="product-label">Weight:</label>
                                <div className="option-buttons">
                                    {[
                                        { value: 'ounce', label: 'Ounce (28g)' },
                                        { value: 'half', label: 'Half (14g)' },
                                        { value: 'quarter', label: 'Quarter (7g)' },
                                        { value: 'eighth', label: 'Eighth (3.5g)' }
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            className={`option-button ${selectedWeight === option.value ? 'active' : ''}`}
                                            onClick={() => setSelectedWeight(option.value)}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="product-option-group">
                            <label className="product-label">Quantity:</label>
                            <div className="quantity-selector">
                                <button 
                                    className="quantity-button"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="quantity-value">{quantity}</span>
                                <button 
                                    className="quantity-button"
                                    onClick={() => setQuantity(q => Math.min(5, q + 1))}
                                    disabled={quantity >= 5}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="product-pricing">
                        <div className="price-display">
                            <span className="product-price">${currentPrice.toFixed(2)}</span>
                            {isFlower && (
                                <span className="price-unit">
                                    {quantity} × ${priceOptions[selectedWeight].toFixed(2)}/{selectedWeight}
                                </span>
                            )}
                        </div>
                        
                        <p className={`product-stock ${product.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                            {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
                        </p>
                    </div>
                    
                    <button 
                        className="add-to-cart-button"
                        disabled={product.countInStock <= 0}
                        onClick={handleAddToCart}
                    >
                        {product.countInStock > 0 ? (
                            <>
                                <span>Add to Cart</span>
                                <span>${currentPrice.toFixed(2)}</span>
                            </>
                        ) : 'Currently Unavailable'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;