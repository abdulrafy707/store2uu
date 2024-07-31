'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOrdersPage = ({ data, fetchData }) => {
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put('/api/orders', {
        id: orderId,
        status: newStatus,
      });
      fetchData(); // Refresh the orders list
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  useEffect(() => {
    console.log('Order Data:', data); // Debugging: Log the order data
  }, [data]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Admin Orders</h1>
      <div className="space-y-6">
        {data.map((order) => (
          <div key={order.id} className="bg-white shadow rounded-lg p-4 border border-gray-600">
            <h2 className="text-xl font-semibold mb-4">Order #{order.id} Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium">General</h3>
                <div className="mt-2">
                  <div>Date created: {new Date(order.createdAt).toLocaleString()}</div>
                  <div>
                    Status:
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="ml-2 border p-2 rounded-md"
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
              <div className="border">
                <h3 className="text-lg font-medium">Shipping Address</h3>
                <div className="mt-2">
                  <div>Address: {order.streetAddress}, {order.apartmentSuite}, {order.city}, {order.state}, {order.zip}, {order.country}</div>
                  <div>Email address: {order.email}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 border border-gray-600">
              <h3 className="text-lg font-medium">Items</h3>
              <div className="mt-2">
                <div className="grid grid-cols-4 gap-2">
                  <div className="font-bold">Image</div>
                  <div className="font-bold">Name</div>
                  <div className="font-bold">Quantity</div>
                  <div className="font-bold">Price</div>
                </div>
                {order.orderItems.map(item => (
                  <div key={item.id} className="grid grid-cols-4 gap-2 border-b py-2">
                    <div>
                      {item.product ? (
                        <img
                          src={`https://appstore.store2u.ca/uploads/${item.product.imageUrl || 'placeholder.jpg'}`}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <img
                          src="https://appstore.store2u.ca/uploads/placeholder.jpg"
                          alt="Placeholder"
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </div>
                    <div>{item.product ? item.product.name : 'Unknown Product'}</div>
                    <div>{item.quantity}</div>
                    <div>{item.price}</div>
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
