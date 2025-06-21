import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../services/api';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [deletingCategory, setDeletingCategory] = useState(null);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Category name must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 5) {
      errors.description = 'Description must be at least 5 characters';
    }

    // Check for duplicate names (excluding current editing category)
    const duplicateName = categories.find(cat => 
      cat.name.toLowerCase() === formData.name.toLowerCase() && 
      cat._id !== editingCategory?._id
    );
    if (duplicateName) {
      errors.name = 'Category name already exists';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      if (editingCategory) {
        // Update existing category
        const updatedCategory = await categoriesAPI.update(editingCategory._id, formData);
        setCategories(prev => 
          prev.map(cat => cat._id === editingCategory._id ? updatedCategory : cat)
        );
      } else {
        // Create new category
        const newCategory = await categoriesAPI.create(formData);
        setCategories(prev => [...prev, newCategory]);
      }

      // Reset form
      setFormData({ name: '', description: '' });
      setShowAddForm(false);
      setEditingCategory(null);
      
    } catch (error) {
      console.error('Error saving category:', error);
      setFormErrors({ 
        submit: error.message || 'Failed to save category' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setShowAddForm(true);
    setFormErrors({});
  };

  // Handle delete
  const handleDelete = async (categoryId) => {
    try {
      await categoriesAPI.delete(categoryId);
      setCategories(prev => prev.filter(cat => cat._id !== categoryId));
      setDeletingCategory(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  // Cancel form
  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setShowAddForm(false);
    setEditingCategory(null);
    setFormErrors({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchCategories} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#4A7C59]">إدارة الفئات</h1>
          <p className="text-gray-600">Manage Categories ({categories.length} total)</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary mt-4 sm:mt-0"
          disabled={showAddForm}
        >
          ➕ Add New Category
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`input-field ${formErrors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter category name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`input-field ${formErrors.description ? 'border-red-500' : ''}`}
                  placeholder="Enter category description"
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                )}
              </div>
            </div>

            {/* Submit Error */}
            {formErrors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">{formErrors.submit}</p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex items-center">
                    <div className="spinner w-4 h-4 mr-2"></div>
                    {editingCategory ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  editingCategory ? 'Update Category' : 'Create Category'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500 mb-4">Create your first category to organize products.</p>
          <button onClick={() => setShowAddForm(true)} className="btn-primary">
            Add Your First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <div key={category._id} className="card hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                {/* Category Icon */}
                <div className="w-12 h-12 bg-[#6B8E5A] rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl">📋</span>
                </div>

                {/* Category Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => setDeletingCategory(category)}
                    className="flex-1 btn-danger text-sm py-2"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Category</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{deletingCategory.name}"? This action cannot be undone.
                </p>
              </div>
              <div className="flex space-x-3 px-4 py-3">
                <button
                  onClick={() => setDeletingCategory(null)}
                  className="w-full btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deletingCategory._id)}
                  className="w-full btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;