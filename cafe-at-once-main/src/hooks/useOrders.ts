import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    sku: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'online' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
}

export function useOrders() {
  const [state, setState] = useState<{
    orders: Order[];
    loading: boolean;
    error: string | null;
  }>({
    orders: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await apiService.getOrders();
        
        if (isMounted) {
          setState({
            orders: response.data?.orders || [],
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            orders: [],
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch orders',
          });
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const refetch = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await apiService.getOrders();
      
      setState({
        orders: response.data?.orders || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
      }));
    }
  };

  return { ...state, refetch };
}

export function useOrder(id: string) {
  const [state, setState] = useState<{
    order: Order | null;
    loading: boolean;
    error: string | null;
  }>({
    order: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      if (!id) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await apiService.getOrder(id);
        
        if (isMounted) {
          setState({
            order: response.data?.order || null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            order: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch order',
          });
        }
      }
    };

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return state;
}

export function useOrderTracking(orderNumber: string) {
  const [state, setState] = useState<{
    trackingInfo: any;
    loading: boolean;
    error: string | null;
  }>({
    trackingInfo: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const trackOrder = async () => {
      if (!orderNumber) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await apiService.trackOrder(orderNumber);
        
        if (isMounted) {
          setState({
            trackingInfo: response.data?.tracking || null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            trackingInfo: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to track order',
          });
        }
      }
    };

    trackOrder();

    return () => {
      isMounted = false;
    };
  }, [orderNumber]);

  return state;
}