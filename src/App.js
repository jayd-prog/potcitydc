import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ProductList from './components/ProductList';
import ProductPage from './components/ProductPage';
import CategoryList from './components/CategoryList';
import CategoryPage from './components/CategoryPage';
import Footer from './components/Footer';
import FAQ from './components/FAQ';
import OrderSummary from './components/OrderSummary';
import { CartProvider } from './components/CartContext';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import Compliance from './components/Compliance';
import VapePensDeal from './components/VapePensDeal';
import {products} from './products';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Compliance /> {/* Add this line to make it appear on all pages */}
          <Navbar />
          <CategoryList />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductList products={products} />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-summary" element={<OrderSummary />} />
            <Route path="/deals" element={<VapePensDeal />} />

            
            {/* Remove the separate compliance route if not needed */}
          </Routes>
          <FAQ />
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;