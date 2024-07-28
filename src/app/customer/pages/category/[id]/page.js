'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import { motion } from 'framer-motion';

const CategoryPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [highestPrice, setHighestPrice] = useState(0);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoryResponse = await axios.get(`/api/categories/${id}`);
        setCategory(categoryResponse.data);

        const subcategoriesResponse = await axios.get(`/api/subcategories?categoryId=${id}`);
        setSubcategories(subcategoriesResponse.data);

        const productsResponse = await axios.get(`/api/products?categoryId=${id}`);
        const productsData = productsResponse.data;
        setProducts(productsData);
        setFilteredProducts(productsData);

        const highestProductPrice = Math.max(...productsData.map(product => product.price));
        setHighestPrice(highestProductPrice);
        setPriceRange({ min: 0, max: highestProductPrice });
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    if (id) {
      fetchCategoryData();
    }
  }, [id]);

  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    filterProducts(subcategoryId, priceRange);
  };

  const handleShowAllProducts = () => {
    setSelectedSubcategory(null);
    filterProducts(null, priceRange);
  };

  const handlePriceFilterChange = (min, max) => {
    setPriceRange({ min, max });
    filterProducts(selectedSubcategory, { min, max });
  };

  const filterProducts = (subcategoryId, { min, max }) => {
    let filtered = products;
    if (subcategoryId) {
      filtered = filtered.filter(product => product.subcategoryId === subcategoryId);
    }
    filtered = filtered.filter(product => product.price >= min && product.price <= max);
    setFilteredProducts(filtered);
  };

  const getImageUrl = (url) => {
    return `https://appstore.store2u.ca/uploads/${url}`;
  };

  const handleProductClick = (productId) => {
    router.push(`/customer/pages/products/${productId}`);
  };

  if (!category) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">{category.name}</h2>
      <div className="flex space-x-4 mb-6 overflow-x-auto">
        <button
          className={`cursor-pointer p-2 rounded ${!selectedSubcategory ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
          onClick={handleShowAllProducts}
        >
          All
        </button>
        {subcategories.map((subcategory) => (
          <button
            key={subcategory.id}
            className={`cursor-pointer p-2 rounded ${selectedSubcategory === subcategory.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            onClick={() => handleSubcategoryClick(subcategory.id)}
          >
            {subcategory.name}
          </button>
        ))}
      </div>
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Filter:</span>
          <div>
            <span>Price</span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => handlePriceFilterChange(e.target.value, priceRange.max)}
                className="border border-gray-300 p-2 rounded"
                placeholder="From"
              />
              <span>-</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => handlePriceFilterChange(priceRange.min, e.target.value)}
                className="border border-gray-300 p-2 rounded"
                placeholder="To"
              />
            </div>
            <span className="block text-sm text-gray-500 mt-1">The highest price is Rs.{highestPrice}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-lg p-4 relative cursor-pointer h-80"
            onClick={() => handleProductClick(product.id)}
          >
            {product.images && product.images.length > 0 ? (
              <motion.img
                src={getImageUrl(product.images[0].url)}
                alt={product.name}
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
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-lg font-medium text-gray-700 mb-1">Rs.{product.price}</p>
            <p className="text-gray-500">{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
