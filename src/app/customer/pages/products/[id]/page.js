'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiPlusCircle, FiChevronLeft, FiChevronRight, FiPlus, FiMinus, FiTrash2, FiShoppingCart, FiX } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [cartVisible, setCartVisible] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        const { product, relatedProducts } = response.data;
        setProduct(product);
        setRelatedProducts(relatedProducts);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
    calculateTotal(storedCart);
  }, []);

  const calculateTotal = (cartItems) => {
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
    setTotal(totalAmount);
  };

  const addToCart = (product) => {
    let updatedCart = [...cart];
    const existingItem = updatedCart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    toast.success(`${product.name} added to cart!`);
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

  const handleRemoveFromCart = (itemId) => {
    let storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    storedCart = storedCart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(storedCart));
    setCart(storedCart);
    calculateTotal(storedCart);
    toast.info(`Product removed from cart!`);
  };

  const getImageUrl = (url) => {
    return `https://appstore.store2u.ca/uploads/${url}`;
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };

  const handleRelatedProductClick = (id) => {
    router.push(`/customer/pages/products/${id}`);
  };

  if (!product) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Product Page</h2>
      </div>
      <div className="flex">
        <div className="w-1/2">
          <div className="relative mb-8">
            {product.images && product.images.length > 0 ? (
              <>
                <motion.img
                  key={currentImageIndex}
                  src={getImageUrl(product.images[currentImageIndex].url)}
                  alt={product.name}
                  className="w-full h-[400px] object-cover mb-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute top-1/2 transform -translate-y-1/2 left-0">
                  <button className="bg-gray-800 text-white p-2 rounded-full" onClick={handlePreviousImage}>
                    <FiChevronLeft className="h-6 w-6" />
                  </button>
                </div>
                <div className="absolute top-1/2 transform -translate-y-1/2 right-0">
                  <button className="bg-gray-800 text-white p-2 rounded-full" onClick={handleNextImage}>
                    <FiChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </>
            ) : (
              <div className="h-48 w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>
        </div>
        <div className="w-1/2 pl-8">
          <h2 className="text-3xl font-semibold mb-4">{product.name}</h2>
          <div className="flex items-center mb-4">
            {product.originalPrice && (
              <span className="text-red-500 line-through mr-4">Rs.{product.originalPrice}</span>
            )}
            <span className="text-green-500 text-2xl">Rs.{product.price}</span>
          </div>
          <p className="text-gray-500 mb-4">{product.description}</p>
          <button className="bg-teal-500 text-white py-2 px-4 rounded-md" onClick={() => addToCart(product)}>Add to cart</button>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-6">Related Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <div
              key={relatedProduct.id}
              className="bg-white shadow-md rounded-lg p-4 relative cursor-pointer"
              onClick={() => handleRelatedProductClick(relatedProduct.id)}
            >
              {relatedProduct.images && relatedProduct.images.length > 0 ? (
                <motion.img
                  src={getImageUrl(relatedProduct.images[0].url)}
                  alt={relatedProduct.name}
                  className="h-48 w-full object-cover mb-4 rounded"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => { e.target.onerror = null; e.target.src = '/default-image.png'; }} // Fallback image
                />
              ) : (
                <div className="h-48 w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div className="absolute top-2 right-2">
                <FiPlusCircle className="h-6 w-6 text-teal-500 cursor-pointer" onClick={() => addToCart(relatedProduct)} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{relatedProduct.name}</h3>
              <p className="text-lg font-medium text-gray-700 mb-1">Rs.{relatedProduct.price}</p>
              <p className="text-gray-500">{relatedProduct.description}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setCartVisible(true)}
        className="fixed bottom-4 right-4 bg-teal-500 text-white p-4 rounded-full shadow-lg z-50"
      >
        <FiShoppingCart className="h-8 w-8" />
        {cart.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cart.length}</span>
        )}
      </button>

      {cartVisible && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-end z-50">
          <div className="bg-white w-1/3 h-full p-4 overflow-y-auto">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Cart</h2>
              <button onClick={() => setCartVisible(false)}>
                <FiX className="h-6 w-6 text-gray-700" />
              </button>
            </div>
            {cart.length === 0 ? (
              <div className="text-center py-8">Your cart is empty</div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex items-center mb-4">
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
              ))
            )}
            {cart.length > 0 && (
              <div className="mt-6">
                <p className="text-md font-medium text-gray-700">Subtotal: Rs.{total}</p>
                <button
                  className="bg-teal-500 text-white py-2 px-4 rounded-md mt-4 w-full"
                  onClick={() => router.push('/customer/pages/cart')}
                >
                  View Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ProductPage;
