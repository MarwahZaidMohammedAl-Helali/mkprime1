import React, { useState, useRef } from 'react';
import '../components/ImageUploader.css';

function ImageUploader({ currentImage, onImageChange, onImageDelete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage ? `${process.env.PUBLIC_URL}/${currentImage}` : null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append('image', file);

      const apiUrl = process.env.NODE_ENV === 'production'
        ? '/api/upload-image.php'
        : 'http://localhost:5001/api/upload-image';

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        onImageChange(data.filename);
      } else {
        alert('Failed to upload image: ' + data.message);
        setPreview(currentImage ? `${process.env.PUBLIC_URL}/${currentImage}` : null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      setPreview(currentImage ? `${process.env.PUBLIC_URL}/${currentImage}` : null);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentImage) return;
    
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? '/api/delete-image.php'
        : 'http://localhost:5001/api/delete-image';

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename: currentImage })
      });

      const data = await response.json();

      if (data.success) {
        setPreview(null);
        onImageDelete();
      } else {
        alert('Failed to delete image: ' + data.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {preview ? (
        <div className="image-preview-container">
          <img src={preview} alt="Preview" className="image-preview" />
          <div className="image-actions">
            <button
              type="button"
              className="change-image-btn"
              onClick={handleClick}
              disabled={uploading}
            >
              {uploading ? '⏳ Uploading...' : '🔄 Change Image'}
            </button>
            <button
              type="button"
              className="delete-image-btn"
              onClick={handleDelete}
              disabled={uploading}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {uploading ? (
            <div className="upload-status">
              <div className="spinner"></div>
              <p>Uploading...</p>
            </div>
          ) : (
            <>
              <div className="upload-icon">📤</div>
              <p className="upload-text">
                <strong>Click to upload</strong> or drag and drop
              </p>
              <p className="upload-hint">PNG, JPG, GIF up to 5MB</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
