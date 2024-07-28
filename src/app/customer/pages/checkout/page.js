// app/customer/pages/checkout/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const CheckoutPage = () => {
  const [billingAddress, setBillingAddress] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: ''
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
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);

    const totalAmount = storedCart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
    setTotal(totalAmount);
  }, []);

  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post('/api/orders', {
        billingAddress,
        shippingAddress,
        paymentMethod,
        paymentInfo: paymentMethod === 'Credit Card' ? paymentInfo : null,
        items: cart,
        total
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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
      <div className="text-xl font-semibold mb-6">Total: Rs.{total}</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Billing Address Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Billing Address</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={billingAddress.name}
              onChange={(e) => setBillingAddress({ ...billingAddress, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={billingAddress.email}
              onChange={(e) => setBillingAddress({ ...billingAddress, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={billingAddress.address}
              onChange={(e) => setBillingAddress({ ...billingAddress, address: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">City</label>
            <input
              type="text"
              value={billingAddress.city}
              onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">State</label>
            <input
              type="text"
              value={billingAddress.state}
              onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">ZIP Code</label>
            <input
              type="text"
              value={billingAddress.zip}
              onChange={(e) => setBillingAddress({ ...billingAddress, zip: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        {/* Shipping Address Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={shippingAddress.name}
              onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">City</label>
            <input
              type="text"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">State</label>
            <input
              type="text"
              value={shippingAddress.state}
              onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">ZIP Code</label>
            <input
              type="text"
              value={shippingAddress.zip}
              onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
        </div>
      </div>

      {/* Payment Method Form */}
      <div className="mb-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="mb-4">
            <label className="block text-gray-700">Card Number</label>
            <input
              type="text"
              value={paymentInfo.cardNumber}
              onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Card Name</label>
            <input
              type="text"
              value={paymentInfo.cardName}
              onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Expiry Date</label>
            <input
              type="text"
              value={paymentInfo.expiryDate}
              onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">CVV</label>
            <input
              type="text"
              value={paymentInfo.cvv}
              onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
        </div>
      )}

      <button className="bg-teal-500 text-white py-2 px-4 rounded-md mt-8" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
};

export default CheckoutPage;
