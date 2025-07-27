import React from 'react';
import { CreditCard, Loader2, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useRazorpay } from '../hooks/useRazorpay';
import { RazorpayResponse } from '../types/razorpay';

interface PaymentButtonProps {
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
  onSuccess: (response: RazorpayResponse) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  customerInfo,
  orderDetails,
  onSuccess,
  onError,
  disabled = false,
  className = '',
  children,
}) => {
  const { processPayment, isLoading, error, clearError } = useRazorpay({
    onSuccess,
    onError,
  });

  const handlePayment = async () => {
    // Clear any previous errors
    clearError();
    
    // Validate inputs
    if (!customerInfo.name || !customerInfo.email) {
      const validationError = new Error('Please provide customer name and email');
      onError?.(validationError);
      return;
    }

    if (amount <= 0) {
      const validationError = new Error('Invalid payment amount');
      onError?.(validationError);
      return;
    }

    try {
      await processPayment(amount, customerInfo, orderDetails);
    } catch (err) {
      console.error('Payment processing failed:', err);
      // Error is already handled by the hook
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handlePayment}
        disabled={disabled || isLoading}
        className={`w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center transform hover:scale-105 hover:shadow-lg disabled:transform-none disabled:shadow-none ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            {children || `Pay ₹${amount.toFixed(2)}`}
          </>
        )}
      </button>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-red-800 font-medium text-sm">Payment Error</h4>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 text-sm font-medium mt-2 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Security Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-center space-x-2 text-sm text-green-700 mb-2">
          <Shield className="h-4 w-4" />
          <span className="font-medium">Secure Payment</span>
        </div>
        <div className="space-y-1 text-xs text-green-600">
          <div className="flex items-center justify-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>256-bit SSL encryption</span>
          </div>
          <div className="flex items-center justify-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>PCI DSS compliant</span>
          </div>
          <div className="flex items-center justify-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>Trusted by millions</span>
          </div>
        </div>
      </div>
      
      {/* Razorpay Branding */}
      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">R</span>
          </div>
          <span>Powered by Razorpay</span>
        </div>
      </div>

      {/* Accepted Payment Methods */}
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-2">We accept</p>
        <div className="flex justify-center space-x-2 opacity-60">
          <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
          <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
          <div className="w-8 h-5 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">RuPay</div>
          <div className="w-8 h-5 bg-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">UPI</div>
          <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">NB</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentButton;