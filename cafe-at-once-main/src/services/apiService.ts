import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { supabaseService } from './supabaseService';

interface ApiResponse<T = any> {
  status: 'success' | 'error' | 'fail';
  data?: T;
  message?: string;
  token?: string;
  results?: number;
  totalResults?: number;
}

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      // Handle CORS and mixed content issues
      withCredentials: true,
    });

    // Load token from localStorage
    this.token = localStorage.getItem('authToken');
    if (this.token) {
      this.setAuthHeader(this.token);
    }

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('API Response Error:', error.response?.data || error.message);
        
        // Handle authentication errors
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/account';
        }
        
        return Promise.reject(error);
      }
    );
  }

  private setAuthHeader(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  private clearAuthHeader() {
    delete this.api.defaults.headers.common['Authorization'];
  }

  // Auth methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/auth/register', userData);
      
      if (response.data.token) {
        this.setToken(response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async login(credentials: { email: string; password: string }): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/auth/login', credentials);
      
      if (response.data.token) {
        this.setToken(response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/auth/logout');
      this.clearToken();
      return response.data;
    } catch (error: any) {
      this.clearToken(); // Clear token even if logout fails
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset request failed');
    }
  }

  // Product methods
  async getProducts(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }): Promise<ApiResponse> {
    try {
      // Try Supabase first, fallback to API
      try {
        const result = await supabaseService.getProducts(params);
        return {
          status: 'success',
          data: { products: result.products },
          totalResults: result.totalResults,
        };
      } catch (supabaseError) {
        console.log('Supabase unavailable, trying API fallback...');
        const response = await this.api.get('/products', { params });
        return response.data;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  }

  async getProduct(id: string): Promise<ApiResponse> {
    try {
      // Try Supabase first, fallback to API
      try {
        const product = await supabaseService.getProduct(id);
        return {
          status: 'success',
          data: { product },
        };
      } catch (supabaseError) {
        console.log('Supabase unavailable, trying API fallback...');
        const response = await this.api.get(`/products/${id}`);
        return response.data;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  }

  async getFeaturedProducts(): Promise<ApiResponse> {
    try {
      // Try Supabase first, fallback to API
      try {
        const products = await supabaseService.getFeaturedProducts();
        return {
          status: 'success',
          data: { products },
        };
      } catch (supabaseError) {
        console.log('Supabase unavailable, trying API fallback...');
        const response = await this.api.get('/products/featured');
        return response.data;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }

  async getProductsByCategory(category: string): Promise<ApiResponse> {
    try {
      // Try Supabase first, fallback to API
      try {
        const products = await supabaseService.getProductsByCategory(category);
        return {
          status: 'success',
          data: { products },
        };
      } catch (supabaseError) {
        console.log('Supabase unavailable, trying API fallback...');
        const response = await this.api.get(`/products/category/${category}`);
        return response.data;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products by category');
    }
  }

  async searchProducts(query: string, filters?: any): Promise<ApiResponse> {
    try {
      const response = await this.api.get('/products/search', {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Search failed');
    }
  }

  // Order methods
  async createOrder(orderData: {
    items: Array<{
      product: string;
      quantity: number;
      type: 'single' | 'subscription';
    }>;
    customerInfo: {
      name: string;
      email: string;
      phone?: string;
    };
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      phone?: string;
    };
    paymentMethod: 'online' | 'cod';
    paymentDetails?: {
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
      razorpaySignature?: string;
    };
  }): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/payments/create-order-from-cart', orderData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  }

  async getOrders(): Promise<ApiResponse> {
    try {
      const response = await this.api.get('/orders');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  }

  async getOrder(id: string): Promise<ApiResponse> {
    try {
      const response = await this.api.get(`/orders/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
  }

  async trackOrder(orderNumber: string): Promise<ApiResponse> {
    try {
      const response = await this.api.get(`/orders/track/${orderNumber}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to track order');
    }
  }

  // Payment methods
  async createPaymentOrder(amount: number, currency = 'INR'): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/payments/create-order', {
        amount,
        currency,
        receipt: `receipt_${Date.now()}`,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create payment order');
    }
  }

  async verifyPayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/payments/verify', paymentData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  }

  async getPaymentStatus(paymentId: string): Promise<ApiResponse> {
    try {
      const response = await this.api.get(`/payments/status/${paymentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get payment status');
    }
  }

  // Cart methods (if using server-side cart)
  async getCart(): Promise<ApiResponse> {
    try {
      const response = await this.api.get('/cart');
      return response.data;
    } catch (error: any) {
      // If cart endpoint doesn't exist, return empty cart
      return { status: 'success', data: { items: [] } };
    }
  }

  async addToCart(productId: string, quantity: number, type: 'single' | 'subscription' = 'single'): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/cart/add', {
        productId,
        quantity,
        type,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add to cart');
    }
  }

  async updateCartItem(productId: string, quantity: number): Promise<ApiResponse> {
    try {
      const response = await this.api.put('/cart/update', {
        productId,
        quantity,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update cart item');
    }
  }

  async removeFromCart(productId: string): Promise<ApiResponse> {
    try {
      const response = await this.api.delete(`/cart/remove/${productId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove from cart');
    }
  }

  async clearCart(): Promise<ApiResponse> {
    try {
      const response = await this.api.delete('/cart/clear');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to clear cart');
    }
  }

  // Contact methods
  async sendContactMessage(messageData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    category: string;
  }): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/contact/send', messageData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  }

  // User methods
  async getUserProfile(): Promise<ApiResponse> {
    try {
      const response = await this.api.get('/users/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }

  async updateUserProfile(userData: {
    name?: string;
    email?: string;
    phone?: string;
  }): Promise<ApiResponse> {
    try {
      const response = await this.api.put('/users/profile', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  async getUserAddresses(): Promise<ApiResponse> {
    try {
      const response = await this.api.get('/users/addresses');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch addresses');
    }
  }

  async addUserAddress(address: {
    type: 'home' | 'work' | 'other';
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
  }): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/users/addresses', address);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add address');
    }
  }

  // Subscription methods
  async getSubscriptions(): Promise<ApiResponse> {
    try {
      const response = await this.api.get('/subscriptions');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch subscriptions');
    }
  }

  async createSubscription(subscriptionData: {
    products: Array<{ product: string; quantity: number }>;
    frequency: 'weekly' | 'biweekly' | 'monthly';
    shippingAddress: any;
    paymentMethod: string;
  }): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/subscriptions', subscriptionData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create subscription');
    }
  }

  async updateSubscription(id: string, updates: any): Promise<ApiResponse> {
    try {
      const response = await this.api.put(`/subscriptions/${id}`, updates);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update subscription');
    }
  }

  async cancelSubscription(id: string, reason?: string): Promise<ApiResponse> {
    try {
      const response = await this.api.delete(`/subscriptions/${id}`, {
        data: { reason }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to cancel subscription');
    }
  }

  // Token management
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
    this.setAuthHeader(token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
    this.clearAuthHeader();
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!this.token;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error: any) {
      throw new Error('Backend server is not responding');
    }
  }
}

export const apiService = new ApiService();
export default apiService;