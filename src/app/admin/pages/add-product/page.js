// pages/add-product.js
'use client';

import { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const AddProductPage = ({ categories, subcategories }) => {
  const [newProduct, setNewProduct] = useState({
    id: null,
    name: '',
    richDescription: '',
    price: '',
    stock: '',
    categoryId: '',
    subcategoryId: '',
    colors: [],
    sizes: [],
    image: null, // Image file
    imageUrl: '', // Image URL
  });

  const [images, setImages] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (newProduct.categoryId && Array.isArray(subcategories)) {
      setFilteredSubcategories(
        subcategories.filter(subcat => subcat.categoryId === parseInt(newProduct.categoryId))
      );
    } else {
      setFilteredSubcategories([]);
    }
  }, [newProduct.categoryId, subcategories]);

  const handleAddNewItem = async () => {
    if (!newProduct.name || !newProduct.richDescription || !newProduct.price || !newProduct.stock || !newProduct.subcategoryId) {
      alert("All fields are required");
      return;
    }
    setIsLoading(true);

    try {
      const uploadedImages = await Promise.all(images.map(async (img) => {
        const imageBase64 = await convertToBase64(img);
        const response = await fetch('https://appstore.store2u.ca/uploadImage.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imageBase64 }),
        });
        const result = await response.json();
        if (response.ok) {
          return result.image_url;
        } else {
          throw new Error(result.error || 'Failed to upload image');
        }
      }));

      let plainText = '';
      if (typeof window !== 'undefined') {
        const quill = document.querySelector('.ql-editor'); // Get the Quill editor element
        plainText = quill ? quill.innerText : ''; // Extract plain text from the Quill editor
      }

      const productToSubmit = {
        ...newProduct,
        description: plainText,  // Use plain text as description
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        subcategoryId: parseInt(newProduct.subcategoryId),
        colors: JSON.stringify(newProduct.colors.map(color => color.value)),
        sizes: JSON.stringify(newProduct.sizes.map(size => size.value)),
        images: uploadedImages,
      };

      const response = newProduct.id 
        ? await fetch(`/api/products/${newProduct.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(productToSubmit),
          })
        : await fetch(`/api/products`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(productToSubmit),
          });

      if (response.ok) {
        router.push('/admin/pages/products'); // Navigate back to the products list page after adding/updating
      } else {
        const errorData = await response.json();
        console.error('Failed to create/update product:', errorData.message);
      }
    } catch (error) {
      console.error('Error adding/updating item:', error);
    }
    setIsLoading(false);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const colorOptions = [
    { value: 'Red', label: 'Red' },
    { value: 'Blue', label: 'Blue' },
    { value: 'Green', label: 'Green' },
    // Add more colors as needed
  ];

  const sizeOptions = [
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    // Add more sizes as needed
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      <div className="bg-white shadow rounded-lg p-4 relative">
        <Tabs>
          <TabList>
            <Tab>Details</Tab>
            <Tab>Images</Tab>
            <Tab>Rich Text</Tab>
          </TabList>
          <div className='h-[60vh] overflow-y-auto'>
            <TabPanel>
              <h2 className="text-xl mb-4">{newProduct.id ? 'Edit Product' : 'Add New Product'}</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={newProduct.categoryId}
                  onChange={(e) => {
                    const categoryId = e.target.value;
                    setNewProduct({ ...newProduct, categoryId, subcategoryId: '' });
                    setFilteredSubcategories(
                      Array.isArray(subcategories) ? subcategories.filter(subcat => subcat.categoryId === parseInt(categoryId)) : []
                    );
                  }}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {Array.isArray(categories) && categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {filteredSubcategories.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                  <select
                    value={newProduct.subcategoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, subcategoryId: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Subcategory</option>
                    {filteredSubcategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Colors</label>
                <Select
                  isMulti
                  value={newProduct.colors}
                  onChange={(selected) => setNewProduct({ ...newProduct, colors: selected })}
                  options={colorOptions}
                  className="mt-1"
                  classNamePrefix="select"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Sizes</label>
                <Select
                  isMulti
                  value={newProduct.sizes}
                  onChange={(selected) => setNewProduct({ ...newProduct, sizes: selected })}
                  options={sizeOptions}
                  className="mt-1"
                  classNamePrefix="select"
                />
              </div>
            </TabPanel>
            <TabPanel>
              <h2 className="text-xl mb-4">Upload Images</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Images</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  multiple
                />
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">New Images</h3>
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`Product Image ${index}`}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabPanel>
            <TabPanel>
              <h2 className="text-xl mb-4">Rich Text Description</h2>
              <div className="mb-4">
                <ReactQuill
                  value={newProduct.richDescription}
                  onChange={(value) => setNewProduct({ ...newProduct, richDescription: value })}
                  className="h-64"
                />
              </div>
            </TabPanel>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AddProductPage;
