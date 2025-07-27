import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import { APIFeatures } from '../utils/apiFeatures';

const router = express.Router();

// User management
export const getAllUsers = catchAsync(async (req: any, res: any) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;
  const totalUsers = await User.countDocuments();

  res.status(200).json({
    status: 'success',
    results: users.length,
    totalResults: totalUsers,
    data: {
      users,
    },
  });
});

export const getUser = catchAsync(async (req: any, res: any) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const updateUser = catchAsync(async (req: any, res: any) => {
  const { name, email, role, isEmailVerified } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role, isEmailVerified },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const deleteUser = catchAsync(async (req: any, res: any) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Product management
export const createProduct = catchAsync(async (req: any, res: any) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      product,
    },
  });
});

export const updateProduct = catchAsync(async (req: any, res: any) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new AppError('No product found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

export const deleteProduct = catchAsync(async (req: any, res: any) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    throw new AppError('No product found with that ID', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Order management
export const getAllOrdersAdmin = catchAsync(async (req: any, res: any) => {
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

export const updateOrderAdmin = catchAsync(async (req: any, res: any) => {
  const { orderStatus, trackingNumber, notes } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { 
      orderStatus,
      trackingNumber,
      notes,
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

// System settings
export const getSystemSettings = catchAsync(async (req: any, res: any) => {
  // This would typically come from a settings collection
  const settings = {
    siteName: 'Cafe at Once',
    currency: 'INR',
    taxRate: 18,
    freeShippingThreshold: 1000,
    codCharges: 25,
    expressDeliveryCharges: 50,
    subscriptionDiscount: 15,
  };

  res.status(200).json({
    status: 'success',
    data: {
      settings,
    },
  });
});

export const updateSystemSettings = catchAsync(async (req: any, res: any) => {
  // This would typically update a settings collection
  const settings = req.body;

  res.status(200).json({
    status: 'success',
    data: {
      settings,
    },
  });
});

// Validation rules
const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['customer', 'admin'])
    .withMessage('Role must be customer or admin'),
  body('isEmailVerified')
    .optional()
    .isBoolean()
    .withMessage('Email verified must be a boolean'),
];

const createProductValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn(['concentrate', 'tube', 'flavored', 'tea'])
    .withMessage('Category must be one of: concentrate, tube, flavored, tea'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('sku')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('SKU must be between 3 and 20 characters'),
];

const updateOrderValidation = [
  body('orderStatus')
    .optional()
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  body('trackingNumber')
    .optional()
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Tracking number must be between 5 and 50 characters'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
];

// Routes - Admin only
router.use(protect);
router.use(restrictTo('admin'));

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id', updateUserValidation, validateRequest, updateUser);
router.delete('/users/:id', deleteUser);

// Product management
router.post('/products', createProductValidation, validateRequest, createProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Order management
router.get('/orders', getAllOrdersAdmin);
router.patch('/orders/:id', updateOrderValidation, validateRequest, updateOrderAdmin);

// System settings
router.get('/settings', getSystemSettings);
router.patch('/settings', updateSystemSettings);

export default router;