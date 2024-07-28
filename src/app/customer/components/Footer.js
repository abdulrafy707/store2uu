'use client'
import React from 'react';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center mb-12">
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <Image src="/path-to-logo.png" alt="Logo" width={150} height={75} />
            <p className="mt-4 text-gray-600">Since 1941</p>
          </div>
          <div className="w-full md:w-1/3 mb-8 md:mb-0 text-center">
            <h2 className="text-lg font-semibold mb-2">DOWNLOAD THE APP</h2>
            <div className="flex justify-center space-x-4">
              <a href="https://play.google.com/store" className="transform hover:scale-105 transition duration-300">
                <Image src="/playstore.png" alt="Google Play" width={100} height={20} />
              </a>
              <a href="https://www.apple.com/app-store" className="transform hover:scale-105 transition duration-300">
                <Image src="/appstore.png" alt="App Store" width={100} height={20} />
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/3 text-center md:text-right">
            <h2 className="text-lg font-semibold mb-2">FOLLOW US ON</h2>
            <div className="flex justify-center md:justify-end space-x-4">
              <a href="https://www.facebook.com" className="text-gray-600 hover:text-blue-500 transform hover:scale-125 transition duration-300">
                <FaFacebookF className="w-6 h-6" />
              </a>
              <a href="https://www.instagram.com" className="text-gray-600 hover:text-pink-500 transform hover:scale-125 transition duration-300">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="https://www.youtube.com" className="text-gray-600 hover:text-red-500 transform hover:scale-125 transition duration-300">
                <FaYoutube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h2 className="text-lg font-semibold mb-4">Customer Service</h2>
            <ul>
              <li className="mb-2 hover:text-gray-700 transition duration-300 cursor-pointer">My Account</li>
              <li className="mb-2 hover:text-gray-700 transition duration-300 cursor-pointer">FAQs</li>
              <li className="mb-2 hover:text-gray-700 transition duration-300 cursor-pointer">Cash On Delivery Service</li>
              <li className="mb-2 hover:text-gray-700 transition duration-300 cursor-pointer">Contact Us</li>
              <li className="mb-2 hover:text-gray-700 transition duration-300 cursor-pointer">Store Locator</li>
            </ul>
          </div>
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h2 className="text-lg font-semibold mb-4">Help & Information</h2>
            <ul>
              <li className="mb-2 hover:text-gray-700 transition duration-300 cursor-pointer">About Us</li>
              <li className="mb-2 hover:text-gray-700 transition duration-300 cursor-pointer">Shipping & Exchange Policy</li>
              <li className="mb-2 hover:text-gray-700 transition duration-300 cursor-pointer">Terms & Conditions</li>
              <li className="mb-2 hover:text-gray-700 transition duration-300 cursor-pointer">Privacy Policy</li>
              <li className="mb-2 hover:text-gray-700 transition duration-300 cursor-pointer">Payment Information</li>
              <li className="mb-2 hover:text-gray-700 transition duration-300 cursor-pointer">Credit/Debit Card Policy</li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <p className="mb-2 text-gray-600">Al-Fatah Head Office, 52B, Block E1, Adjacent Shapes Gym, Gulberg 3, Lahore, Pakistan</p>
            <p className="mb-2 text-gray-600">For Queries and Complaints:</p>
            <p className="mb-2 text-gray-600">042-32307777 (9:00 AM TO 9:00 PM)</p>
            <p className="mb-2 text-gray-600">Whatsapp message only: 0311-1555222 (9:00 AM TO 9:00 PM)</p>
            <p className="mb-2 text-gray-600">Email: info@alfatah.pk</p>
          </div>
        </div>
        <div className="text-center mt-8 text-gray-600">
          <p>© 2024, Al-Fatah All Rights Reserved - Powered By Tech Andaz</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
