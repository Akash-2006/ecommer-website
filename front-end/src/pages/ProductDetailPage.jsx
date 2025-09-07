import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { sku } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useApp();
  
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const foundProduct = products.find(p => p.sku === sku);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedSize(foundProduct.sizes ? foundProduct.sizes[0] : '');
      setSelectedColor(foundProduct.colors ? foundProduct.colors[0] : '');
    } else {
      navigate('/');
    }
  }, [sku, products, navigate]);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor && product.colors && product.colors.length > 0) {
      toast.error('Please select a color');
      return;
    }
    
    addToCart(product, selectedSize, selectedColor, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.images[selectedImage].url}
              alt={product.images[selectedImage].altText}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-black' : 'border-gray-300'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.altText}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider">{product.brand}</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            {product.discountPrice ? (
              <>
                <span className="text-3xl font-bold text-gray-900">
                  ${product.discountPrice}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  ${product.price}
                </span>
                <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  Save ${(product.price - product.discountPrice).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                ${product.price}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.numReviews} reviews)
              </span>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Product Details */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-900">Category:</span>
                <span className="ml-2 text-gray-700">{product.category}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Material:</span>
                <span className="ml-2 text-gray-700">{product.material}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Gender:</span>
                <span className="ml-2 text-gray-700">{product.gender}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Stock:</span>
                <span className="ml-2 text-gray-700">{product.countInStock} available</span>
              </div>
            </div>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Size</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg font-medium ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg font-medium ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="flex gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* Stock Warning */}
          {product.countInStock < 10 && product.countInStock > 0 && (
            <p className="text-orange-600 text-sm">
              Only {product.countInStock} left in stock!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
