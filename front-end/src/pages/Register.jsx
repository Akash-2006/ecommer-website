import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { toast } from 'sonner'
import register from '../assets/register.webp';

export const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { registerUser } = useApp()
  const navigate = useNavigate()
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!name.trim()) {
      newErrors.name = 'Name is required'
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await registerUser({ 
        name: name.trim(), 
        email, 
        password 
      });
      
      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/profile');
      } else {
        toast.error(result.error || 'Registration failed');
        setErrors({ email: result.error || 'Registration failed' });
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      setErrors({ email: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
      <form 
      onSubmit={handleFormSubmit}
      className="w-full max-2-md bg-white p-8 rounded-lg border shadow-sm">
        <div className="flex justify-center mb-6">
        <h2 className="text-2xl font-medium">Rabbit</h2>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">
          Hey there! 👋🏻
        </h2>
        <p className="text-center mb-6">
          Enter your username and password to access your account.
        </p>
        <div className="mb-4">
          <label className='block text-sm font-semibold mb-2'>Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder='Enter your Name' 
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label className='block text-sm font-semibold mb-2'>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder='Enter your email' 
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className='block text-sm font-semibold mb-2'>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder='Enter your password' 
          />  
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <div className="mb-6">
          <label className='block text-sm font-semibold mb-2'>Confirm Password</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            className={`w-full p-2 border rounded ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            placeholder='Confirm your password' 
          />  
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
        <button 
          type='submit' 
          disabled={isLoading}
          className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed'
        >
          {isLoading ? 'Creating Account...' : 'Sign up'}
        </button>
          <p className="mt-6 text-center text-sm">
            Already have an account?
            <Link to="/login" className="text-blue-500 1">Login</Link>
          </p>
      </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
      <div className="h-full flex flex-col justify-center items-center">
        <img src={register} alt="Login to Account" className='h-[750px] w-full object-cover' />
      </div>
      </div>
    </div>
  )
}
