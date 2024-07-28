'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import 'tailwindcss/tailwind.css';

const CategoryProductsComponent = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await axios.get('/api/categories'); // Replace with your actual API endpoint
        const categoriesData = categoriesResponse.data;
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const fetchSubcategoriesAndProducts = async (categoryId) => {
    try {
      const subcategoriesResponse = await axios.get(`/api/subcategories?categoryId=${categoryId}`); // Replace with your actual API endpoint
      const subcategoriesData = subcategoriesResponse.data;

      const productsResponse = await axios.get(`/api/products?categoryId=${categoryId}`); // Adjusted API endpoint to fetch products by category ID
      const productsData = productsResponse.data;

      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error fetching subcategories and products:', error);
    }
  };

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    fetchSubcategoriesAndProducts(categoryId);
  };

  const backgroundColors = [
    'bg-red-100', 'bg-green-100', 'bg-blue-100', 'bg-pink-100', 'bg-gray-100', 'bg-yellow-100'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Categories</h2>
      <div className="flex space-x-4 overflow-x-auto">
        {categories.map((category, index) => (
          <button
            key={category.id}
            className={`cursor-pointer p-2 rounded ${selectedCategory === category.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white shadow-md rounded-lg p-4 relative cursor-pointer h-80"
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.3 }}
              >
                {product.images && product.images.length > 0 ? (
                  <motion.img
                    src={`https://appstore.store2u.ca/uploads/${product.images[0].url}`}
                    alt={product.name}
                    className="h-32 w-full object-cover mb-4 rounded"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    onError={(e) => {
                      console.error(`Failed to load image: ${e.target.src}`);
                      e.target.onerror = null; 
                      e.target.src = '/fallback-image.jpg'; // Replace with a path to a fallback image
                    }}
                  />
                ) : (
                  <div className="h-32 w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-lg font-medium text-gray-700 mb-1">Rs.{product.price}</p>
                <p className="text-gray-500 overflow-hidden text-ellipsis h-12">{product.description}</p>
              </motion.div>
            ))
          ) : (
            selectedCategory && <div className="text-center py-8">No products available for this category.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProductsComponent;
