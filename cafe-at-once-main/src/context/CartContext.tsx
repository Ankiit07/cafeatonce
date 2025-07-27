import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: 'single' | 'subscription';
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_SUBSCRIPTION'; payload: string };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return calculateTotals({ ...state, items: updatedItems });
      }
      
      const newItems = [...state.items, { ...action.payload, quantity: 1 }];
      return calculateTotals({ ...state, items: newItems });
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return calculateTotals({ ...state, items: newItems });
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      return calculateTotals({ ...state, items: newItems });
    }
    
    case 'TOGGLE_SUBSCRIPTION': {
      const newItems = state.items.map(item =>
        item.id === action.payload
          ? { ...item, type: item.type === 'single' ? 'subscription' : 'single' }
          : item
      );
      return calculateTotals({ ...state, items: newItems });
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };
    
    default:
      return state;
  }
};

const calculateTotals = (state: Omit<CartState, 'total' | 'itemCount'>): CartState => {
  const total = state.items.reduce((sum, item) => {
    const itemPrice = item.type === 'subscription' ? item.price * 0.85 : item.price;
    return sum + (itemPrice * item.quantity);
  }, 0);
  
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return { ...state, total, itemCount };
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};