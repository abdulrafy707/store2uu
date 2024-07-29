'use client';

import React, { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { MdExpandMore } from 'react-icons/md';
import Link from 'next/link';

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(cartItems.length);
    };

    fetchCategories();
    fetchCartCount();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const visibleCategories = categories.slice(0, 5);
  const hiddenCategories = categories.slice(5);

  return (
    <header className="bg-white py-4 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex w-full items-center">
          <img src="/logo.jpg" alt="Logo" className="h-10 w-[200px] mr-6" />
          <nav className="flex text-[19px] mx-auto w-[1000px] text-center pl-8 space-x-8">
            {visibleCategories.map((category) => (
              <Link key={category.id} href={`/customer/pages/category/${category.id}`} className="relative group text-gray-700 transition-colors duration-300 text-center ">
                {category.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            {hiddenCategories.length > 0 && (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-gray-700 hover:text-blue-500 transition-colors duration-300 text-center"
                >
                  More <MdExpandMore />
                </button>
                {isDropdownOpen && (
                  <div className="absolute mt-2 w-48 bg-white border border-gray-200 shadow-lg z-10">
                    <div className="py-2">
                      {hiddenCategories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/customer/pages/category/${category.id}`}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="What you looking for"
              className="border rounded-full py-1 px-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute right-2 text-gray-500 cursor-pointer hover:text-blue-500 transition-colors duration-300" />
          </div>
          <div className="relative flex items-center">
            <Link href="/customer/pages/cart">
              <FiShoppingCart className="text-gray-700 cursor-pointer w-[50px] h[50px] hover:text-blue-500 transition-colors duration-300" />
            </Link>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
