'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiPlusCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const productRefs = useRef([]);
  const router = useRouter();

  // Fetch categories, subcategories, and products on component mount
  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const categoryResponse = await axios.get('/api/categories');
        const categoriesData = categoryResponse.data;
        setCategories(categoriesData);

        const subcategoryResponse = await axios.get('/api/subcategories');
        const subcategoriesData = subcategoryResponse.data;
        setSubcategories(subcategoriesData);

        const productsResponse = await axios.get('/api/products');
        const productsData = productsResponse.data;
        setProducts(productsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories and products:', error);
        setLoading(false);
      }
    };
    fetchCategoriesAndSubcategories();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const handleProductClick = (id) => {
    router.push(`/customer/pages/products/${id}`);
  };

  const scrollLeft = (index) => {
    if (productRefs.current[index]) {
      productRefs.current[index].scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = (index) => {
    if (productRefs.current[index]) {
      productRefs.current[index].scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto">
        {categories.map((category, index) => {
          // Find subcategories for the current category
          const categorySubcategories = subcategories.filter(subcat => subcat.categoryId === category.id);

          // Filter products that belong to these subcategories
          const categoryProducts = products.filter(product =>
            categorySubcategories.some(subcat => subcat.id === product.subcategoryId)
          );

          // Initialize the ref for this category if not already done
          if (!productRefs.current[index]) {
            productRefs.current[index] = React.createRef();
          }

          return (
            <div key={category.id} className="mb-12">
              <div className="flex">
                <div className="w-1/4 pr-4">
                  {category.imageUrl ? (
                    <img
                      src={`https://appstore.store2u.ca/uploads/${category.imageUrl}`}
                      alt={category.name}
                      className="w-full h-[300px] rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                  <h3 className="text-2xl text-gray-800 font-normal mt-4">{category.name}</h3>
                  <p className="text-gray-500 mt-2">{category.description}</p>
                </div>
                <div className="w-3/4 relative">
                  {/* <h2 className="text-3xl font-bold mb-6">{category.name} Products</h2> */}
                  <FiChevronLeft
                    className="h-6 w-6 text-gray-500 cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
                    onClick={() => scrollLeft(index)}
                  />
                  <div ref={el => (productRefs.current[index] = el)} className="flex space-x-4 overflow-x-hidden pl-8 pr-8">
                    {categoryProducts.length > 0 ? (
                      categoryProducts.map((product) => (
                        <div
                          key={product.id}
                          className="bg-white shadow-md rounded-lg p-4 relative cursor-pointer w-60 h-72 flex-shrink-0"
                          onClick={() => handleProductClick(product.id)}
                        >
                          {product.images && product.images.length > 0 ? (
                            <motion.img
                              src={`https://appstore.store2u.ca/uploads/${product.images[0].url}`}
                              alt={product.name}
                              className="h-40 w-full object-cover mb-4 rounded"
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
                            {/* <FiPlusCircle className="h-6 w-6 text-teal-500 cursor-pointer" /> */}
                          </div>
                          <h3 className="text-xl mb-2 overflow-hidden text-ellipsis whitespace-nowrap">{product.name}</h3>
                          <p className="text-lg font-medium text-gray-700 mb-1">Rs.{product.price}</p>
                          <p className="text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">{product.description}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center col-span-full py-8 text-gray-500">No products available in this category.</div>
                    )}
                  </div>
                  <FiChevronRight
                    className="h-6 w-6 text-gray-500 cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
                    onClick={() => scrollRight(index)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Products;
