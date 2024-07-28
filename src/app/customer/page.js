'use client'
import React from 'react';
import FlashSale from './components/FlashSale';
import TopCategories from './components/TopCategories';
import Products from './components/Products';
import Features from './components/Features';
import Slider from './components/Carousel';
import CategoryProductsComponent from './components/CategoryProductsComponent';


export default function CustomerPage () {
 

  return (
    <div>
      
      <carousel/>
      
     
      <Slider/>
     
      <main className="p-4">
       
        
        <FlashSale />
        <TopCategories/>
        <Products/>
        <Features/>
        <CategoryProductsComponent/>
        
      </main>
    </div>
  );
};
