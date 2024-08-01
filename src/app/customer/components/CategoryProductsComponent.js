'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation'; // Import the useRouter hook

const SubcategoryProductsComponent = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const router = useRouter(); // Initialize the useRouter hook

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const subcategoriesResponse = await axios.get('/api/subcategories');
        const subcategoriesData = subcategoriesResponse.data;
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };
    fetchSubcategories();
  }, []);

  const fetchProducts = async (subcategoryId) => {
    try {
      const productsResponse = await axios.get(`/api/products?subcategoryId=${subcategoryId}`);
      const productsData = productsResponse.data;
      setProducts(productsData);
      setFilteredProducts(productsData.slice(0, productsPerPage));
      setCurrentPage(1);

      // Log products in the terminal including image URLs
      productsData.forEach(product => {
        const imageUrls = product.images.map(image => image.url);
        console.log(`Product ${product.id}: ${product.name}`);
        console.log(`  Image URLs: ${imageUrls.join(', ')}`);
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubcategoryClick = async (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    await fetchProducts(subcategoryId);
  };

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    setFilteredProducts(products.slice(startIndex, endIndex));
    setCurrentPage(nextPage);
  };

  const handlePreviousPage = () => {
    const previousPage = currentPage - 1;
    const startIndex = (previousPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    setFilteredProducts(products.slice(startIndex, endIndex));
    setCurrentPage(previousPage);
  };

  const handleProductClick = (productId) => {
    router.push(`/customer/pages/products/${productId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Subcategories</h2>
      <div className="flex space-x-4 overflow-x-auto">
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

      {selectedSubcategory && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-6">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredProducts.length ? (
              filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="bg-white shadow-md rounded-lg p-4 relative cursor-pointer"
                  whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleProductClick(product.id)} // Handle product click
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
                  <h3 className="text-xl font-semibold mb-2 overflow-hidden text-ellipsis whitespace-nowrap">{product.name}</h3>
                  <p className="text-lg font-medium text-gray-700 mb-1">Rs.{product.price}</p>
                  <p className="text-gray-500 overflow-hidden text-ellipsis h-12">{product.description}</p>
                  <p className="text-sm text-gray-500 mt-2">ID: {product.id}</p>
                </motion.div>
              ))
            ) : (
              <div className="text-center col-span-full py-8 text-gray-500">No products available in this subcategory.</div>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <FiChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
              onClick={handleNextPage}
              disabled={currentPage * productsPerPage >= products.length}
            >
              <FiChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubcategoryProductsComponent;
