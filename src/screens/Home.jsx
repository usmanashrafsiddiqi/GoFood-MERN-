import React from 'react';
import Footer from '../components/Footer';
import ProductList from '../components/ProductList';
import Carousel from '../components/Carousel';

export default function Home() {
  return (
    <div>
      <Carousel />
      <div className="container">
        <ProductList />
      </div>
      <Footer />
    </div>
  );
}
