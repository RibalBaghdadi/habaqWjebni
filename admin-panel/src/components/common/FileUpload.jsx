import React, { useState, useRef } from 'react';

const FileUpload = ({ onFileSelect, currentImage, className = '' }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection with image compression
  const handleFile = (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (10MB max for original file)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);

    // Create and compress image
    const img = new Image();
    img.onload = () => {
      // Create canvas for compression
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Calculate new dimensions (max 800x800 while maintaining aspect ratio)
      const maxDimension = 800;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
      }

      // Set canvas size
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 with compression (0.8 quality for JPEG)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      setPreview(compressedDataUrl);
      onFileSelect(compressedDataUrl, file);
      setUploading(false);
    };

    img.onerror = () => {
      alert('Error loading image');
      setUploading(false);
    };

    // Create object URL for the image
    img.src = URL.createObjectURL(file);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Open file dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Remove image
  const removeImage = () => {
    setPreview('');
    onFileSelect('', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Upload Area */}
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragActive 
              ? 'border-[#4A7C59] bg-green-50' 
              : 'border-gray-300 hover:border-[#4A7C59] hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="spinner mb-3"></div>
              <p className="text-gray-600">Processing image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#4A7C59] rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-2xl">📁</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Product Image</h3>
              <p className="text-gray-600 mb-4">
                Drag and drop an image here, or click to browse
              </p>
              <button 
                type="button"
                className="btn-primary"
                onClick={(e) => e.stopPropagation()}
              >
                Choose File
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Supports: JPEG, PNG, GIF, WebP (Max 10MB, auto-compressed to 800px)
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Image Preview */
        <div className="space-y-4">
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              {/* Image Preview */}
              <div className="flex-shrink-0">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                />
              </div>
              
              {/* Image Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 mb-1">Image Preview</h4>
                <p className="text-sm text-gray-500 mb-2">
                  Image ready for upload
                </p>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={openFileDialog}
                    className="btn-secondary text-xs py-1 px-2"
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="btn-danger text-xs py-1 px-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <div className="flex items-center">
              <span className="text-green-600 mr-2">✅</span>
              <p className="text-sm text-green-800">
                Image uploaded successfully! The image will be saved when you submit the form.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;