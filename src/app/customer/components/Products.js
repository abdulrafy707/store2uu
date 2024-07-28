'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiPlusCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        // Fetch categories
        const categoryResponse = await axios.get('/api/categories');
        const categories = categoryResponse.data;
        setCategories(categories);

        // Fetch products
        const productsResponse = await axios.get('/api/products');
        const products = productsResponse.data;
        setProducts(products);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories and products:', error);
        setLoading(false);
      }
    };
    fetchCategoriesAndProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const handleProductClick = (id) => {
    router.push(`/customer/pages/products/${id}`);
  };

  return (
    <section className="py-8">
      <div className="container mx-auto">
        {categories.map((category) => (
          <div key={category.id} className="mb-12">
            <div className="flex">
              <div className="w-1/4 pr-4">
                {category.imageUrl ? (
                  <img
                    src={`https://appstore.store2u.ca/uploads/${category.imageUrl}`}
                    alt={category.name}
                    className="w-full h-[400px] rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <h3 className="text-2xl font-bold mt-4">{category.name}</h3>
                <p className="text-gray-500 mt-2">{category.description}</p>
              </div>
              <div className="w-3/4">
                <h2 className="text-3xl font-bold mb-6">{category.name} Products</h2>
                <div className="flex justify-between items-center mb-6">
                  <FiChevronLeft className="h-6 w-6 text-gray-500 cursor-pointer" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products
                      .filter(product => 
                        category.subcategories.some(subcat => subcat.id === product.subcategoryId)
                      )
                      .map((product) => (
                        <div
                          key={product.id}
                          className="bg-white shadow-md rounded-lg p-4 relative cursor-pointer h-72"
                          onClick={() => handleProductClick(product.id)}
                        >
                          {product.images && product.images.length > 0 ? (
                            <motion.img
                              src={`https://appstore.store2u.ca/uploads/${product.images[0].url}`}
                              alt={product.name}
                              className="h-32 w-full object-cover mb-4 rounded"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.3 }}
                              onError={(e) => { e.target.onerror = null; e.target.src = '/default-image.png'; }} // Fallback image
                            />
                          ) : (
                            <div className="h-32 w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
                              No Image
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <FiPlusCircle className="h-6 w-6 text-teal-500 cursor-pointer" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                          <p className="text-lg font-medium text-gray-700 mb-1">Rs.{product.price}</p>
                          <p className="text-gray-500 overflow-hidden text-ellipsis h-12">{product.description}</p>
                        </div>
                      ))}
                  </div>
                  <FiChevronRight className="h-6 w-6 text-gray-500 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;
