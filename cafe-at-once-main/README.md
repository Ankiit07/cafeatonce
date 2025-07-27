# Cafe at Once - E-commerce Website

A modern, responsive e-commerce website for Cafe at Once coffee products built with React, TypeScript, and Tailwind CSS.

## Features

### 🛒 E-commerce Functionality
- Product catalog with detailed product pages
- Shopping cart with subscription options
- Secure checkout process
- Multiple payment options (Online & Cash on Delivery)
- Order tracking and management

### 💳 Payment Integration
- **Razorpay Integration**: Secure online payments
- **Cash on Delivery**: Pay when your order arrives
- **WhatsApp Ordering**: Direct ordering via WhatsApp
- **Subscription Payments**: Recurring payment support

### 🎨 Modern Design
- Responsive design for all devices
- Beautiful animations and micro-interactions
- Apple-level design aesthetics
- Optimized performance

### 🤖 Customer Support
- AI-powered chatbot
- WhatsApp integration
- Contact forms
- Live support options

## Payment Setup

### Razorpay Configuration

1. **Get Razorpay Keys**:
   - Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Get your Test/Live API keys
   - Update `RAZORPAY_KEY_ID` in `src/services/razorpay.ts`

2. **Backend Integration** (Required for Production):
   ```javascript
   // Example backend endpoint for creating orders
   app.post('/api/create-order', async (req, res) => {
     const { amount, currency, receipt } = req.body;
     
     const order = await razorpay.orders.create({
       amount: amount * 100, // Convert to paise
       currency,
       receipt,
     });
     
     res.json(order);
   });
   
   // Example backend endpoint for payment verification
   app.post('/api/verify-payment', async (req, res) => {
     const { order_id, payment_id, signature } = req.body;
     
     const body = order_id + "|" + payment_id;
     const expectedSignature = crypto
       .createHmac('sha256', process.env.RAZORPAY_SECRET)
       .update(body.toString())
       .digest('hex');
     
     const isAuthentic = expectedSignature === signature;
     res.json({ isAuthentic });
   });
   ```

3. **Environment Variables**:
   ```env
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_SECRET=your_secret_key
   ```

### Payment Features

- **Secure Processing**: All payments are processed securely through Razorpay
- **Multiple Payment Methods**: Cards, UPI, Net Banking, Wallets
- **Payment Validation**: Comprehensive validation and error handling
- **Order Management**: Complete order tracking and management
- **Subscription Support**: Recurring payments for subscriptions

### WhatsApp Integration

- **Direct Ordering**: Customers can order via WhatsApp
- **Customer Support**: 24/7 WhatsApp support
- **Order Updates**: Automated order status updates

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Payment**: Razorpay
- **Build Tool**: Vite
- **Deployment**: Netlify

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd cafe-at-once
   ```

2. **Install dependencies**:
   ```bash
   npm install
    cd backend && npm install && cd ..
   ```

3. **Set up environment variables**:
   ```bash
    # Frontend environment
   cp .env.example .env
    # Backend environment
    cp backend/.env.example backend/.env
    # Update both files with your configuration
   ```

4. **Start MongoDB** (required for backend):
   ```bash
   # Install MongoDB locally or use MongoDB Atlas
   # Update MONGODB_URI in backend/.env
   ```

5. **Start development servers**:
   ```bash
    # Start both frontend and backend
    npm run dev:full
    
    # Or start individually:
    npm run dev          # Frontend only
    npm run backend:dev  # Backend only
   ```

6. **Build for production**:
   ```bash
    npm run build:full
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── PaymentButton.tsx
│   ├── PaymentOptions.tsx
│   ├── WhatsAppButton.tsx
│   └── ChatBot.tsx
├── hooks/              # Custom React hooks
│   └── useRazorpay.ts
├── services/           # External service integrations
│   ├── razorpay.ts
│   └── whatsappService.ts
├── types/              # TypeScript type definitions
│   └── razorpay.d.ts
├── utils/              # Utility functions
│   ├── paymentValidation.ts
│   └── paymentHelpers.ts
├── config/             # Configuration files
│   └── api.ts
├── hooks/              # Custom React hooks
│   └── useApi.ts
├── pages/              # Page components
├── context/            # React Context providers
├── data/               # Static data and configurations
└── services/           # API and external services
    ├── apiService.ts
    ├── razorpay.ts
    └── whatsappService.ts

backend/
├── src/
│   ├── controllers/    # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Express middleware
│   ├── services/       # Business logic services
│   ├── utils/          # Utility functions
│   ├── config/         # Configuration files
│   └── server.ts       # Main server file
├── dist/               # Compiled JavaScript
└── package.json
```

## Payment Flow

1. **Cart Review**: Customer reviews items in cart
2. **Checkout Form**: Customer fills shipping and contact details
3. **Payment Method**: Choose between online payment or COD
4. **Payment Processing**: Secure payment through Razorpay
5. **Order Confirmation**: Success page with order details
6. **Order Tracking**: Customer can track order status

## Security Features

- **PCI DSS Compliance**: Through Razorpay integration
- **SSL Encryption**: All data transmitted securely
- **Payment Validation**: Server-side payment verification
- **Error Handling**: Comprehensive error handling and user feedback

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/forgot-password` - Password reset request
- `PATCH /api/v1/auth/reset-password/:token` - Reset password

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get single product
- `GET /api/v1/products/featured` - Get featured products
- `GET /api/v1/products/category/:category` - Get products by category

### Orders
- `POST /api/v1/payments/create-order-from-cart` - Create order
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/:id` - Get single order

### Payments
- `POST /api/v1/payments/create-order` - Create Razorpay order
- `POST /api/v1/payments/verify` - Verify payment

### Contact
- `POST /api/v1/contact/send` - Send contact message

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_WHATSAPP_NUMBER=7979837079
VITE_BUSINESS_EMAIL=cafeatoncebusiness@gmail.com
```

### Backend (backend/.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cafe-at-once
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

## Support

For support and questions:
- **Email**: cafeatoncebusiness@gmail.com
- **Phone**: +91-7979837079
- **WhatsApp**: Available 24/7

## License

This project is proprietary software for Cafe at Once.