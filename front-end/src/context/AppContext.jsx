import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { productsAPI, ordersAPI, authAPI, clearUserSession } from '../utils/api.js';

// Initial state
const initialState = {
  products: [],
  availableColors: [],
  availableSizes: [],
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  user: JSON.parse(localStorage.getItem('user')) || null,
  orders: [],
  searchQuery: '',
  selectedCategory: 'all',
  selectedGender: 'all',
  selectedColors: [],
  selectedSizes: [],
  priceRange: { min: 0, max: 200 },
  isLoading: false,
  error: null
};

// Action types
export const ACTIONS = {
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_AVAILABLE_COLORS: 'SET_AVAILABLE_COLORS',
  SET_AVAILABLE_SIZES: 'SET_AVAILABLE_SIZES',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_QUANTITY: 'UPDATE_CART_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_ORDERS: 'SET_ORDERS',
  ADD_ORDER: 'ADD_ORDER',
  SET_USER: 'SET_USER',
  LOGOUT_USER: 'LOGOUT_USER',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_CATEGORY: 'SET_CATEGORY',
  SET_GENDER: 'SET_GENDER',
  SET_SELECTED_COLORS: 'SET_SELECTED_COLORS',
  SET_SELECTED_SIZES: 'SET_SELECTED_SIZES',
  SET_PRICE_RANGE: 'SET_PRICE_RANGE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_PRODUCTS:
      return { ...state, products: action.payload };
    
    case ACTIONS.SET_AVAILABLE_COLORS:
      return { ...state, availableColors: action.payload };
    
    case ACTIONS.SET_AVAILABLE_SIZES:
      return { ...state, availableSizes: action.payload };
    
    case ACTIONS.ADD_TO_CART: {
      const existingItem = state.cart.find(item => 
        item.sku === action.payload.sku && 
        item.selectedSize === action.payload.selectedSize &&
        item.selectedColor === action.payload.selectedColor
      );
      
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.sku === action.payload.sku &&
            item.selectedSize === action.payload.selectedSize &&
            item.selectedColor === action.payload.selectedColor
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, id: Date.now() }]
        };
      }
    }
    case ACTIONS.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    
    case ACTIONS.UPDATE_CART_QUANTITY:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case ACTIONS.CLEAR_CART:
      return { ...state, cart: [] };
    
    case ACTIONS.SET_ORDERS:
      return { ...state, orders: action.payload };
    
    case ACTIONS.ADD_ORDER:
      return { 
        ...state, 
        orders: [...state.orders, action.payload],
        cart: [] // Clear cart after successful order
      };
    
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    
    case ACTIONS.LOGOUT_USER:
      return { ...state, user: null };
    
    case ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    
    case ACTIONS.SET_CATEGORY:
      return { ...state, selectedCategory: action.payload };
    
    case ACTIONS.SET_GENDER:
      return { ...state, selectedGender: action.payload };
    
    case ACTIONS.SET_SELECTED_COLORS:
      return { ...state, selectedColors: action.payload };
    
    case ACTIONS.SET_SELECTED_SIZES:
      return { ...state, selectedSizes: action.payload };
    
    case ACTIONS.SET_PRICE_RANGE:
      return { ...state, priceRange: action.payload };
    
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(state.user));
  }, [state.user]);

  // Load initial data on app start
  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        
        // Load products
        const productsResponse = await productsAPI.getAll();
        dispatch({ type: ACTIONS.SET_PRODUCTS, payload: productsResponse.data.data });
        
        // Load available colors and sizes
        const colorsResponse = await productsAPI.getColors();
        dispatch({ type: ACTIONS.SET_AVAILABLE_COLORS, payload: colorsResponse.data.data });
        
        const sizesResponse = await productsAPI.getSizes();
        dispatch({ type: ACTIONS.SET_AVAILABLE_SIZES, payload: sizesResponse.data.data });
        
        // Check if user is authenticated and load their data
        if (state.user) {
          try {
            // Try to get user profile to verify session
            await authAPI.getMe();
            
            // Load user's orders
            const ordersResponse = await ordersAPI.getAll();
            dispatch({ type: ACTIONS.SET_ORDERS, payload: ordersResponse.data.data });
          } catch (error) {
            // Session is invalid, clear user data
            dispatch({ type: ACTIONS.LOGOUT_USER });
            clearUserSession();
          }
        }
        
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    };
    
    initializeApp();
  }, []); // Only run on mount

  // Helper functions
  const addToCart = useCallback((product, selectedSize, selectedColor, quantity = 1) => {
    dispatch({
      type: ACTIONS.ADD_TO_CART,
      payload: {
        sku: product.sku,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.images[0].url,
        selectedSize,
        selectedColor,
        quantity,
        maxStock: product.countInStock
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: itemId });
  }, []);

  const updateCartQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      dispatch({
        type: ACTIONS.UPDATE_CART_QUANTITY,
        payload: { id: itemId, quantity }
      });
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_CART });
  }, []);

  const setUser = useCallback((userData) => {
    dispatch({ type: ACTIONS.SET_USER, payload: userData });
  }, []);

  const loginUser = useCallback(async (credentials) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await authAPI.login(credentials);
      const { user } = response.data.data;
      
      dispatch({ type: ACTIONS.SET_USER, payload: user });
      
      // Load user's orders after login
      const ordersResponse = await ordersAPI.getAll();
      dispatch({ type: ACTIONS.SET_ORDERS, payload: ordersResponse.data.data });
      
      return { success: true, user };
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || error.message });
      return { success: false, error: error.response?.data?.message || error.message };
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  const registerUser = useCallback(async (userData) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await authAPI.register(userData);
      const { user } = response.data.data;
      
      dispatch({ type: ACTIONS.SET_USER, payload: user });
      
      return { success: true, user };
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || error.message });
      return { success: false, error: error.response?.data?.message || error.message };
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call logout API to destroy session
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    }
    
    dispatch({ type: ACTIONS.LOGOUT_USER });
    dispatch({ type: ACTIONS.SET_ORDERS, payload: [] });
    clearUserSession();
  }, []);

  const setSearchQuery = useCallback((query) => {
    dispatch({ type: ACTIONS.SET_SEARCH_QUERY, payload: query });
  }, []);

  const setCategory = useCallback((category) => {
    dispatch({ type: ACTIONS.SET_CATEGORY, payload: category });
  }, []);

  const setGender = useCallback((gender) => {
    dispatch({ type: ACTIONS.SET_GENDER, payload: gender });
  }, []);

  const setPriceRange = useCallback((range) => {
    dispatch({ type: ACTIONS.SET_PRICE_RANGE, payload: range });
  }, []);

  const setSelectedColors = useCallback((colors) => {
    dispatch({ type: ACTIONS.SET_SELECTED_COLORS, payload: colors });
  }, []);

  const setSelectedSizes = useCallback((sizes) => {
    dispatch({ type: ACTIONS.SET_SELECTED_SIZES, payload: sizes });
  }, []);

  // Get filtered products
  const getFilteredProducts = useCallback(() => {
    let filtered = state.products;

    // Filter by search query
    if (state.searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (state.selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === state.selectedCategory.toLowerCase()
      );
    }

    // Filter by gender
    if (state.selectedGender !== 'all') {
      filtered = filtered.filter(product =>
        product.gender.toLowerCase() === state.selectedGender.toLowerCase()
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => {
      const price = product.discountPrice || product.price;
      return price >= state.priceRange.min && price <= state.priceRange.max;
    });

    // Filter by selected colors
    if (state.selectedColors.length > 0) {
      filtered = filtered.filter(product => 
        product.colors && product.colors.some(color => 
          state.selectedColors.includes(color)
        )
      );
    }

    // Filter by selected sizes
    if (state.selectedSizes.length > 0) {
      filtered = filtered.filter(product => 
        product.sizes && product.sizes.some(size => 
          state.selectedSizes.includes(size)
        )
      );
    }

    return filtered;
  }, [state.products, state.searchQuery, state.selectedCategory, state.selectedGender, state.priceRange, state.selectedColors, state.selectedSizes]);

  // Get cart total
  const getCartTotal = useCallback(() => {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [state.cart]);

  // Get cart item count
  const getCartItemCount = useCallback(() => {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  }, [state.cart]);

  // Create order function
  const createOrder = useCallback(async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const orderData = {
        items: state.cart.map(item => ({
          sku: item.sku,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          image: item.image
        })),
        total: getCartTotal(),
        shippingAddress: state.user?.address || 'Default Address',
        paymentMethod: 'Card'
      };
      
      const response = await ordersAPI.create(orderData);
      const newOrder = response.data.data;
      
      dispatch({ type: ACTIONS.ADD_ORDER, payload: newOrder });
      dispatch({ type: ACTIONS.CLEAR_CART }); // Clear cart after successful order
      
      return { success: true, order: newOrder };
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || error.message });
      return { success: false, error: error.response?.data?.message || error.message };
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, [state.cart, state.user, getCartTotal]);

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    createOrder,
    setUser,
    loginUser,
    registerUser,
    logout,
    setSearchQuery,
    setCategory,
    setGender,
    setSelectedColors,
    setSelectedSizes,
    setPriceRange,
    getFilteredProducts,
    getCartTotal,
    getCartItemCount
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
