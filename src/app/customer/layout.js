'use client'
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TopBar from './components/TopBar';
import BrowseCategories from './components/BrowseCategories';

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
