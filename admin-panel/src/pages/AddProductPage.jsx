import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import FileUpload from '../components/common/FileUpload';

const AddProductPage = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: ''
  });

  // Other states
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        setCategories(response || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle file upload
  const handleFileSelect = (imageDataUrl, file) => {
    setFormData(prev => ({
      ...prev,
      image: imageDataUrl
    }));
    setSelectedImageFile(file);
    
    // Clear image error
    if (errors.image) {
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Product image is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      await productsAPI.create(productData);
      
      // Success feedback
      alert('Product created successfully!');
      
      // Navigate back to products page
      navigate('/products');
      
    } catch (error) {
      console.error('Error creating product:', error);
      
      // Handle specific errors
      if (error.message) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Failed to create product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      image: '',
      category: ''
    });
    setErrors({});
    setSelectedImageFile(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <Link 
            to="/products" 
            className="text-[#4A7C59] hover:text-[#3d6347] transition-colors"
          >
            ← Back to Products
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-[#4A7C59]">إضافة منتج جديد</h1>
        <p className="text-gray-600">Add New Product</p>
      </div>

      {/* Add Product Form */}
      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Price and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              className={`input-field ${errors.price ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`input-field ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}`}
              disabled={categoriesLoading}
            >
              <option value="">
                {categoriesLoading ? 'Loading categories...' : 'Select a category'}
              </option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
            {categories.length === 0 && !categoriesLoading && (
              <p className="mt-1 text-sm text-yellow-600">
                No categories available. <Link to="/categories" className="text-[#4A7C59] underline">Create a category first</Link>.
              </p>
            )}
          </div>
        </div>

        {/* Product Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image *
          </label>
          <FileUpload
            onFileSelect={handleFileSelect}
            currentImage={formData.image}
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className={`input-field ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter product description (minimum 10 characters)"
          />
          <div className="flex justify-between mt-1">
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
            <p className="text-sm text-gray-500 ml-auto">
              {formData.description.length} characters
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary order-2 sm:order-1"
            disabled={loading}
          >
            Reset Form
          </button>
          
          <div className="flex gap-3 order-1 sm:order-2">
            <Link 
              to="/products" 
              className="btn-secondary flex-1 text-center"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading || categoriesLoading || categories.length === 0}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner w-4 h-4 mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
          <p className="font-medium mb-1">Tips for adding products:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>Upload high-quality images for better presentation</li>
            <li>Write clear, detailed descriptions</li>
            <li>Double-check the price before submitting</li>
            <li>Choose the most appropriate category</li>
            <li>Images are stored as base64 data (no external hosting needed)</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;