// Authentication utility functions

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  if (!token) return false;

  try {
    // Decode JWT token to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
      // Token expired
      localStorage.removeItem('adminToken');
      return false;
    }
    
    return true;
  } catch (error) {
    // Invalid token
    localStorage.removeItem('adminToken');
    return false;
  }
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('adminToken');
};

// Set token in localStorage
export const setToken = (token) => {
  localStorage.setItem('adminToken', token);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('adminToken');
};

// Get admin info from token
export const getAdminInfo = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      exp: payload.exp,
      iat: payload.iat
    };
  } catch (error) {
    return null;
  }
};

// Check if token will expire soon (within 5 minutes)
export const willTokenExpireSoon = () => {
  const token = getToken();
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const fiveMinutesFromNow = currentTime + (5 * 60); // 5 minutes in seconds
    
    return payload.exp < fiveMinutesFromNow;
  } catch (error) {
    return true;
  }
};

// Format error messages for display
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.error) {
    return error.error;
  }
  
  return 'An unexpected error occurred';
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Logout user and redirect
export const logoutUser = () => {
  removeToken();
  window.location.href = '/login';
};

// Auto logout when token expires
export const setupAutoLogout = () => {
  const token = getToken();
  if (!token) return;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = (payload.exp - currentTime) * 1000; // Convert to milliseconds

    if (timeUntilExpiry > 0) {
      setTimeout(() => {
        alert('Your session has expired. Please login again.');
        logoutUser();
      }, timeUntilExpiry);
    }
  } catch (error) {
    console.error('Error setting up auto logout:', error);
  }
};