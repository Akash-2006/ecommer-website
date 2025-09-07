import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { toast } from 'sonner'
import login from '../assets/login.webp';

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { loginUser } = useApp()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/profile'
  
  const validateForm = () => {
    const newErrors = {}
    
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
      const result = await loginUser({ email, password });
      
      if (result.success) {
        toast.success('Successfully logged in!');
        navigate(redirectTo);
      } else {
        toast.error(result.error || 'Login failed');
        setErrors({ email: result.error || 'Login failed' });
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      setErrors({ email: 'Login failed. Please try again.' });
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
          <button 
            type='submit' 
            disabled={isLoading}
            className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          <p className="mt-6 text-center text-sm">
            Don't have an account?
            <Link to="/register" className="text-blue-500 1">Register</Link>
          </p>
      </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
      <div className="h-full flex flex-col justify-center items-center">
        <img src={login} alt="Login to Account" className='h-[750px] w-full object-cover' />
      </div>
      </div>
    </div>
  )
}
