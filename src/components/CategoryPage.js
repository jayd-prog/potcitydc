import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {products} from '../products';
import ProductList from './ProductList';
import '../css/CategoryPage.css';

const CategoryPage = () => {
    const { category } = useParams();
    const navigate = useNavigate();

    const filteredProducts = products.filter(
        product => product.category.toLowerCase() === category.toLowerCase()
    );

    return (
        <div className="category-container">
            <button 
                onClick={() => navigate(-1)}
                className="back-button"
            >
                ← Go Back
            </button>
            
            <h1 className="category-title">
                {category.charAt(0).toUpperCase() + category.slice(1)} Products
            </h1>
            
            {filteredProducts.length > 0 ? (
                <ProductList products={filteredProducts} />
            ) : (
                <p className="no-products">No products found in this category.</p>
            )}
        </div>
    );
};

export default CategoryPage;