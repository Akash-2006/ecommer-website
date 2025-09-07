import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductGrid } from '../components/Products/ProductGrid';

const ProductsPage = ({ gender, category }) => {
  const { 
    setGender, 
    setCategory, 
    getFilteredProducts,
    selectedGender,
    selectedCategory,
    availableColors,
    availableSizes,
    selectedColors,
    selectedSizes,
    setSelectedColors,
    setSelectedSizes,
    setPriceRange,
    priceRange,
    setSearchQuery,
    searchQuery
  } = useApp();
  
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (gender) {
      setGender(gender);
      setCategory('all');
      setSearchQuery(''); // Clear search when navigating to gender pages
    }
    if (category) {
      setCategory(category);
      setGender('all');
      setSearchQuery(''); // Clear search when navigating to category pages
    }
  }, [gender, category, setGender, setCategory, setSearchQuery]);

  const filteredProducts = getFilteredProducts();

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'price':
        aValue = a.discountPrice || a.price;
        bValue = b.discountPrice || b.price;
        break;
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'rating':
        aValue = a.rating;
        bValue = b.rating;
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getPageTitle = () => {
    if (gender) {
      return `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Collection`;
    }
    if (category) {
      return category;
    }
    return 'Products';
  };

  const handlePriceRangeChange = (min, max) => {
    setPriceRange({ min, max });
  };

  const handleColorChange = (color, checked) => {
    if (checked) {
      setSelectedColors([...selectedColors, color]);
    } else {
      setSelectedColors(selectedColors.filter(c => c !== color));
    }
  };

  const handleSizeChange = (size, checked) => {
    if (checked) {
      setSelectedSizes([...selectedSizes, size]);
    } else {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    }
  };

  // Color mapping for proper CSS colors
  const getColorStyle = (colorName) => {
    const colorMap = {
      'Black': '#000000',
      'White': '#FFFFFF',
      'Red': '#DC2626',
      'Blue': '#2563EB',
      'Navy Blue': '#1E3A8A',
      'Navy': '#1E3A8A',
      'Dark Blue': '#1E40AF',
      'Light Blue': '#3B82F6',
      'Gray': '#6B7280',
      'Grey': '#6B7280',
      'Green': '#059669',
      'Yellow': '#FACC15',
      'Burgundy': '#7C2D12',
      'Purple': '#7C3AED',
      'Pink': '#EC4899',
      'Orange': '#EA580C',
      'Brown': '#A16207'
    };
    
    return colorMap[colorName] || colorName.toLowerCase();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-gray-600 mt-2">{filteredProducts.length} products found</p>
        </div>
        
        {/* Sort Controls */}
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Filters
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="rating">Sort by Rating</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <div className={`${showFilters ? 'block' : 'hidden md:block'} w-full md:w-64 space-y-6`}>
          <div className="bg-white p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            
            {/* Active Search Indicator */}
            {searchQuery && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">Active Search:</p>
                <p className="text-sm text-blue-700">"{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                >
                  Clear search
                </button>
              </div>
            )}
            
            {/* Price Range */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange.max}
                  onChange={(e) => handlePriceRangeChange(priceRange.min, parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${priceRange.min}</span>
                  <span>${priceRange.max}</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            {!category && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mr-2"
                    />
                    All Categories
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="Top Wear"
                      checked={selectedCategory === 'Top Wear'}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mr-2"
                    />
                    Top Wear
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="Bottom Wear"
                      checked={selectedCategory === 'Bottom Wear'}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mr-2"
                    />
                    Bottom Wear
                  </label>
                </div>
              </div>
            )}

            {/* Gender */}
            {!gender && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Gender</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="all"
                      checked={selectedGender === 'all'}
                      onChange={(e) => setGender(e.target.value)}
                      className="mr-2"
                    />
                    All
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="men"
                      checked={selectedGender === 'men'}
                      onChange={(e) => setGender(e.target.value)}
                      className="mr-2"
                    />
                    Men
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="women"
                      checked={selectedGender === 'women'}
                      onChange={(e) => setGender(e.target.value)}
                      className="mr-2"
                    />
                    Women
                  </label>
                </div>
              </div>
            )}
            
            {/* Color Filter */}
            {availableColors && availableColors.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Colors ({availableColors.length} available)
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableColors.map(color => (
                    <label key={color} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={(e) => handleColorChange(color, e.target.checked)}
                        className="mr-3 cursor-pointer w-4 h-4"
                      />
                      <span className="flex items-center">
                        <div 
                          className="w-5 h-5 rounded-full mr-3 flex-shrink-0" 
                          style={{ 
                            backgroundColor: getColorStyle(color),
                            border: color === 'White' ? '2px solid #9CA3AF' : '1px solid #9CA3AF',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                          }}
                          title={`Color: ${color}`}
                        ></div>
                        <span className="text-sm font-medium">{color}</span>
                      </span>
                    </label>
                  ))}
                </div>
                {selectedColors.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedColors([])}
                      className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      Clear color filters ({selectedColors.length})
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Size Filter */}
            {availableSizes && availableSizes.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Sizes ({availableSizes.length} available)
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {availableSizes.map(size => (
                    <label key={size} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={(e) => handleSizeChange(size, e.target.checked)}
                        className="sr-only"
                      />
                      <span className={`w-full text-center py-2 px-3 text-sm border rounded cursor-pointer transition-all duration-200 ${
                        selectedSizes.includes(size) 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}>
                        {size}
                      </span>
                    </label>
                  ))}
                </div>
                {selectedSizes.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedSizes([])}
                      className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      Clear size filters ({selectedSizes.length})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {sortedProducts.length > 0 ? (
            <ProductGrid products={sortedProducts} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
