import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    loading: true
  });

  const [recentProducts, setRecentProducts] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          productsAPI.getAll(),
          categoriesAPI.getAll()
        ]);

        setStats({
          totalProducts: productsResponse.length || 0,
          totalCategories: categoriesResponse.length || 0,
          loading: false
        });

        const sortedProducts = productsResponse
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        
        setRecentProducts(sortedProducts);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-8 py-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مرحباً بك في لوحة التحكم
          </h1>
          <p className="text-gray-600">Welcome to Admin Dashboard</p>
        </div>

        {/* Stats Grid - Full Width Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Total Products */}
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.loading ? '...' : stats.totalProducts}
                </p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Categories */}
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Categories</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.loading ? '...' : stats.totalCategories}
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">System Status</p>
                <p className="text-3xl font-bold text-green-600">Online</p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Performance</p>
                <p className="text-3xl font-bold text-blue-600">Good</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Full Width Distribution */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <Link
              to="/products/add"
              className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-center"
            >
              <div className="w-20 h-20 bg-[#4A7C59] rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">إضافة منتج جديد</h3>
              <p className="text-gray-600">Add New Product</p>
            </Link>

            <Link
              to="/products"
              className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-center"
            >
              <div className="w-20 h-20 bg-[#6B8E5A] rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">عرض المنتجات</h3>
              <p className="text-gray-600">View Products</p>
            </Link>

            <Link
              to="/categories"
              className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-center"
            >
              <div className="w-20 h-20 bg-[#D4A574] rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">إدارة الفئات</h3>
              <p className="text-gray-600">Manage Categories</p>
            </Link>
          </div>
        </div>

        {/* Recent Products - Full Width */}
        {recentProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Recent Products</h2>
                <Link 
                  to="/products" 
                  className="text-[#4A7C59] hover:text-[#3d6347] font-medium"
                >
                  View All →
                </Link>
              </div>
            </div>
            
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 font-semibold text-gray-700">Product</th>
                      <th className="text-left py-4 font-semibold text-gray-700">Category</th>
                      <th className="text-left py-4 font-semibold text-gray-700">Price</th>
                      <th className="text-left py-4 font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProducts.map((product) => (
                      <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div 
                                className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400"
                                style={{ display: product.image ? 'none' : 'flex' }}
                              >
                                📦
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-lg">{product.name}</p>
                              <p className="text-gray-500 truncate max-w-md">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#6B8E5A] text-white">
                            {product.category?.name || 'No Category'}
                          </span>
                        </td>
                        <td className="py-6 font-bold text-gray-900 text-lg">
                          ${product.price}
                        </td>
                        <td className="py-6 text-gray-500">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty State for No Products */}
        {!stats.loading && recentProducts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Products Yet</h3>
            <p className="text-gray-600 mb-8 text-lg">Start by adding your first product to see it here</p>
            <Link
              to="/products/add"
              className="inline-flex items-center px-8 py-4 bg-[#4A7C59] hover:bg-[#3d6347] text-white font-semibold rounded-lg transition-colors text-lg"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your First Product
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;