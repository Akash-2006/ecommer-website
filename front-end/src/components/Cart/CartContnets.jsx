import React from 'react'
import {RiDeleteBin3Line} from 'react-icons/ri'
import { useApp } from '../../context/AppContext'

const CartContnets = () => {
  const { cart, updateCartQuantity, removeFromCart } = useApp();
  
  return (
    <div>
      {cart.map((item)=>(
      <div className="flex items-start justify-between py-4 border-b" key={item.id}>
        <div className="flex items-start">
          <img src={item.image} alt={item.name} className='w-20 h-24 object-cover mr-4 rounded'/>
          <div className="">
            <h3 className="font-medium">{item.name}</h3>
            <div className="text-sm text-gray-500 space-y-1">
              {item.selectedSize && <p>Size: {item.selectedSize}</p>}
              {item.selectedColor && <p>Color: {item.selectedColor}</p>}
            </div>
            <div className="flex items-center mt-2">
              <button 
                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                className="border rounded px-2 py-1 text-xl font-medium hover:bg-gray-100"
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="mx-4 min-w-[2rem] text-center">{item.quantity}</span>
              <button 
                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                className="border rounded px-2 py-1 text-xl font-medium hover:bg-gray-100"
                disabled={item.quantity >= item.maxStock}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="text-right">
            <p className='font-medium'>${(item.price * item.quantity).toFixed(2)}</p>
            <p className='text-xs text-gray-500'>${item.price} each</p>
            <button
              onClick={() => removeFromCart(item.id)}
              className="mt-2 hover:bg-red-50 p-1 rounded"
            >
              <RiDeleteBin3Line className="h-5 w-5 text-red-600"/>
            </button>
        </div>
      </div>
      ))}
    </div>
  )
}

export default CartContnets