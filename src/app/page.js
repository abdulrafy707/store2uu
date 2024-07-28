'use client'
import React from 'react';

import TopCategories from './customer/components/TopCategories';
import Products from './customer/components/Products';
import Features from './customer/components/Features';
import Slider from './customer/components/Carousel';
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
