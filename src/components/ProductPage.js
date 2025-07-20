import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import {products} from '../products';
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
                ← Go Back
            </button>
            
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
                <h2 className="product-title">{product.name}</h2>
                
                <div className="product-meta">
                    <p className="product-brand">Strain: {product.brand}</p>
                    <p className="product-category">Category: {product.category}</p>
                </div>
                
                <p className="product-description">{product.description}</p>
                
                {isFlower && (
                    <>
                        <div className="product-option-group">
                            <label className="product-label">Weight:</label>
                            <select 
                                value={selectedWeight}
                                onChange={(e) => setSelectedWeight(e.target.value)}
                                className="product-select"
                            >
                                <option value="ounce">Ounce (28g)</option>
                                <option value="half">Half (14g)</option>
                                <option value="quarter">Quarter (7g)</option>
                                <option value="eighth">Eighth (3.5g)</option>
                            </select>
                        </div>
                    </>
                )}
                
                <div className="product-option-group">
                    <label className="product-label">Quantity:</label>
                    <select 
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="product-select"
                    >
                        {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
                
                <div className="product-price-container">
                    <p className="product-price">${currentPrice.toFixed(2)}</p>
                    {isFlower && (
                        <p className="product-price-breakdown">
                            {quantity} × ${priceOptions[selectedWeight].toFixed(2)} {selectedWeight}
                        </p>
                    )}
                </div>
                
                <p className="product-stock">
                    {product.countInStock > 0 ? (
                        <span className="product-in-stock">In Stock ({product.countInStock})</span>
                    ) : (
                        <span className="product-out-of-stock">Out of Stock</span>
                    )}
                </p>
                
                <button 
                    className="product-add-to-cart"
                    disabled={product.countInStock <= 0}
                    onClick={handleAddToCart}
                >
                    {product.countInStock > 0 ? 
                        `Add to Cart - $${currentPrice.toFixed(2)}` : 
                        'Currently Unavailable'}
                </button>
            </div>
        </div>
    );
};

export default ProductPage;