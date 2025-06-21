import React, { useState } from 'react';
import { productsAPI } from '../../services/api';

const ProductCard = ({ product, onUpdate, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Handle delete product
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await productsAPI.delete(product._id);
      onDelete(product._id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit product (placeholder - will navigate to edit page)
  const handleEdit = () => {
    onUpdate(product);
  };

  return (
    <>
      <div className="card hover:shadow-lg transition-shadow duration-200">
        {/* Product Image */}
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-[#4A7C59]">
              ${product.price}
            </span>
            {/* Category Badge */}
            {product.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#6B8E5A] text-white">
                {product.category.name}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-3">
            {product.description}
          </p>

          {/* Timestamps */}
          <div className="text-xs text-gray-400 space-y-1">
            <p>Created: {new Date(product.createdAt).toLocaleDateString()}</p>
            {product.updatedAt && product.updatedAt !== product.createdAt && (
              <p>Updated: {new Date(product.updatedAt).toLocaleDateString()}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            {/* Edit Button */}
            <button
              onClick={handleEdit}
              className="flex-1 btn-secondary text-sm py-2"
              title="Edit Product"
            >
              <span className="flex items-center justify-center">
                ✏️ <span className="ml-1">Edit</span>
              </span>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 btn-danger text-sm py-2"
              title="Delete Product"
              disabled={isDeleting}
            >
              <span className="flex items-center justify-center">
                {isDeleting ? (
                  <>
                    <div className="spinner w-4 h-4 mr-1"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    🗑️ <span className="ml-1">Delete</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Delete Product
              </h3>

              {/* Message */}
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{product.name}"? This action cannot be undone.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 px-4 py-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 btn-secondary"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 btn-danger"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner w-4 h-4 mr-2"></div>
                      Deleting...
                    </div>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;