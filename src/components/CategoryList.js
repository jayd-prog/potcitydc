import React from 'react';
import { Link } from 'react-router-dom';
import {products} from '../products';
import '../css/CategoryList.css'
const categories = [...new Set(products.map(product => product.category))];

const CategoryList = () => {
    return (
        <div className="category-list">
            <h2>Product Categories</h2>
            <ul>
                {categories.map((category, index) => (
                    <li key={index}>
                        <Link to={`/category/${category.toLowerCase()}`}>
                            {category}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;