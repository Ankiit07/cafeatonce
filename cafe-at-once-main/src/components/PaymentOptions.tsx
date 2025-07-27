import React, { useState } from 'react';
import { CreditCard, Truck, Shield, CheckCircle, Banknote, Clock } from 'lucide-react';
import PaymentButton from './PaymentButton';
import { RazorpayResponse } from '../types/razorpay';
import WhatsAppButton from './WhatsAppButton';

interface PaymentOptionsProps {
  amount: number;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  orderDetails: {
    description: string;
    receipt?: string;
  };
  onPaymentSuccess: (response: RazorpayResponse | { payment_method: 'cod'; order_id: string }) => void;
  onPaymentError?: (error: Error) => void;
  disabled?: boolean;
  className?: string;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  amount,
  customerInfo,
  orderDetails,
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
  className = '',
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'online' | 'cod'>('online');
  const [isProcessingCOD, setIsProcessingCOD] = useState(false);

  const handleCODOrder = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      onPaymentError?.(new Error('Please fill in all required customer information'));
      return;
    }

    setIsProcessingCOD(true);
    
    try {
      // Simulate order processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock order ID for COD
      const orderId = `cod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      onPaymentSuccess({
        payment_method: 'cod',
        order_id: orderId,
      });
    } catch (error) {
      onPaymentError?.(error instanceof Error ? error : new Error('COD order failed'));
    } finally {
      setIsProcessingCOD(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Payment Method Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Choose Payment Method</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Online Payment Option */}
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
              selectedPaymentMethod === 'online'
                ? 'border-primary bg-primary-light/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedPaymentMethod('online')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedPaymentMethod === 'online'
                  ? 'border-primary bg-primary'
                  : 'border-gray-300'
              }`}>
                {selectedPaymentMethod === 'online' && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="font-medium text-gray-900">Pay Online</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Credit/Debit Card, UPI, Net Banking
                </p>
              </div>
            </div>
          </div>

          {/* Cash on Delivery Option */}
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
              selectedPaymentMethod === 'cod'
                ? 'border-primary bg-primary-light/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedPaymentMethod('cod')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedPaymentMethod === 'cod'
                  ? 'border-primary bg-primary'
                  : 'border-gray-300'
              }`}>
                {selectedPaymentMethod === 'cod' && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Banknote className="h-5 w-5 text-primary" />
                  <span className="font-medium text-gray-900">Cash on Delivery</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Pay when your order arrives
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Details */}
      {selectedPaymentMethod === 'online' && (
        <div className="space-y-4">
          <PaymentButton
            amount={amount}
            customerInfo={customerInfo}
            orderDetails={orderDetails}
            onSuccess={onPaymentSuccess}
            onError={onPaymentError}
            disabled={disabled}
          />
        </div>
      )}

      {selectedPaymentMethod === 'cod' && (
        <div className="space-y-4">
          {/* COD Information */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Truck className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 mb-2">Cash on Delivery</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Pay ₹{amount.toFixed(2)} when your order is delivered</li>
                  <li>• No advance payment required</li>
                  <li>• Delivery within 3-5 business days</li>
                  <li>• COD charges: ₹25 (included in total)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* COD Order Button */}
          <button
            onClick={handleCODOrder}
            disabled={disabled || isProcessingCOD}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center transform hover:scale-105 hover:shadow-lg disabled:transform-none disabled:shadow-none"
          >
            {isProcessingCOD ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing Order...
              </>
            ) : (
              <>
                <Truck className="h-5 w-5 mr-2" />
                Place COD Order - ₹{(amount + 25).toFixed(2)}
              </>
            )}
          </button>

          {/* COD Security Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-green-700 mb-2">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Secure COD Service</span>
            </div>
            <div className="space-y-1 text-xs text-green-600">
              <div className="flex items-center justify-center space-x-1">
                <CheckCircle className="h-3 w-3" />
                <span>Verified delivery partners</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <CheckCircle className="h-3 w-3" />
                <span>Order tracking available</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <CheckCircle className="h-3 w-3" />
                <span>Easy returns & exchanges</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Delivery Information</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Standard Delivery:</strong> 3-5 business days</p>
              <p><strong>Express Delivery:</strong> 1-2 business days (₹50 extra)</p>
              <p><strong>Free Delivery:</strong> On orders above ₹1000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Security Notice */}
      <div className="text-center text-xs text-gray-500">
        <p>🔒 Your payment and personal information are always secure</p>
      </div>
      
      {/* WhatsApp Order Option */}
      <div className="border-t pt-6">
        <div className="text-center mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Prefer to order via WhatsApp?</h4>
          <p className="text-sm text-gray-600">Get personalized assistance and place your order directly through WhatsApp</p>
        </div>
        <WhatsAppButton
          type="buy"
          productName="Complete Cart"
          productPrice={amount}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default PaymentOptions;