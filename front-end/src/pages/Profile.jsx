import React from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import MyOrdersPage from './MyOrdersPage'

const Profile = () => {
  const { user, logout, getCartItemCount } = useApp();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out!');
    navigate('/');
  };
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access your profile.</p>
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
    <div className='min-h-screen flex flex-col'>
      <div className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="text-center mb-6">
                <img 
                  src={user.avatar || 'https://picsum.photos/100/100?random=user'} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.name || 'User'}
                </h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
              
              <div className="space-y-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Cart Items</p>
                  <p className="text-2xl font-bold text-gray-900">{getCartItemCount()}</p>
                </div>
                
                <div className="space-y-2">
                  <Link 
                    to="/orders" 
                    className="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition"
                  >
                    My Orders
                  </Link>
                  <Link 
                    to="/profile/settings" 
                    className="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition"
                  >
                    Settings
                  </Link>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className='w-full bg-red-500 text-white py-3 px-4 rounded hover:bg-red-600 transition'
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
              <MyOrdersPage/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile