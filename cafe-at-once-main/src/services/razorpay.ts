import { RazorpayOptions, RazorpayOrder } from '../types/razorpay';
import { apiService } from './apiService';

// Razorpay configuration
const RAZORPAY_KEY_ID = 'rzp_test_1DP5mmOlF5G5ag'; // Your test key
const RAZORPAY_SECRET = 'your_secret_key_here'; // This should be on your backend

export class RazorpayService {
  private static instance: RazorpayService;
  private isScriptLoaded = false;

  private constructor() {}

  public static getInstance(): RazorpayService {
    if (!RazorpayService.instance) {
      RazorpayService.instance = new RazorpayService();
    }
    return RazorpayService.instance;
  }

  // Load Razorpay script dynamically
  public async loadRazorpayScript(): Promise<boolean> {
    if (this.isScriptLoaded) {
      return true;
    }

    // Check if script is already loaded
    if (window.Razorpay) {
      this.isScriptLoaded = true;
      return true;
    }

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.isScriptLoaded = true;
        console.log('Razorpay script loaded successfully');
        resolve(true);
      };
      script.onerror = (error) => {
        console.error('Failed to load Razorpay script:', error);
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  // Create order - In production, this should be an API call to your backend
  public async createOrder(amount: number, currency: string = 'INR', receipt?: string): Promise<RazorpayOrder> {
    try {
      console.log('Creating order for amount:', amount, 'currency:', currency);
      
      // Validate amount
      if (!amount || amount <= 0) {
        throw new Error('Invalid amount provided');
      }

      // Create order via backend API
      const response = await apiService.createPaymentOrder(amount, currency);
      
      console.log('Order created successfully:', response.data.order);
      return response.data.order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order. Please try again.');
    }
  }

  // Verify payment signature - This should be done on your backend for security
  public async verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<boolean> {
    try {
      console.log('Verifying payment:', { orderId, paymentId, signature });
      
      // Validate inputs
      if (!orderId || !paymentId || !signature) {
        console.error('Missing required parameters for payment verification');
        return false;
      }
      
      // In production, this verification should happen on your backend
      // using the Razorpay secret key for security
      const response = await apiService.verifyPayment({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      });
      
      console.log('Payment verification result:', response.data.isAuthentic);
      return response.data.isAuthentic;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  }

  // Initialize Razorpay payment
  public async initiatePayment(options: Omit<RazorpayOptions, 'key'>): Promise<void> {
    try {
      console.log('Initiating payment with options:', options);
      
      const scriptLoaded = await this.loadRazorpayScript();
      
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script. Please check your internet connection and try again.');
      }

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not available. Please refresh the page and try again.');
      }

      // Validate required options
      if (!options.amount || options.amount <= 0) {
        throw new Error('Invalid payment amount');
      }

      if (!options.order_id) {
        throw new Error('Order ID is required');
      }

      const razorpayOptions: RazorpayOptions = {
        key: RAZORPAY_KEY_ID,
        ...options,
        theme: {
          color: '#8B7355', // Your brand color
          ...options.theme,
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed by user');
            options.modal?.ondismiss?.();
          },
          ...options.modal,
        },
        retry: {
          enabled: true,
          max_count: 3,
          ...options.retry,
        },
        timeout: 300, // 5 minutes timeout
        remember_customer: false,
      };

      console.log('Opening Razorpay with options:', razorpayOptions);
      
      const razorpay = new window.Razorpay(razorpayOptions);
      
      // Handle payment failure
      razorpay.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error);
        const error = new Error(response.error.description || 'Payment failed');
        throw error;
      });
      
      razorpay.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      throw error instanceof Error ? error : new Error('Failed to open payment gateway');
    }
  }

  // Utility method to format amount for display
  public static formatAmount(amount: number): string {
    return `₹${amount.toFixed(2)}`;
  }

  // Utility method to convert amount to paise
  public static toPaise(amount: number): number {
    return Math.round(amount * 100);
  }

  // Utility method to convert paise to rupees
  public static toRupees(paise: number): number {
    return paise / 100;
  }
}

export const razorpayService = RazorpayService.getInstance();