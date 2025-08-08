import React, { useState } from 'react';
import { useContext } from 'react';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom';
import '../css/ProductList.css';

const ProductList = ({ products }) => {
    const { addToCart } = useContext(CartContext);
    const [selectedWeights, setSelectedWeights] = useState({});

    const handleWeightChange = (productId, weight) => {
        setSelectedWeights(prev => ({
            ...prev,
            [productId]: weight
        }));
    };

    const handleAddToCart = (product) => {
        if (product.countInStock > 0) {
            const isFlower = product.category === 'flower';
            const selectedWeight = selectedWeights[product.id] || 'ounce';
            const priceOptions = isFlower ? {
                ounce: product.price,
                half: product.price * 0.6, 
                quarter: product.price * 0.4,
                eighth: product.price * 0.3 
            } : { default: product.price };

            addToCart({
                ...product,
                price: isFlower ? priceOptions[selectedWeight] : product.price,
                ...(isFlower && { weight: selectedWeight }),
                quantity: 1
            });
        }
    };

    return (
        <div className="product-list">
            <div className="products">
                {products.map((product) => {
                    const isFlower = product.category === 'flower';
                    const selectedWeight = selectedWeights[product.id] || 'ounce';
                    const priceOptions = isFlower ? {
                        ounce: product.price,
                        half: product.price * 0.6,
                        quarter: product.price * 0.4,
                        eighth: product.price * 0.3
                    } : { default: product.price };
                    
                    const displayPrice = isFlower 
                        ? priceOptions[selectedWeight].toFixed(2)
                        : product.price.toFixed(2);

                    return (
                        <div key={product.id} className="product">
                            <Link to={`/product/${product.id}`}>
                                <img src={product.image} alt={product.name} />
                                <h3>{product.name}</h3>
                            </Link>
                            <p>Strain: {product.brand}</p>
                            
                            {isFlower ? (
                                <div className="product-option-group">
                                    <label>Weight:</label>
                                    <select
                                        value={selectedWeight}
                                        onChange={(e) => handleWeightChange(product.id, e.target.value)}
                                        className="weight-select"
                                    >
                                        <option value="ounce">Ounce (${priceOptions.ounce.toFixed(2)})</option>
                                        <option value="half">Half (${priceOptions.half.toFixed(2)})</option>
                                        <option value="quarter">Quarter (${priceOptions.quarter.toFixed(2)})</option>
                                        <option value="eighth">Eighth (${priceOptions.eighth.toFixed(2)})</option>
                                    </select>
                                </div>
                            ) : null}
                            
                            <p>Price: ${displayPrice}</p>
                            <p>
                                Category:
                                <Link to={`/category/${product.category.toLowerCase()}`}>
                                    {product.category}
                                </Link>
                            </p>
                            <button
                                onClick={() => handleAddToCart(product)}
                                className="add-to-cart-btn"
                                disabled={product.countInStock <= 0}
                            >
                                {product.countInStock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductList;