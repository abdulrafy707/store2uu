'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiUser, FiHome, FiMapPin, FiPhone, FiMail, FiCreditCard, FiCalendar, FiLock } from 'react-icons/fi';
import {jwtDecode} from 'jwt-decode';

const CheckoutPage = () => {
  const [shippingAddress, setShippingAddress] = useState({
    recipientName: '',
    streetAddress: '',
    apartmentSuite: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phoneNumber: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert('You need to log in to place an order');
      router.push('/customer/pages/login'); // Redirect to login page if token is not found
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        sessionStorage.removeItem('authToken'); // Remove expired token
        alert('Your session has expired. Please log in again.');
        router.push('/customer/pages/login'); // Redirect to login page
        return;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      alert('An error occurred. Please log in again.');
      router.push('/customer/pages/login'); // Redirect to login page
      return;
    }

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);

    const totalAmount = storedCart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
    setTotal(totalAmount);
  }, [router]);

  const handlePlaceOrder = async () => {
    try {
      const token = sessionStorage.getItem('authToken'); // Retrieve the auth token from session storage

      if (!token) {
        alert('You need to log in to place an order');
        router.push('/customer/pages/login'); // Redirect to login page if token is not found
        return;
      }

      const response = await axios.post('/api/orders', {
        shippingAddress,
        paymentMethod,
        paymentInfo: paymentMethod === 'Credit Card' ? paymentInfo : null,
        items: cart,
        total
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Include the auth token in the request headers
        }
      });

      if (response.data.status) {
        alert('Order placed successfully');
        localStorage.removeItem('cart');
        router.push('/');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="container bg-white mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Address Form */}
        <div className="border p-4">
          <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
          <div className="mb-4 relative">
            <FiUser className="absolute left-3 top-3 text-gray-500 font-bold" />
            <input
              type="text"
              placeholder="Recipient Name"
              value={shippingAddress.recipientName}
              onChange={(e) => setShippingAddress({ ...shippingAddress, recipientName: e.target.value })}
              className="w-full pl-10 px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 relative">
            <FiHome className="absolute left-3 top-3 text-gray-500 font-bold" />
            <input
              type="text"
              placeholder="Street Address"
              value={shippingAddress.streetAddress}
              onChange={(e) => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
              className="w-full pl-10 px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 relative">
            <FiHome className="absolute left-3 top-3 text-gray-500 font-bold" />
            <input
              type="text"
              placeholder="Apartment/Suite Number"
              value={shippingAddress.apartmentSuite}
              onChange={(e) => setShippingAddress({ ...shippingAddress, apartmentSuite: e.target.value })}
              className="w-full pl-10 px-4 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4 relative">
            <FiMapPin className="absolute left-3 top-3 text-gray-500 font-bold" />
            <input
              type="text"
              placeholder="City"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              className="w-full pl-10 px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 relative">
            <FiMapPin className="absolute left-3 top-3 text-gray-500 font-bold" />
            <input
              type="text"
              placeholder="State/Province/Region"
              value={shippingAddress.state}
              onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
              className="w-full pl-10 px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 relative">
            <FiMapPin className="absolute left-3 top-3 text-gray-500 font-bold" />
            <input
              type="text"
              placeholder="Postal/ZIP Code"
              value={shippingAddress.zip}
              onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
              className="w-full pl-10 px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 relative">
            <FiMapPin className="absolute left-3 top-3 text-gray-500 font-bold" />
            <input
              type="text"
              placeholder="Country"
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              className="w-full pl-10 px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 relative">
            <FiPhone className="absolute left-3 top-3 text-gray-500 font-bold" />
            <input
              type="text"
              placeholder="Phone Number"
              value={shippingAddress.phoneNumber}
              onChange={(e) => setShippingAddress({ ...shippingAddress, phoneNumber: e.target.value })}
              className="w-full pl-10 px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 relative">
            <FiMail className="absolute left-3 top-3 text-gray-500 font-bold" />
            <input
              type="email"
              placeholder="Email Address"
              value={shippingAddress.email}
              onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
              className="w-full pl-10 px-4 py-2 border rounded-md"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="border p-4">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-2">
            <div className="flex justify-between">
              <p className="text-xl font-bold text-gray-700">Subtotal:</p>
              <p className="text-xl text-gray-700">Rs.{total}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-md font-medium text-gray-700">Tax (10%):</p>
              <p className="text-md text-gray-700">Rs.{(total * 0.1).toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-md font-medium text-gray-700">Delivery Charge:</p>
              <p className="text-md text-gray-700">Rs.100</p>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between">
              <p className="text-xl font-bold text-gray-700">Total:</p>
              <p className="text-xl text-gray-700">Rs.{(total + total * 0.1 + 100).toFixed(2)}</p>
            </div>
          </div>

          {/* Payment Method Form */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
            <div className="flex items-center mb-4">
              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                value="Cash on Delivery"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="cod" className="ml-2">Cash on Delivery</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="creditCard"
                name="paymentMethod"
                value="Credit Card"
                checked={paymentMethod === 'Credit Card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="creditCard" className="ml-2">Credit Card</label>
            </div>
          </div>

          {paymentMethod === 'Credit Card' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="mb-4 relative flex items-center">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md pr-10"
                  required
                />
                <FiCreditCard className="absolute right-3 text-gray-500 font-bold" />
              </div>
              <div className="mb-4 relative flex items-center">
                <input
                  type="text"
                  placeholder="Card Name"
                  value={paymentInfo.cardName}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md pr-10"
                  required
                />
                <FiUser className="absolute right-3 text-gray-500 font-bold" />
              </div>
              <div className="mb-4 relative flex items-center">
                <input
                  type="text"
                  placeholder="Expiry Date"
                  value={paymentInfo.expiryDate}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md pr-10"
                  required
                />
                <FiCalendar className="absolute right-3 text-gray-500 font-bold" />
              </div>
              <div className="mb-4 relative flex items-center">
                <input
                  type="text"
                  placeholder="CVV"
                  value={paymentInfo.cvv}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md pr-10"
                  required
                />
                <FiLock className="absolute right-3 text-gray-500 font-bold" />
              </div>
            </div>
          )}

          <button className="bg-teal-500 text-white py-2 px-4 rounded-md mt-8 w-full" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
