const Order = require('../models/Order');
const Product = require('../models/Product');
const { processPayment } = require('../services/paymentService');
const { logAction } = require('../services/auditService');

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

// Create new order
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod, guestEmail } = req.body;

    // Validate inventory for all items
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }

      if (product.inventory < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for ${product.name}. Available: ${product.inventory}`
        });
      }

      if (product.inventory === 0) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`
        });
      }
    }

    // Calculate order total and prepare items
    let orderTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      const subtotal = product.price * item.quantity;
      orderTotal += subtotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        productPrice: product.price,
        quantity: item.quantity,
        subtotal
      });
    }

    // Process payment
    const paymentResult = await processPayment({
      amount: orderTotal,
      method: paymentMethod,
      billingAddress
    });

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Payment processing failed',
        error: paymentResult.error
      });
    }

    // Create order
    const order = new Order({
      orderNumber: generateOrderNumber(),
      userId: req.user?.id || null,
      guestEmail: req.user ? null : guestEmail,
      items: orderItems,
      shippingAddress,
      billingAddress,
      paymentInfo: {
        method: paymentMethod,
        transactionId: paymentResult.transactionId,
        status: 'completed'
      },
      orderTotal,
      status: 'pending'
    });

    await order.save();

    // Decrement inventory for all items
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { inventory: -item.quantity } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify user authorization (user can only view their own orders)
    if (req.user && order.userId && order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    // Verify user can only access their own orders
    if (req.user.id !== userId && !req.admin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate('items.productId');

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.productId');

    const total = await Order.countDocuments();

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Log admin action
    await logAction(req.admin.id, 'update', 'order', id, {
      field: 'status',
      oldValue: order.status,
      newValue: status
    });

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
};
