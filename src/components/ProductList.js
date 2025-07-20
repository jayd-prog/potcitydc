import React from 'react';
import { useContext } from 'react';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom';
import '../css/ProductList.css';

const ProductList = ({ products }) => {
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = (product) => {
        if (product.countInStock > 0) {
            addToCart({
                ...product,
                quantity: 1
            });
        }
    };

    return (
        <div className="product-list">
            {/* <h1>All Products</h1> */}
            <div className="products">
                {products.map((product) => (
                    <div key={product.id} className="product">
                        <Link to={`/product/${product.id}`}>
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                        </Link>
                        <p>Strain: {product.brand}</p>
                        <p>Price: ${product.price}</p>
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
                ))}
            </div>
        </div>
    );
};

export default ProductList;