import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    lowInventory: [],
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        apiClient.get('/api/products'),
        apiClient.get('/api/orders'),
      ]);

      const products = productsRes.data.products || [];
      const orders = ordersRes.data.orders || [];

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: 0, // Would need a users endpoint
        lowInventory: products.filter((p) => p.inventory < 10),
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="min-h-screen bg-light-gray py-12">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-10 text-dark">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-card shadow-card p-8 hover:shadow-card-hover transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-base mb-2">Total Products</p>
                <p className="text-5xl font-bold text-primary">{stats.totalProducts}</p>
              </div>
              <div className="w-16 h-16 bg-primary/10 rounded-button flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <Link to="/admin/products" className="text-primary hover:text-primary-hover text-base font-medium mt-6 inline-flex items-center gap-2 transition-colors duration-300">
              Manage Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-white rounded-card shadow-card p-8 hover:shadow-card-hover transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-base mb-2">Total Orders</p>
                <p className="text-5xl font-bold text-primary">{stats.totalOrders}</p>
              </div>
              <div className="w-16 h-16 bg-primary/10 rounded-button flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <Link to="/admin/orders" className="text-primary hover:text-primary-hover text-base font-medium mt-6 inline-flex items-center gap-2 transition-colors duration-300">
              View Orders
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-white rounded-card shadow-card p-8 hover:shadow-card-hover transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-base mb-2">Low Inventory</p>
                <p className="text-5xl font-bold text-red-600">{stats.lowInventory.length}</p>
              </div>
              <div className="w-16 h-16 bg-red-100 rounded-button flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-base mt-6">Products need restocking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Orders */}
          <div className="bg-white rounded-card shadow-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-dark">Recent Orders</h2>
            {recentOrders.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 border-2 border-light-border rounded-button hover:border-primary transition-all duration-300">
                    <div>
                      <p className="font-bold text-dark text-lg">#{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-dark text-lg">${order.orderTotal.toFixed(2)}</p>
                      <span className={`text-xs px-3 py-1 rounded-button font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Inventory Alert */}
          <div className="bg-white rounded-card shadow-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-dark">Low Inventory Alert</h2>
            {stats.lowInventory.length === 0 ? (
              <p className="text-gray-600 text-center py-8">All products are well stocked</p>
            ) : (
              <div className="space-y-4">
                {stats.lowInventory.slice(0, 5).map((product) => (
                  <div key={product._id} className="flex items-center justify-between p-4 border-2 border-light-border rounded-button hover:border-primary transition-all duration-300">
                    <div>
                      <p className="font-bold text-dark">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600 text-lg">{product.inventory} left</p>
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="text-xs text-primary hover:text-primary-hover font-medium transition-colors duration-300"
                      >
                        Update
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-card shadow-card p-8">
          <h2 className="text-2xl font-bold mb-6 text-dark">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/admin/products/new"
              className="flex items-center gap-4 p-6 border-2 border-primary rounded-button hover:bg-primary hover:text-white transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-button flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                <svg className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-bold text-primary group-hover:text-white transition-colors duration-300">Add New Product</span>
            </Link>

            <Link
              to="/admin/orders"
              className="flex items-center gap-4 p-6 border-2 border-light-border rounded-button hover:border-primary hover:bg-light-gray transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-light-gray rounded-button flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                <svg className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="font-bold text-dark group-hover:text-primary transition-colors duration-300">View All Orders</span>
            </Link>

            <Link
              to="/admin/products"
              className="flex items-center gap-4 p-6 border-2 border-light-border rounded-button hover:border-primary hover:bg-light-gray transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-light-gray rounded-button flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                <svg className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <span className="font-bold text-dark group-hover:text-primary transition-colors duration-300">Manage Products</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
