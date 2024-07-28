// components/TopBar.js
'use client';

import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const TopBar = () => {
  return (
    <div className="bg-gray-100 py-2 border-b border-gray-300">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4 text-blue-500">
          <a href="#" className="hover:underline">Become Seller</a>
          <a href="#" className="hover:underline">Affiliation Program</a>
          <motion.div
            className="flex items-center space-x-2 text-gray-500"
            animate={{ x: ['100%', '-100%'] }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          >
            <FiChevronRight />
            <span>Get great devices up to 50% off</span>
            <a href="#" className="text-blue-500 hover:underline">View details</a>
          </motion.div>
        </div>
        <div className="flex items-center space-x-4 text-gray-500">
          <span>Need help? Call Us: <a href="tel:+923128807795" className="text-blue-500 hover:underline">+92 312 8807795</a></span>
          <div className="flex items-center space-x-2">
            <img src="/us-flag.png" alt="US Flag" className="w-5 h-5" />
            <select className="border-none bg-transparent focus:outline-none">
              <option>English</option>
              <option>Spanish</option>
            </select>
          </div>
          <select className="border-none bg-transparent focus:outline-none">
            <option>USD</option>
            <option>EUR</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
