'use client';

import React, { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { MdExpandMore } from 'react-icons/md';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };

    const fetchCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(cartItems.length);
    };

    fetchCategories();
    fetchCartCount();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() !== '') {
      router.push(`/customer/pages/allproducts?search=${query.trim()}`);
    }
  };
  

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const visibleCategories = categories.slice(0, 5);
  const hiddenCategories = categories.slice(5);

  return (
    <header className="bg-white py-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img src="/logo.jpg" alt="Logo" className="h-10 w-[200px] mr-6" />
        </div>
        <div className="lg:hidden">
          <button
            className="text-gray-700 hover:text-blue-500 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
        <nav className={`fixed inset-0 bg-white lg:relative lg:bg-transparent w-full lg:flex lg:w-auto lg:items-center ${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="container mx-auto lg:flex lg:items-center lg:justify-between">
            <div className="flex flex-col lg:flex-row text-[15px] lg:mx-auto lg:w-[800px] text-center lg:pl-8 lg:space-x-8">
              {visibleCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/customer/pages/category/${category.id}`}
                  className="relative group text-gray-700 transition-colors duration-300 text-center my-2 lg:my-0"
                >
                  {category.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
              {hiddenCategories.length > 0 && (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center text-gray-700 hover:text-blue-500 transition-colors duration-300 text-center my-2 lg:my-0"
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
            </div>
            {isMobileMenuOpen && (
              <button
                className="absolute top-4 right-4 text-gray-700 hover:text-blue-500 focus:outline-none lg:hidden"
                onClick={toggleMobileMenu}
              >
                <FiX size={24} />
              </button>
            )}
          </div>
        </nav>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="relative flex items-center">
            <form className="w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="What you looking for"
                className="border rounded-full py-1 pl-4 pr-10 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* <FiSearch className="absolute right-3 text-gray-500 cursor-pointer hover:text-blue-500 transition-colors duration-300" /> */}
            </form>
          </div>
          <div>
            <Link href="/customer/pages/cart">
              <FiShoppingCart className="text-gray-700 cursor-pointer hover:text-blue-500 transition-colors duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
