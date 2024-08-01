'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`/api/products?search=${query}`);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    if (query) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Search Results for "{query}"</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Link
              key={product.id}
              href={`/customer/pages/products/${product.id}`}
              className="bg-white shadow-md rounded-lg p-4 cursor-pointer"
            >
              {product.images && product.images.length > 0 ? (
                <img
                  src={`https://appstore.store2u.ca/uploads/${product.images[0].url}`}
                  alt={product.name}
                  className="h-32 w-full object-cover mb-4 rounded"
                />
              ) : (
                <div className="h-32 w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2 overflow-hidden text-ellipsis whitespace-nowrap">{product.name}</h3>
              <p className="text-lg font-medium text-gray-700 mb-1">Rs.{product.price}</p>
              <p className="text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">{product.description}</p>
            </Link>
          ))
        ) : (
          <div className="text-center col-span-full py-8 text-gray-500">No products found for "{query}".</div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
