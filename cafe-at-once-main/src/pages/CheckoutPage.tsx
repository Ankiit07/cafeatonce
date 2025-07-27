import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, MapPin, User, CheckCircle, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import PaymentOptions from '../components/PaymentOptions';
import { RazorpayResponse } from '../types/razorpay';
import { apiService } from '../services/apiService';

const CheckoutPage: React.FC = () => {
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'IN',
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(newFormData);
    
    // Check if form is valid
    const required = ['email', 'firstName', 'lastName', 'phone', 'address', 'city', 'state', 'zipCode'];
    const isValid = required.every(field => newFormData[field as keyof typeof newFormData].trim() !== '');
    setIsFormValid(isValid);
  };

  const handlePaymentSuccess = (response: RazorpayResponse | { payment_method: 'cod'; order_id: string }) => {
    console.log('Payment/Order successful:', response);
    
    // Create order via API
    const createOrderData = async () => {
      try {
        let orderData;
        
        if ('payment_method' in response && response.payment_method === 'cod') {
          // COD Order
          orderData = {
            items: cartState.items.map(item => ({
              product: item.id,
              quantity: item.quantity,
              type: item.type,
            })),
            customerInfo: formData,
            shippingAddress: {
              street: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country,
              phone: formData.phone,
            },
            paymentMethod: 'cod',
          };
          setPaymentMethod('cod');
        } else {
          // Online Payment
          const razorpayResponse = response as RazorpayResponse;
          orderData = {
            items: cartState.items.map(item => ({
              product: item.id,
              quantity: item.quantity,
              type: item.type,
            })),
            customerInfo: formData,
            shippingAddress: {
              street: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country,
              phone: formData.phone,
            },
            paymentMethod: 'online',
            paymentDetails: {
              razorpayOrderId: razorpayResponse.razorpay_order_id,
              razorpayPaymentId: razorpayResponse.razorpay_payment_id,
              razorpaySignature: razorpayResponse.razorpay_signature,
            },
          };
          setPaymentMethod('online');
        }
        
        const orderResponse = await apiService.createOrder(orderData);
        setOrderDetails(orderResponse.data.order);
        setPaymentSuccess(true);
        
        // Clear cart after successful order creation
        setTimeout(() => {
          cartDispatch({ type: 'CLEAR_CART' });
          navigate('/account?tab=orders');
        }, 5000);
        
      } catch (error) {
        console.error('Error creating order:', error);
        handlePaymentError(error instanceof Error ? error : new Error('Order creation failed'));
      }
    };
    
    createOrderData();
  };

  const handleCODOrder = async () => {
    try {
      // Simulate COD order creation
      const codResponse = {
        payment_method: 'cod' as const,
        order_id: `cod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
      
      handlePaymentSuccess(codResponse);
    } catch (error) {
      handlePaymentError(error instanceof Error ? error : new Error('COD order failed'));
    }
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment failed:', error);
    // Error is already handled by the PaymentButton component
  };

  const calculateTax = () => {
    return cartState.total * 0.18; // 18% GST for India
  };

  const calculateShipping = () => {
    // Free shipping for orders above ₹1000
    return cartState.total >= 1000 ? 0 : 50;
  };

  const shipping = calculateShipping();
  const tax = calculateTax();
  const finalTotal = cartState.total + tax + shipping;

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-cream py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No items to checkout</h1>
            <p className="text-gray-600 mb-8">Add some products to your cart first.</p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
            >
              Shop Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-cream py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center relative overflow-hidden">
            {/* Success Animation Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-50"></div>
            
            {/* Confetti Effect */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute top-8 right-8 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute top-12 left-1/4 w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              <div className="absolute top-6 right-1/4 w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
              <div className="absolute top-16 left-3/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }}></div>
            </div>
            
            <div className="relative z-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {paymentMethod === 'cod' ? (
                <Truck className="h-12 w-12 text-green-600" />
              ) : (
                <CheckCircle className="h-12 w-12 text-green-600" />
              )}
            </div>
            
            {/* Main Success Message */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-green-600 mb-2">
                🎉 Order Placed Successfully! 🎉
              </h1>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {paymentMethod === 'cod' ? 'Order Placed Successfully!' : 'Payment Successful!'}
              </h2>
            </div>
            
            {/* Thank You Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Thank You for Your Order!</h3>
              <p className="text-green-700 mb-4">
              {paymentMethod === 'cod' 
                ? 'Your order has been confirmed and is being prepared. You can pay when it arrives at your doorstep.'
                : 'Your payment has been processed successfully. Your order is now being prepared for shipment.'
              }
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Order confirmation email sent to {formData.email}</span>
              </div>
            </div>
            
            {orderDetails && (
              <div className={`${paymentMethod === 'cod' ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'} border rounded-lg p-6 mb-6 text-left`}>
                <h3 className={`font-semibold ${paymentMethod === 'cod' ? 'text-amber-800' : 'text-green-800'} mb-3`}>Order Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Order ID:</span> {orderDetails.orderId}</p>
                  {paymentMethod === 'online' && (
                    <p><span className="font-medium">Payment ID:</span> {orderDetails.paymentId}</p>
                  )}
                  <p><span className="font-medium">Payment Method:</span> {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                  <p><span className="font-medium">Payment Status:</span> {orderDetails.paymentStatus === 'completed' ? 'Paid' : 'Pay on Delivery'}</p>
                  <p><span className="font-medium">Amount Paid:</span> ₹{orderDetails.amount.toFixed(2)}</p>
                  <p><span className="font-medium">Items:</span> {cartState.items.length} products</p>
                  {paymentMethod === 'cod' && (
                    <p className="text-amber-700"><span className="font-medium">Delivery:</span> 3-5 business days</p>
                  )}
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className={`${paymentMethod === 'cod' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'} border rounded-lg p-6 mb-6`}>
              <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
              <p className={`${paymentMethod === 'cod' ? 'text-amber-800' : 'text-blue-800'} font-medium text-sm`}>
                Order Total: ₹{paymentMethod === 'cod' ? (finalTotal + 25).toFixed(2) : finalTotal.toFixed(2)}
                {paymentMethod === 'cod' && <span className="text-xs block mt-1">(Includes ₹25 COD charges)</span>}
              </p>
              <div className="mt-3 text-sm text-gray-600">
                <p>Items: {cartState.items.length} products</p>
                <p>Delivery Address: {formData.address}, {formData.city}, {formData.state} - {formData.zipCode}</p>
                <p>Expected Delivery: {paymentMethod === 'cod' ? '3-5 business days' : '2-4 business days'}</p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-blue-800 mb-3">What happens next?</h4>
              <div className="text-left space-y-2 text-sm text-blue-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Order confirmation email sent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Your order is being prepared</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>You'll receive tracking information via SMS/email</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{paymentMethod === 'cod' ? 'Pay cash when delivered' : 'Enjoy your coffee!'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/account?tab=orders"
                className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Track Your Order
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Continue Shopping
              </Link>
            </div>
            
            {/* Customer Support */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Need help with your order?</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
                <Link to="/contact" className="text-primary hover:text-primary-dark font-medium">
                  Contact Support
                </Link>
                <span className="hidden sm:inline text-gray-400">|</span>
                <a href="tel:+917979837079" className="text-primary hover:text-primary-dark font-medium">
                  Call: +91-7979837079
                </a>
                <span className="hidden sm:inline text-gray-400">|</span>
                <a href="mailto:cafeatoncebusiness@gmail.com" className="text-primary hover:text-primary-dark font-medium">
                  Email Support
                </a>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center text-primary hover:text-primary-dark transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order with our secure payment system</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                <User className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                <MapPin className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    placeholder="123 Main Street, Apartment 4B"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder="Maharashtra"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder="400001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    >
                      <option value="IN">India</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start">
                <Lock className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Secure Payment Guarantee</h3>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Your payment information is encrypted and secure. We use Razorpay's industry-leading 
                    security measures to protect your data. We never store your card details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cartState.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-contain rounded-lg bg-cream p-1"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      {item.type === 'subscription' && (
                        <p className="text-xs text-primary font-medium">Subscription (15% off)</p>
                      )}
                    </div>
                    <span className="font-semibold text-gray-900">
                      ₹{((item.type === 'subscription' ? item.price * 0.85 : item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cartState.itemCount} items)</span>
                  <span>₹{cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
                
                {cartState.items.some(item => item.type === 'subscription') && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Subscription Savings</span>
                    <span>
                      -₹{cartState.items
                        .filter(item => item.type === 'subscription')
                        .reduce((sum, item) => sum + (item.price * 0.15 * item.quantity), 0)
                        .toFixed(2)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                    {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Button */}
              <div className="mt-6">
                <PaymentOptions
                  amount={finalTotal}
                  customerInfo={{
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email,
                    phone: formData.phone,
                  }}
                  orderDetails={{
                    description: `@once Coffee - ${cartState.items.length} items`,
                    receipt: `receipt_${Date.now()}`,
                  }}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  disabled={!isFormValid}
                />
              </div>

              {!isFormValid && (
                <p className="text-sm text-gray-500 text-center mt-3">
                  Please fill in all required fields to proceed with payment
                </p>
              )}

              {/* Free Shipping Notice */}
              {cartState.total < 1000 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Add ₹{(1000 - cartState.total).toFixed(2)} more for free shipping! (Currently ₹50)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;