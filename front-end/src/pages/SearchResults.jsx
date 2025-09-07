import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductGrid } from '../components/Products/ProductGrid';

const SearchResults = () => {
  const { searchQuery, getFilteredProducts } = useApp();
  const filteredProducts = getFilteredProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search Results
        </h1>
        {searchQuery && (
          <p className="text-gray-600">
            Showing {filteredProducts.length} results for "{searchQuery}"
          </p>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              No products found
            </h2>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? `We couldn't find any products matching "${searchQuery}". Try searching with different keywords.`
                : "Please enter a search term to find products."
              }
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Check your spelling</p>
              <p>• Try different keywords</p>
              <p>• Use more general terms</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
