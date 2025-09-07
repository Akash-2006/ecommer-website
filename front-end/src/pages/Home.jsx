import React, { useEffect } from 'react'
import { Hero } from '../components/Layout/Hero'
import GenderCollectionSection from '../components/Products/GenderCollectionSection'
import NewArrivals from '../components/Products/NewArrivals'
import { ProductDetails } from '../components/Products/ProductDetails'
import { ProductGrid } from '../components/Products/ProductGrid'
import { FeaturedCollection } from '../components/Products/FeaturedCollection'
import { FeaturesSection } from '../components/Products/FeaturesSection'
import { useApp } from '../context/AppContext'



export const Home = () => {
  const { products, setSearchQuery, setCategory, setGender } = useApp();
  
  // Clear all filters when navigating to home page
  useEffect(() => {
    setSearchQuery('');
    setCategory('all');
    setGender('all');
  }, [setSearchQuery, setCategory, setGender]);
  
  // Get some sample products for different sections
  const womenTopWear = products.filter(p => p.gender === 'Women' && p.category === 'Top Wear').slice(0, 8);
  const bestSellers = products.filter(p => p.rating >= 4.5).slice(0, 4);
  
  return (
    <div>
    <Hero/>
    <GenderCollectionSection/>
    <NewArrivals />

    <div className="container mx-auto px-4 py-8">
      <h2 className='text-3xl text-center font-bold mb-8'>Best Sellers</h2>
      <ProductGrid products={bestSellers}/>
    </div>
    
    <ProductDetails/>
    
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl text-center font-bold mb-8">
        Top Wears for Women
      </h2>
      <ProductGrid products={womenTopWear}/>
    </div>
    
    <FeaturedCollection/>
    <FeaturesSection/>
    </div>
  )
}
