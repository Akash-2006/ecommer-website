import React from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
  const { user, orders } = useApp();
  
  // Filter orders for the current user
  const userOrders = orders.filter(order => order.userId === user?.id);
  
  // Mock orders data (keeping for fallback/demo)
  const mockOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 129.98,
      items: [
        {
          id: 1,
          name: 'Classic Oxford Button-Down Shirt',
          size: 'M',
          color: 'Blue',
          quantity: 1,
          price: 34.99,
          image: 'https://picsum.photos/100/100?random=39'
        },
        {
          id: 2,
          name: 'Slim-Fit Stretch Shirt',
          size: 'L',
          color: 'Black',
          quantity: 2,
          price: 24.99,
          image: 'https://picsum.photos/100/100?random=41'
        }
      ]
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      status: 'Processing',
      total: 89.97,
      items: [
        {
          id: 3,
          name: 'High-Waist Skinny Jeans',
          size: 'S',
          color: 'Dark Blue',
          quantity: 1,
          price: 45.00,
          image: 'https://picsum.photos/100/100?random=19'
        },
        {
          id: 4,
          name: 'Casual T-Shirt',
          size: 'M',
          color: 'White',
          quantity: 2,
          price: 20.00,
          image: 'https://picsum.photos/100/100?random=31'
        }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your orders.</p>
          <Link 
            to="/login" 
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {/* Use real orders if available, otherwise show mock orders for demo */}
      {(userOrders.length === 0 && mockOrders.length === 0) ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              When you place your first order, it will appear here.
            </p>
            <Link 
              to="/" 
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Display real orders first, then mock orders */}
          {[...userOrders, ...mockOrders].map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Order Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="text-lg font-bold mt-1">${order.total.toFixed(2)}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Items ({order.items.length})</h4>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image || (item.images && item.images[0]?.url) || 'https://picsum.photos/100/100?random=placeholder'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{item.name}</h5>
                        <p className="text-sm text-gray-600">
                          {item.selectedSize && `Size: ${item.selectedSize}`} 
                          {item.size && `Size: ${item.size}`}
                          {(item.selectedColor || item.color) && ` | Color: ${item.selectedColor || item.color}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">${item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Actions */}
              <div className="border-t pt-4 mt-4">
                <div className="flex gap-4">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    View Details
                  </button>
                  {order.status.toLowerCase() === 'delivered' && (
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                      Leave Review
                    </button>
                  )}
                  {order.status.toLowerCase() === 'processing' && (
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
