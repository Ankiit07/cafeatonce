import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body, query } from 'express-validator';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import Order from '../models/Order';
import { APIFeatures } from '../utils/apiFeatures';

const router = express.Router();

// Get all orders for user
export const getUserOrders = catchAsync(async (req: any, res: any) => {
  const features = new APIFeatures(
    Order.find({ user: req.user.id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const orders = await features.query;
  const totalOrders = await Order.countDocuments({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    totalResults: totalOrders,
    data: {
      orders,
    },
  });
});

// Get single order
export const getOrder = catchAsync(async (req: any, res: any) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!order) {
    throw new AppError('No order found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// Track order by order number
export const trackOrder = catchAsync(async (req: any, res: any) => {
  const { orderNumber } = req.params;
  
  const order = await Order.findOne({
    orderNumber,
    $or: [
      { user: req.user.id },
      { 'customerInfo.email': req.user.email }
    ]
  });

  if (!order) {
    throw new AppError('No order found with that order number', 404);
  }

  // Create tracking info
  const trackingInfo = {
    orderNumber: order.orderNumber,
    status: order.orderStatus,
    paymentStatus: order.paymentStatus,
    estimatedDelivery: order.estimatedDelivery,
    actualDelivery: order.actualDelivery,
    trackingNumber: order.trackingNumber,
    timeline: [
      {
        status: 'pending',
        date: order.createdAt,
        description: 'Order placed successfully',
        completed: true,
      },
      {
        status: 'confirmed',
        date: order.orderStatus !== 'pending' ? order.updatedAt : null,
        description: 'Order confirmed and being prepared',
        completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.orderStatus),
      },
      {
        status: 'processing',
        date: order.orderStatus === 'processing' ? order.updatedAt : null,
        description: 'Order is being processed',
        completed: ['processing', 'shipped', 'delivered'].includes(order.orderStatus),
      },
      {
        status: 'shipped',
        date: order.orderStatus === 'shipped' ? order.updatedAt : null,
        description: 'Order has been shipped',
        completed: ['shipped', 'delivered'].includes(order.orderStatus),
      },
      {
        status: 'delivered',
        date: order.actualDelivery,
        description: 'Order delivered successfully',
        completed: order.orderStatus === 'delivered',
      },
    ],
  };

  res.status(200).json({
    status: 'success',
    data: {
      tracking: trackingInfo,
    },
  });
});

// Cancel order
export const cancelOrder = catchAsync(async (req: any, res: any) => {
  const { reason } = req.body;
  
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!order) {
    throw new AppError('No order found with that ID', 404);
  }

  if (!['pending', 'confirmed'].includes(order.orderStatus)) {
    throw new AppError('Order cannot be cancelled at this stage', 400);
  }

  order.orderStatus = 'cancelled';
  order.cancellationReason = reason;
  await order.save();

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// Admin routes
export const getAllOrders = catchAsync(async (req: any, res: any) => {
  const features = new APIFeatures(Order.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const orders = await features.query;
  const totalOrders = await Order.countDocuments();

  res.status(200).json({
    status: 'success',
    results: orders.length,
    totalResults: totalOrders,
    data: {
      orders,
    },
  });
});

export const updateOrderStatus = catchAsync(async (req: any, res: any) => {
  const { orderStatus, trackingNumber } = req.body;
  
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { 
      orderStatus,
      trackingNumber,
      ...(orderStatus === 'delivered' && { actualDelivery: new Date() })
    },
    { new: true, runValidators: true }
  );

  if (!order) {
    throw new AppError('No order found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// Validation rules
const cancelOrderValidation = [
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Cancellation reason must be less than 500 characters'),
];

const updateOrderStatusValidation = [
  body('orderStatus')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  body('trackingNumber')
    .optional()
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Tracking number must be between 5 and 50 characters'),
];

// Routes
router.use(protect); // All routes require authentication

// User routes
router.get('/', getUserOrders);
router.get('/track/:orderNumber', trackOrder);
router.get('/:id', getOrder);
router.patch('/:id/cancel', cancelOrderValidation, validateRequest, cancelOrder);

// Admin routes
router.use(restrictTo('admin'));
router.get('/admin/all', getAllOrders);
router.patch('/admin/:id/status', updateOrderStatusValidation, validateRequest, updateOrderStatus);

export default router;