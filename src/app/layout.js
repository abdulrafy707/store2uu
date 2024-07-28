'use client'
import React from 'react';
import Header from './customer/components/Header';
import Footer from './customer/components/Footer';
import TopBar from './customer/components/TopBar';
import BrowseCategories from './customer/components/BrowseCategories';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />
      <main className="flex-grow">
        <BrowseCategories />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
