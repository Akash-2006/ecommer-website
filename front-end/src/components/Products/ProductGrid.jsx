import { Link } from 'react-router-dom'

export const ProductGrid = ({products}) => {
  // Determine grid columns based on product count for better centering
  const getGridClasses = () => {
    const count = products.length;
    if (count === 1) {
      return "grid grid-cols-1 gap-6 justify-items-center";
    } else if (count === 2) {
      return "grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center";
    } else if (count === 3) {
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center";
    } else {
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6";
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className={getGridClasses()}>
        {products.map((product) => (
          <Link to={`/product/${product.sku}`} key={product.sku} className="block">
            <div className="bg-white p-4 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-full h-96 mb-4 overflow-hidden rounded-lg">
                <img 
                  src={product.images ? product.images[0].url : product.image} 
                  alt={product.images ? product.images[0].altText : product.name}
                  className='w-full h-full object-cover hover:scale-105 transition-transform duration-300' 
                />
              </div>
              <h3 className="text-sm mb-2 font-medium">{product.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                {product.discountPrice ? (
                  <>
                    <span className="text-gray-900 font-semibold text-sm">
                      ${product.discountPrice}
                    </span>
                    <span className="text-gray-500 text-sm line-through">
                      ${product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-900 font-semibold text-sm">
                    ${product.price}
                  </span>
                )}
              </div>
              {product.rating && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <span>★</span>
                  <span>{product.rating}</span>
                  <span>({product.numReviews})</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
