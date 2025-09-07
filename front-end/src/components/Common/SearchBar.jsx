import React from 'react'
import { useState } from 'react'
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';
import { useApp } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen,setIsOpen]= useState(false)
  const { setSearchQuery } = useApp();
  const navigate = useNavigate();
  
  const handleSearchToggle =()=>{
    setIsOpen(!isOpen)
  }
  
  const handleSubmit = (e)=>{
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchQuery(searchTerm.trim());
      navigate('/search');
      setSearchTerm('');
      handleSearchToggle();
    }
  }
  return (
    <div className={`flex items-center justify-center w-full transition-all duration-300 ${isOpen? "absolute top-0 left-0 w-full bg-white h-24 z-50" :"w-auto"}`}>
     {isOpen?(
        <form className='relative flex items-center justify-center w-full' onSubmit={handleSubmit}>
          <div className='relative w-1/2'>
          <input type="text" placeholder='search' value={searchTerm} 
          onChange={(e)=>setSearchTerm(e.target.value)}
          className='bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700'/>
          <button type='sumbit' className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800'>
            <HiMagnifyingGlass className='h-6 w-6'/>
          </button>
          </div>
          <button type='button' onClick={handleSearchToggle} className='absolutes right-4 top-1/2 transform -translate-y-0 text-gray-600 hover:text-gray-800'>
          <HiMiniXMark className='h-8  w-8'/>
          </button>
        </form>
      ):(
        <button onClick={handleSearchToggle}>
          <HiMagnifyingGlass className='h-6 w-6'/>
        </button>
      )
     } 
    </div>
  )
}
