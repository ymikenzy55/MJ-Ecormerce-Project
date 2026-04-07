import { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/api/orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await apiClient.put(`/api/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
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

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.status === filterStatus)
    : orders;

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="min-h-screen bg-light-gray py-12">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-10 text-dark">Manage Orders</h1>

        {/* Filter */}
        <div className="bg-white rounded-card shadow-card p-6 mb-8">
          <label className="block text-base font-medium text-dark mb-3">
            Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-80 px-4 py-3 border-2 border-light-border rounded-button focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-white text-dark"
          >
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light-gray border-b-2 border-light-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-dark uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-dark uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-dark uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-dark uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-dark uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-dark uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-light-border">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-light-gray transition-colors duration-200">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-base font-bold text-dark">
                        #{order.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-base font-medium text-dark">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.guestEmail || 'Registered User'}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-base text-dark">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-base font-bold text-dark">
                        ${order.orderTotal.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className={`text-sm px-3 py-2 rounded-button font-bold border-2 cursor-pointer transition-all duration-300 ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-base font-medium">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-primary hover:text-primary-hover transition-colors duration-300"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-600 text-lg">No orders found</p>
          </div>
        )}

        {/* Order Details Modal */}
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder?.orderNumber}`}
          size="lg"
        >
          {selectedOrder && (
            <div className="space-y-6">
              <div className="p-6 bg-light-gray rounded-button">
                <h3 className="font-bold text-dark mb-4 text-lg">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-base pb-3 border-b border-light-border last:border-0">
                      <span className="text-gray-700">
                        <span className="font-medium text-dark">{item.productName}</span> × {item.quantity}
                      </span>
                      <span className="font-bold text-dark">${item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t-2 border-light-border mt-4 pt-4 flex justify-between">
                  <span className="text-lg font-bold text-dark">Total</span>
                  <span className="text-xl font-bold text-primary">${selectedOrder.orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-6 bg-light-gray rounded-button">
                <h3 className="font-bold text-dark mb-3 text-lg">Shipping Address</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}<br />
                  {selectedOrder.shippingAddress.address}<br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}<br />
                  {selectedOrder.shippingAddress.country}<br />
                  <span className="font-medium">Phone:</span> {selectedOrder.shippingAddress.phone}
                </p>
              </div>

              <div className="p-6 bg-light-gray rounded-button">
                <h3 className="font-bold text-dark mb-3 text-lg">Payment Information</h3>
                <p className="text-base text-gray-700">
                  <span className="font-medium">Method:</span> {selectedOrder.paymentInfo.method === 'credit_card' ? 'Credit Card' : 'Debit Card'}<br />
                  <span className="font-medium">Status:</span> {selectedOrder.paymentInfo.status}
                </p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminOrderList;
