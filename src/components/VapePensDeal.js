import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from './CartContext';
import {products} from '../products';
import '../css/VapePensDeal.css';

const VapePensDeal = () => {
  const { addToCart } = useContext(CartContext);

  // Deal data setup
  const deals = [
    {
      id: 'desposable-deal',
      name: '4 Disposable Carts',
      category: 'Disposable Cart',
      price: 140,
      quantityText: '4 disposable carts',
      products: products.filter(p => p.category === 'Disposable Cart' && !p.isDeal).slice(0, 2),
      color: '#4cc9f0'
    },
    {
      id: 'cartage-deal',
      name: '4 Cartages Deal',
      category: 'Cartages',
      price: 100,
      quantityText: '4 Cartages',
      products: products.filter(p => p.category === 'Cartages' && !p.isDeal).slice(0, 2),
      color: '#4cc9f0'
    },
    {
      id: 'edible-deal',
      name: '5 Edibles',
      category: 'Edibles',
      price: 100,
      quantityText: '5 edibles',
      products: products.filter(p => p.category === 'Edibles' && !p.isDeal).slice(0, 2),
      color: '#f72585'
    },
    {
      id: 'flower-deal-2oz',
      name: '2oz Flower',
      category: 'flower',
      price: 180,
      quantityText: '2 ounces',
      products: products.filter(p => p.category === 'flower' && !p.isDeal).slice(0, 2),
      color: '#2a9d8f'
    },
    {
      id: 'flower-deal-4oz',
      name: '4oz Flower',
      category: 'flower',
      price: 350,
      quantityText: '4 ounces',
      products: products.filter(p => p.category === 'flower' && !p.isDeal).slice(0, 2),
      color: '#2a9d8f'
    },
    {
      id: 'preroll-deal',
      name: '10 Prerolls',
      category: 'Prerolls',
      price: 80,
      quantityText: '10 Prerolls',
      products: products.filter(p => p.category === 'Prerolls' && !p.isDeal).slice(0, 2),
      color: '#4ad66d'
    },
    {
      id: 'preroll-deal2',
      name: '20 Prerolls',
      category: 'Prerolls',
      price: 150,
      quantityText: '20 Prerolls',
      products: products.filter(p => p.category === 'Prerolls' && !p.isDeal).slice(0, 2),
      color: '#4ad66d'
    },
  ];

  const addDealToCart = (deal) => {
    if (deal.category === 'Vape Pens') {
      deal.products.forEach(product => {
        addToCart({
          ...product,
          quantity: 2,
          isDealItem: true,
          dealPrice: deal.price / 4
        });
      });
    } else {
      addToCart({
        id: deal.id,
        name: deal.name + ' Deal',
        price: deal.price,
        quantity: 1,
        image: `/potcity/images/${deal.id}.jpg`,
        isDeal: true
      });
    }
  };

  return (
    <div className="deals-page">
      <h1>🔥 Hot Deals 🔥</h1>
      
      <div className="deals-grid">
        {deals.map(deal => {
          const regularPrice = deal.products.reduce((sum, p) => sum + p.price, 0);
          const savings = regularPrice - deal.price;
          
          return (
            <div key={deal.id} className="deal-card" style={{ borderTop: `4px solid ${deal.color}` }}>
              <h2>{deal.name}</h2>
              <div className="deal-price">${deal.price}</div>
              <div className="savings">Save ${savings}</div>
              
              <div className="products-grid">
                {deal.products.map(product => (
                  <div key={product.id} className="product-card">
                    <img src={product.image} alt={product.name} />
                    <div className="product-name">{product.name}</div>
                    <div className="original-price">${product.price}</div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => addDealToCart(deal)}
                style={{ backgroundColor: deal.color }}
              >
                Add Deal
              </button>
            </div>
          );
        })}
      </div>

      <Link to="/products" className="back-link">← More Products</Link>
    </div>
  );
};

export default VapePensDeal;