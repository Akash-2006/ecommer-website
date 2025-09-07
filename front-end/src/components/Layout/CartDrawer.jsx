import React from 'react'
import {IoMdClose} from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import CartContnets from '../Cart/CartContnets'
import { useApp } from '../../context/AppContext'

export const CartDrawer = ({drawerOpen, toggleCarterDrawer}) => {
  const { cart, getCartTotal, user, createOrder } = useApp();
  const cartTotal = getCartTotal();
  const navigate = useNavigate();
  
  const handleCheckout = async () => {
    // Check if user is logged in
    if (!user) {
      toast.info('Please log in to complete your purchase');
      toggleCarterDrawer(); // Close cart drawer
      navigate('/login?redirect=' + encodeURIComponent('/orders'));
      return;
    }
    
    // Check if cart is empty
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    try {
      // Create the order
      const result = await createOrder();
      
      if (result.success) {
        toast.success(`Order ${result.order.id} placed successfully!`);
        toggleCarterDrawer(); // Close cart drawer
        navigate('/orders'); // Redirect to orders page
      } else {
        toast.error(result.error || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Checkout error:', error);
    }
  };
  
  return (
    <div className={`fixed top-0 right-0 w-3/4 sm:1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
      drawerOpen ? "translate-x-0":"translate-x-full"
    }`}>
      <div className="flex justify-end p-4">
        <button onClick={toggleCarterDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-600"/>
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your cart ({cart.length})</h2>
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <button 
              onClick={toggleCarterDrawer}
              className="text-black underline hover:no-underline"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <CartContnets/>
        )}
      </div>
      {cart.length > 0 && (
        <div className="p-4 bg-white border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              cart.length === 0 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {cart.length === 0 
              ? 'Cart is Empty' 
              : user 
                ? 'Checkout' 
                : 'Login to Checkout'
            }
          </button>
          <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
            Shipping, taxes, and discount codes calculated at Checkout.
          </p>
        </div>
      )}
    </div>
  )
}
