import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { readJSONFile, writeJSONFile, appendToJSONFile } from '../utils/fileUtils.js';
import { createUserSession, destroyUserSession, authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    // Check if user already exists
    const users = readJSONFile('users.json');
    const existingUser = users.find(user => user.email === email);
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      address: '',
      phone: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save user
    const success = appendToJSONFile('users.json', newUser);
    
    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Error creating user'
      });
    }
    
    // Create user session
    createUserSession(req, newUser);
    
    // Remove password from response
    const { password: _, ...userResponse } = newUser;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Find user
    const users = readJSONFile('users.json');
    const user = users.find(user => user.email === email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Create user session
    createUserSession(req, user);
    
    // Remove password from response
    const { password: _, ...userResponse } = user;
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// Get current user profile
router.get('/me', authenticateUser, (req, res) => {
  try {
    const users = readJSONFile('users.json');
    const user = users.find(user => user.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Remove password from response
    const { password: _, ...userResponse } = user;
    
    res.json({
      success: true,
      data: userResponse
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
});

// Logout user
router.post('/logout', authenticateUser, async (req, res) => {
  try {
    await destroyUserSession(req);
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: error.message
    });
  }
});

export default router;
