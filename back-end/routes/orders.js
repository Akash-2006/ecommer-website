import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readJSONFile, writeJSONFile, appendToJSONFile, updateJSONFile } from '../utils/fileUtils.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Get user's orders
router.get('/', authenticateUser, (req, res) => {
  try {
    const orders = readJSONFile('orders.json');
    const userOrders = orders.filter(order => order.userId === req.user.id);
    
    // Sort by date (newest first)
    userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      count: userOrders.length,
      data: userOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Create new order
router.post('/', authenticateUser, (req, res) => {
  try {
    const { items, total, shippingAddress, paymentMethod } = req.body;
    
    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }
    
    if (!total || total <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Total amount must be greater than 0'
      });
    }
    
    // Calculate order total from items to verify
    const calculatedTotal = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    // Allow small floating point differences
    if (Math.abs(calculatedTotal - total) > 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Total amount does not match items'
      });
    }
    
    // Create order
    const newOrder = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: req.user.id,
      items: items.map(item => ({
        id: item.id || uuidv4(),
        sku: item.sku,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        image: item.image
      })),
      total: parseFloat(total.toFixed(2)),
      status: 'Processing',
      shippingAddress: shippingAddress || 'Default Address',
      paymentMethod: paymentMethod || 'Card',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingNumber: `TRK-${Date.now()}`,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };
    
    // Save order
    const success = appendToJSONFile('orders.json', newOrder);
    
    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Error creating order'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// Get single order
router.get('/:orderId', authenticateUser, (req, res) => {
  try {
    const orders = readJSONFile('orders.json');
    const order = orders.find(order => 
      order.id === req.params.orderId && order.userId === req.user.id
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// Update order status (for admin use or status simulation)
router.patch('/:orderId/status', authenticateUser, (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
      });
    }
    
    const orders = readJSONFile('orders.json');
    const orderIndex = orders.findIndex(order => 
      order.id === req.params.orderId && order.userId === req.user.id
    );
    
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update order
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    const success = writeJSONFile('orders.json', orders);
    
    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Error updating order'
      });
    }
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: orders[orderIndex]
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
});

export default router;
