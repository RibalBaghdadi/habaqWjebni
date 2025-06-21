import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, admin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items with improved organization
  const navItems = [
    {
      name: 'Dashboard',
      nameAr: 'الرئيسية',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      primary: true
    },
    {
      name: 'Products',
      nameAr: 'المنتجات',
      path: '/products',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      name: 'Add Product',
      nameAr: 'إضافة منتج',
      path: '/products/add',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      accent: true
    },
    {
      name: 'Categories',
      nameAr: 'الفئات',
      path: '/categories',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    }
  ];

  // Handle logout with confirmation
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  // Check if link is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <nav className={`bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-lg shadow-gray-200/20' : 'shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="group flex items-center space-x-3 rtl:space-x-reverse">
              <div className="relative w-11 h-11 bg-gradient-to-br from-[#4A7C59] via-[#5A8B67] to-[#6B8E5A] rounded-xl flex items-center justify-center shadow-lg shadow-[#4A7C59]/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#4A7C59]/30 group-hover:scale-105">
                <svg className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#4A7C59] to-[#6B8E5A] bg-clip-text text-transparent leading-tight">
                  وحبق وجبنة
                </h1>
                <p className="text-xs text-gray-500 -mt-1 font-medium">Admin Dashboard</p>
              </div>
            </Link>
          </div>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActiveLink(item.path)
                    ? item.accent
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                      : 'bg-gradient-to-r from-[#4A7C59] to-[#6B8E5A] text-white shadow-lg shadow-[#4A7C59]/25'
                    : 'text-gray-600 hover:text-[#4A7C59] hover:bg-gray-50/80 hover:shadow-md hover:shadow-gray-200/50'
                }`}
              >
                <div className={`transition-transform duration-300 ${isActiveLink(item.path) ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                <span className="hidden xl:block transition-all duration-300">{item.name}</span>
                <span className="xl:hidden transition-all duration-300">{item.nameAr}</span>
                
                {/* Active indicator */}
                {isActiveLink(item.path) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Enhanced Right Side - User Menu */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Enhanced Admin Info */}
            <div className="hidden md:flex items-center space-x-3 rtl:space-x-reverse group">
              <div className="text-right rtl:text-left">
                <p className="text-sm font-semibold text-gray-900">Admin</p>
                <p className="text-xs text-gray-500 font-mono">#{admin?.id?.slice(-6) || '000000'}</p>
              </div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-[#D4A574] via-[#c49660] to-[#b8864d] rounded-full flex items-center justify-center shadow-lg shadow-[#D4A574]/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#D4A574]/30 group-hover:scale-105">
                <svg className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Enhanced Logout Button */}
            <button
              onClick={handleLogout}
              className="group relative flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35 hover:scale-105"
              title="Logout"
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Enhanced Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2.5 rounded-xl text-gray-600 hover:text-[#4A7C59] hover:bg-gray-50/80 transition-all duration-300 hover:shadow-md hover:shadow-gray-200/50"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6 transition-transform duration-300`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6 transition-transform duration-300 rotate-180`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mobile-menu-container">
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-xl shadow-gray-200/20 animate-in slide-in-from-top-2 duration-300">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center space-x-3 rtl:space-x-reverse px-4 py-4 rounded-xl text-base font-medium transition-all duration-300 hover:scale-[1.02] ${
                    isActiveLink(item.path)
                      ? item.accent
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-gradient-to-r from-[#4A7C59] to-[#6B8E5A] text-white shadow-lg shadow-[#4A7C59]/25'
                      : 'text-gray-600 hover:text-[#4A7C59] hover:bg-gray-50/80 hover:shadow-md hover:shadow-gray-200/50'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`transition-transform duration-300 ${isActiveLink(item.path) ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <span className="block font-semibold">{item.nameAr}</span>
                    <span className="block text-sm opacity-75 font-normal">{item.name}</span>
                  </div>
                  {isActiveLink(item.path) && (
                    <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                  )}
                </Link>
              ))}
              
              {/* Enhanced Mobile admin info */}
              <div className="px-4 py-4 border-t border-gray-200/50 mt-4 bg-gradient-to-r from-gray-50/50 to-gray-100/50 rounded-xl">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4A574] via-[#c49660] to-[#b8864d] rounded-full flex items-center justify-center shadow-lg shadow-[#D4A574]/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-gray-900">Admin Panel</p>
                    <p className="text-sm text-gray-500 font-mono">ID: #{admin?.id?.slice(-6) || '000000'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;