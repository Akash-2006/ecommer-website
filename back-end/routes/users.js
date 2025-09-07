import express from 'express';
import { readJSONFile, writeJSONFile } from '../utils/fileUtils.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Update user profile
router.put('/profile', authenticateUser, (req, res) => {
  try {
    const { name, address, phone } = req.body;
    
    const users = readJSONFile('users.json');
    const userIndex = users.findIndex(user => user.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update user data
    if (name) users[userIndex].name = name;
    if (address) users[userIndex].address = address;
    if (phone) users[userIndex].phone = phone;
    users[userIndex].updatedAt = new Date().toISOString();
    
    const success = writeJSONFile('users.json', users);
    
    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Error updating profile'
      });
    }
    
    // Remove password from response
    const { password: _, ...userResponse } = users[userIndex];
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: userResponse
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

export default router;
