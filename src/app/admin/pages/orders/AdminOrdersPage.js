'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';

const AdminOrdersPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [taxRate, setTaxRate] = useState(0.1); // Assuming a default tax rate of 10%
  const [shippingHandling, setShippingHandling] = useState(100); // Assuming a fixed shipping/handling charge
  const [discount, setDiscount] = useState(0); // Assuming no discount initially
  const [otherCharges, setOtherCharges] = useState(0); // Assuming no other charges initially
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${id}`);
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to fetch order details');
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleStatusChange = async (orderId, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/orders/${orderId}`, {
        id: orderId,
        status: newStatus,
      });
      if (response.status === 200) {
        setOrder((prevOrder) => ({ ...prevOrder, status: newStatus }));
      } else {
        setError('Failed to update status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const subtotal = order.orderItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const subtotalLessDiscount = subtotal - discount;
  const totalTax = subtotalLessDiscount * taxRate;
  const total = subtotalLessDiscount + totalTax + shippingHandling + otherCharges;

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Order Details</h1>
      <div className="space-y-8">
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold">Supplier Details</h2>
              <p><strong>ATTN: Usman Sultan</strong></p>
              <p>Mir Muhmad Baloch Mrkeet</p>
              <p>Gasur St, Bolton KiranMarket Market Quarter, Karachi</p>
              <p>(0092) 330 2962200</p>
              <p>usmansultan225@gmail.com</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Ship / Bill To</h2>
              <p><strong>ATTN: Tahir Sajjad</strong></p>
              <p>Store2U</p>
              <p>15C 12street, Garden Town</p>
              <p>Gojra, Punjab, Pakistan</p>
              <p>0092-3310356111</p>
            </div>
          </div>
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
                    <option value="PENDING">Pending</option>
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HS Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Picture</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QTY</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.orderItems.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.product ? item.product.name : 'Unknown Product'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.product && item.product.images && item.product.images.length > 0 ? (
                            <img
                              src={`https://appstore.store2u.ca/uploads/${item.product.images[0].url}`}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          ) : (
                            <img
                              src="https://appstore.store2u.ca/uploads/placeholder.jpg"
                              alt="Placeholder"
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity * item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Remarks / Instructions:</label>
                <textarea id="remarks" name="remarks" rows="4" className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"></textarea>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <p className="text-md font-medium text-gray-700">Subtotal:</p>
                  <p className="text-md text-gray-700">{subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-md font-medium text-gray-700">Discount:</p>
                  <p className="text-md text-gray-700">{discount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-md font-medium text-gray-700">Subtotal less Discount:</p>
                  <p className="text-md text-gray-700">{subtotalLessDiscount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-md font-medium text-gray-700">Tax Rate:</p>
                  <p className="text-md text-gray-700">{(taxRate * 100).toFixed(2)}%</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-md font-medium text-gray-700">Total Tax:</p>
                  <p className="text-md text-gray-700">{totalTax.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-md font-medium text-gray-700">Shipping/Handling:</p>
                  <p className="text-md text-gray-700">{shippingHandling.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-md font-medium text-gray-700">Other:</p>
                  <p className="text-md text-gray-700">{otherCharges.toFixed(2)}</p>
                </div>
                <div className="flex justify-between mt-4">
                  <p className="text-lg font-bold text-gray-700">Total:</p>
                  <p className="text-lg font-bold text-gray-700">{total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
