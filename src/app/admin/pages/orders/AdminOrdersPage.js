'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOrdersPage = ({ data, fetchData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put('/api/orders', {
        id: orderId,
        status: newStatus,
      });
      fetchData(); // Refresh the orders list
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Order Data:', data); // Debugging: Log the order data
  }, [data]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Orders</h1>
      {loading && <div className="text-center text-blue-500">Updating status...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      <div className="space-y-8">
        {data.map((order) => (
          <div key={order.id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Order #{order.id} Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-gray-700">General</h3>
                <div className="mt-4 space-y-2 text-gray-600">
                  <div>Date created: {new Date(order.createdAt).toLocaleString()}</div>
                  <div>
                    Status:
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="ml-2 border p-2 rounded-md bg-gray-50"
                      disabled={loading}
                    >
                      <option value="PENDING">Pending payment</option>
                      <option value="PAID">Paid</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  <div>Customer: {order.userId}</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-700">Shipping Address</h3>
                <div className="mt-4 space-y-2 text-gray-600">
                  <div>Address: {order.streetAddress}, {order.apartmentSuite}, {order.city}, {order.state}, {order.zip}, {order.country}</div>
                  <div>Email address: {order.email}</div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-lg text-center py-2 font-bold text-gray-700">Items</h3>
              <div className="mt-4">
                <div className="grid grid-cols-5 gap-2 p-2 bg-gray-200 rounded-t-lg">
                  <div className="font-bold">ID</div>
                  <div className="font-bold">Image</div>
                  <div className="font-bold">Name</div>
                  <div className="font-bold">Quantity</div>
                  <div className="font-bold">Price</div>
                </div>
                {order.orderItems.map(item => (
                  <div key={item.id} className="grid grid-cols-5 gap-2 border-b p-4 bg-white hover:bg-gray-100 transition duration-200">
                    <div className="my-auto">{item.id}</div>
                    <div className="my-auto">
                      {item.product && item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={`https://appstore.store2u.ca/uploads/${item.product.images[0].url}`}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      ) : (
                        <img
                          src="https://appstore.store2u.ca/uploads/placeholder.jpg"
                          alt="Placeholder"
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      )}
                    </div>
                    <div className="my-auto">{item.product ? item.product.name : 'Unknown Product'}</div>
                    <div className="my-auto">{item.quantity}</div>
                    <div className="my-auto">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
