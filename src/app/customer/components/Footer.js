// components/Footer.js

import React from "react";
import { RxGlobe } from "react-icons/rx";
import { MdKeyboardArrowDown, MdCopyright } from "react-icons/md";
import { FaFacebook, FaTwitter, FaPinterest, FaInstagram } from "react-icons/fa";
import Link from 'next/link';

const Footer = () => {
  return (
    <>
      <div className="grid grid-cols-1 px-4 gap-2 md:px-10 lg:px-20 sm:grid-cols-3 md:grid-cols-10 py-16 border-t-2 border-b-2 text-black lg:grid-cols-10">
        <div className="flex flex-col gap-2 col-span-4">
          <Link href="/" legacyBehavior>
            <a className="focus:outline-none">
              <img src="/store2u.webp" className="cursor-pointer w-[100px] " alt="Store2u Logo" />
            </a>
          </Link>
          <p className="text-[15px] font-[400] md:mr-10 sm:mr-10 lg:mr-10 xl:mr-10 text-justify">
            Store2u is your ultimate destination for top-quality products, seamless shopping experience, and unmatched customer service. Discover a wide range of items to meet all your needs.
          </p>
        </div>
        <div className="flex flex-col gap-2 col-span-2">
          <p className="text-[20px] font-[600]">Company</p>
          <Link href="/about" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">About Us</p>
            </a>
          </Link>
          <Link href="/privacy-policy" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">Privacy Policy</p>
            </a>
          </Link>
          <Link href="/terms-conditions" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">Terms & Conditions</p>
            </a>
          </Link>
          <Link href="/contact" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">Contact Us</p>
            </a>
          </Link>
          <Link href="/affiliate-program" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">Affiliate Program</p>
            </a>
          </Link>
        </div>
        <div className="flex flex-col gap-2 col-span-2">
          <p className="text-[20px] font-[600]">Explore</p>
          <Link href="/promotions" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">Promotions</p>
            </a>
          </Link>
          <Link href="/new-arrivals" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">New Arrivals</p>
            </a>
          </Link>
          <Link href="/best-sellers" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">Best Sellers</p>
            </a>
          </Link>
          <Link href="/categories" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">Categories</p>
            </a>
          </Link>
          <Link href="/customer-reviews" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">Customer Reviews</p>
            </a>
          </Link>
        </div>
        <div className="flex flex-col gap-2 col-span-2">
          <p className="text-[20px] font-[600]">Support</p>
          <Link href="/help-center" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">Help Center</p>
            </a>
          </Link>
          <Link href="/pricing" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">Pricing</p>
            </a>
          </Link>
          <p className="text-[15px] font-[400]">Email: support@store2u.com</p>
          <p className="text-[15px] font-[400]">Phone: +1234 567 890</p>
        </div>
      </div>

      <div className="flex justify-around items-center flex-wrap-reverse p-8 gap-6 text-black">
        <div className="flex items-center gap-1 border-2 p-2">
          <RxGlobe className="text-[25px]" />
          <p>English (United States)</p>
          <MdKeyboardArrowDown className="text-[25px]" />
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1">
            <MdCopyright />
            <p>2024 All Rights Reserved</p>
          </div>
          <p>Privacy policy | Terms</p>
        </div>
        <div className="flex gap-[6px] w-[250px] justify-center">
          <FaFacebook className="h-8 w-8" />
          <FaTwitter className="h-8 w-8" />
          <FaPinterest className="h-8 w-8" />
          <FaInstagram className="h-8 w-8" />
        </div>
      </div>
    </>
  );
};

export default Footer;