'use client'
import React from 'react';

import TopCategories from './components/TopCategories';
import Products from './components/Products';
import Features from './components/Features';
import Slider from './components/Carousel';
import CategoryProductsComponent from './components/CategoryProductsComponent';


export default function CustomerPage () {
  // const [formData, setFormData] = useState({});

  return (
    <div>
      
      
    
      <Slider/>
     
      <main className="p-4">
       
        
        
        <TopCategories/>
        <Products/>
        <Features/>
        <CategoryProductsComponent/>
        
      </main>
    </div>
  );
};
