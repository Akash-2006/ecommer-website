import express from 'express';
import { readJSONFile, writeJSONFile, appendToJSONFile, updateJSONFile, deleteFromJSONFile } from '../utils/fileUtils.js';

const router = express.Router();

// Get all products with optional filtering
router.get('/', (req, res) => {
  try {
    let products = readJSONFile('products.json');
    
    // Apply filters
    const { category, gender, brand, minPrice, maxPrice, search, color, size } = req.query;
    
    if (category && category !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    
    if (gender && gender !== 'all') {
      products = products.filter(p => p.gender.toLowerCase() === gender.toLowerCase());
    }
    
    if (brand) {
      products = products.filter(p => p.brand.toLowerCase().includes(brand.toLowerCase()));
    }
    
    if (minPrice) {
      products = products.filter(p => (p.discountPrice || p.price) >= parseFloat(minPrice));
    }
    
    if (maxPrice) {
      products = products.filter(p => (p.discountPrice || p.price) <= parseFloat(maxPrice));
    }
    
    if (search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (color) {
      products = products.filter(p => 
        p.colors && p.colors.some(c => 
          c.toLowerCase().includes(color.toLowerCase())
        )
      );
    }
    
    if (size) {
      products = products.filter(p => 
        p.sizes && p.sizes.some(s => 
          s.toLowerCase() === size.toLowerCase()
        )
      );
    }
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Get single product by ID or SKU
router.get('/:identifier', (req, res) => {
  try {
    const products = readJSONFile('products.json');
    const product = products.find(p => p.id === req.params.identifier || p.sku === req.params.identifier);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// Get featured products (high rating)
router.get('/featured/list', (req, res) => {
  try {
    const products = readJSONFile('products.json');
    const featuredProducts = products
      .filter(p => p.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
    
    res.json({
      success: true,
      count: featuredProducts.length,
      data: featuredProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
});

// Get products by category
router.get('/category/:category', (req, res) => {
  try {
    const products = readJSONFile('products.json');
    const categoryProducts = products.filter(p => 
      p.category.toLowerCase() === req.params.category.toLowerCase()
    );
    
    res.json({
      success: true,
      count: categoryProducts.length,
      data: categoryProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message
    });
  }
});

// Get products by gender
router.get('/gender/:gender', (req, res) => {
  try {
    const products = readJSONFile('products.json');
    const genderProducts = products.filter(p => 
      p.gender.toLowerCase() === req.params.gender.toLowerCase()
    );
    
    res.json({
      success: true,
      count: genderProducts.length,
      data: genderProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products by gender',
      error: error.message
    });
  }
});

// Get available colors
router.get('/filters/colors', (req, res) => {
  try {
    const products = readJSONFile('products.json');
    const allColors = products.reduce((colors, product) => {
      if (product.colors) {
        product.colors.forEach(color => {
          if (!colors.includes(color)) {
            colors.push(color);
          }
        });
      }
      return colors;
    }, []);
    
    res.json({
      success: true,
      data: allColors.sort()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching colors',
      error: error.message
    });
  }
});

// Get available sizes
router.get('/filters/sizes', (req, res) => {
  try {
    const products = readJSONFile('products.json');
    const allSizes = products.reduce((sizes, product) => {
      if (product.sizes) {
        product.sizes.forEach(size => {
          if (!sizes.includes(size)) {
            sizes.push(size);
          }
        });
      }
      return sizes;
    }, []);
    
    // Sort sizes in a logical order
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const sortedSizes = allSizes.sort((a, b) => {
      const aIndex = sizeOrder.indexOf(a);
      const bIndex = sizeOrder.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
    
    res.json({
      success: true,
      data: sortedSizes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sizes',
      error: error.message
    });
  }
});

export default router;
