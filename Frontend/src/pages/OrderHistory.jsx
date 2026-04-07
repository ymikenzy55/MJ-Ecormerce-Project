import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get(`/api/orders/user/${user._id}`);
      setOrders(response.data.orders || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center py-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-white rounded-full flex items-center justify-center shadow-card">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-dark">No Orders Yet</h1>
            <p className="text-gray-600 text-lg mb-8">
              You haven't placed any orders yet.
            </p>
            <Link to="/products">
              <Button className="text-lg px-10 py-4">
                Start Shopping
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray py-12">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-10 text-dark">Order History</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-card shadow-card p-8 hover:shadow-card-hover transition-shadow duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-dark mb-2">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-base text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <span className={`inline-block px-4 py-2 rounded-button text-sm font-bold border-2 ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="border-t border-light-border pt-6">
                <div className="space-y-3 mb-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-base">
                      <span className="text-gray-700">
                        <span className="font-medium text-dark">{item.productName}</span> × {item.quantity}
                      </span>
                      <span className="font-bold text-dark">
                        ${item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-light-border pt-4 flex justify-between items-center">
                  <span className="text-xl font-bold text-dark">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${order.orderTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                  className="mt-6 text-primary hover:text-primary-hover font-medium transition-colors duration-300 flex items-center gap-2"
                >
                  {selectedOrder === order._id ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      Hide Details
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      View Details
                    </>
                  )}
                </button>

                {selectedOrder === order._id && (
                  <div className="mt-6 pt-6 border-t border-light-border space-y-6">
                    <div className="p-6 bg-light-gray rounded-button">
                      <h4 className="font-bold text-dark mb-3 text-lg">Shipping Address</h4>
                      <p className="text-base text-gray-700 leading-relaxed">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                        {order.shippingAddress.country}<br />
                        <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
                      </p>
                    </div>

                    <div className="p-6 bg-light-gray rounded-button">
                      <h4 className="font-bold text-dark mb-3 text-lg">Payment Method</h4>
                      <p className="text-base text-gray-700">
                        {order.paymentInfo.method === 'credit_card' ? 'Credit Card' : 'Debit Card'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
