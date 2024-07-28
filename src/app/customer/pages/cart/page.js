'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(100); // Assuming a fixed delivery charge
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
    calculateTotal(storedCart);
  }, []);

  const calculateTotal = (cartItems) => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
    const calculatedTax = subtotal * 0.1; // Assuming a tax rate of 10%
    setTotal(subtotal + calculatedTax + deliveryCharge);
    setTax(calculatedTax);
  };

  const handleCheckout = () => {
    router.push(`/customer/pages/checkout?total=${total}`);
  };

  const handleAddToCart = (item) => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = storedCart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      storedCart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(storedCart));
    setCart(storedCart);
    calculateTotal(storedCart);
    toast.success(`${item.name} added to cart!`);
  };

  const handleRemoveFromCart = (itemId) => {
    let storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    storedCart = storedCart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(storedCart));
    setCart(storedCart);
    calculateTotal(storedCart);
    toast.info(`Product removed from cart!`);
  };

  const updateItemQuantity = (itemId, quantity) => {
    let storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = storedCart.find(item => item.id === itemId);

    if (item) {
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(storedCart));
      setCart(storedCart);
      calculateTotal(storedCart);
    }
  };

  if (cart.length === 0) {
    return <div className="text-center py-8">Your cart is empty</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/5">
          <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
          <div className="flex flex-col gap-4">
            {cart.map((item, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-4 flex items-center justify-between">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={`https://appstore.store2u.ca/uploads/${item.images[0].url}`}
                    alt={item.name}
                    className="h-16 w-16 object-cover rounded mr-4"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 mr-4">
                    No Image
                  </div>
                )}
                <div className="flex-grow">
                  <h3 className="text-md font-semibold">{item.name}</h3>
                  <p className="text-md font-medium text-gray-700">Rs.{item.price}</p>
                  <div className="flex items-center">
                    <button
                      className="bg-gray-300 text-gray-700 px-2 rounded-md"
                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="bg-gray-300 text-gray-700 px-2 rounded-md"
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>
                <button
                  className="bg-red-500 text-white py-1 px-2 rounded-md"
                  onClick={() => handleRemoveFromCart(item.id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-2/5">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-2">
            <div className="flex justify-between">
              <p className="text-md font-medium text-gray-700">Subtotal:</p>
              <p className="text-md text-gray-700">Rs.{total - tax - deliveryCharge}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-md font-medium text-gray-700">Tax (10%):</p>
              <p className="text-md text-gray-700">Rs.{tax}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-md font-medium text-gray-700">Delivery Charge:</p>
              <p className="text-md text-gray-700">Rs.{deliveryCharge}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-md font-medium text-gray-700">Total:</p>
              <p className="text-md text-gray-700">Rs.{total}</p>
            </div>
            <button
              className="bg-teal-500 text-white py-2 px-4 rounded-md mt-4 w-full"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CartPage;
