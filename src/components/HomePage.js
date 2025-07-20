import React from 'react';
import ProductList from './ProductList';
import {products} from '../products';
const HomePage = () => {
    return (
        <div>
            <ProductList products={products.slice(0, 100)} />
        </div>
    );
};

export default HomePage;