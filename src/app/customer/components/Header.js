'use client';

import React, { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiMenu } from 'react-icons/fi';
import Link from 'next/link';

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
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

  return (
    <header className="bg-white shadow-sm py-4 relative">
      <div className="container text-2xl pl-10 mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img src="/logo.jpg" alt="Logo" className="h-15 w-20 mr-4" />
          <button
            onClick={toggleDropdown}
            className="flex items-center text-gray-700 hover:text-blue-500 transition-colors duration-300"
          >
            <FiMenu className="mr-2" />
            Departments
          </button>
          <nav className="ml-6 flex space-x-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/customer/pages/category/${category.id}`} className="text-gray-700 hover:text-blue-500 transition-colors duration-300">
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center">
            <FiSearch className="text-gray-700 hover:text-blue-500 transition-colors duration-300" />
          </div>
          <div className="relative flex items-center">
            <FiUser className="text-gray-700 hover:text-blue-500 transition-colors duration-300" />
          </div>
          <div className="relative flex items-center">
            <Link href="/customer/pages/cart">
              <FiShoppingCart className="text-gray-700 cursor-pointer hover:text-blue-500 transition-colors duration-300" />
            </Link>
            <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
          </div>
        </div>
      </div>
      {isDropdownOpen && (
        <div className="absolute left-0 mt-2 w-3/4 bg-blue-50 border border-gray-200 shadow-lg z-10">
          <div className="container mx-auto py-4 flex">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col bg-white p-4 rounded-l-lg">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/customer/pages/category/${category.id}`}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <img
                      src={`https://appstore.store2u.ca/uploads/${category.imageUrl}`}
                      alt={category.name}
                      className="h-8 w-8 rounded-full mr-2"
                      onError={(e) => {
                        console.error(`Failed to load image: ${e.target.src}`);
                        e.target.onerror = null;
                        e.target.src = '/fallback-image.jpg'; // Replace with a path to a fallback image
                      }}
                    />
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>
              <div className="col-span-2 flex flex-col bg-blue-100 p-4 rounded-r-lg">
                {hoveredCategory && (
                  <div className="grid grid-cols-2 gap-4">
                    {categories.find(cat => cat.id === hoveredCategory)?.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/customer/pages/category/${hoveredCategory}#subcategory-${subcategory.id}`}
                        className="flex items-center p-2 hover:bg-gray-200 cursor-pointer rounded-md"
                      >
                        <img
                          src={`https://appstore.store2u.ca/uploads/${subcategory.imageUrl}`}
                          alt={subcategory.name}
                          className="h-8 w-8 rounded-full mr-2"
                          onError={(e) => {
                            console.error(`Failed to load image: ${e.target.src}`);
                            e.target.onerror = null;
                            e.target.src = '/fallback-image.jpg'; // Replace with a path to a fallback image
                          }}
                        />
                        <span>{subcategory.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
