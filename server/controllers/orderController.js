const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order.js');
const Product = require('../models/Product.js');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { customerInfo, items, totalAmount, paymentInfo } = req.body;

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Validate products and update stock
    for (let item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }

      if (!product.isAvailable) {
        return res.status(400).json({ message: `Product ${item.name} is not available` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.name}. Available: ${product.stock}` 
        });
      }

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      orderId,
      customerInfo,
      items,
      totalAmount,
      paymentInfo,
      orderStatus: paymentInfo.paymentStatus === 'completed' ? 'confirmed' : 'pending'
    });

    const populatedOrder = await Order.findById(order._id).populate('items.product');
    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = orderStatus;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
createRazorpayOrder,
verifyPayment,
createOrder,
getOrders,
getOrderById,
updateOrderStatus
};
