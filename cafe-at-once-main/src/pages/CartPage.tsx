import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { state, dispatch } = useCart();

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const toggleSubscription = (id: string) => {
    dispatch({ type: 'TOGGLE_SUBSCRIPTION', payload: id });
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-cream py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Add some delicious coffee concentrates to get started!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
            >
              Shop Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4"
              >
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-contain rounded-lg bg-cream p-2"
                />

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {item.name}
                  </h3>

                  {/* Subscription Toggle */}
                  <div className="mb-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={item.type === 'subscription'}
                        onChange={() => toggleSubscription(item.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                      />
                      <span className="text-sm text-gray-600">
                        Subscribe & Save 15%
                      </span>
                    </label>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">
                      ₹
                      {(item.type === 'subscription'
                        ? item.price * 0.85
                        : item.price
                      ).toFixed(2)}
                    </span>
                    {item.type === 'subscription' && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-medium w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({state.itemCount} items)
                  </span>
                  <span className="font-medium">
                    ₹
                    {state.items
                      .reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>

                {state.items.some((item) => item.type === 'subscription') && (
                  <div className="flex justify-between text-green-600">
                    <span>Subscription Savings</span>
                    <span>
                      -₹
                      {state.items
                        .filter((item) => item.type === 'subscription')
                        .reduce(
                          (sum, item) =>
                            sum + item.price * 0.15 * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{state.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            {/* Subscription Benefits */}
            {state.items.some((item) => item.type === 'subscription') && (
              <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-6">
                <h3 className="font-semibold mb-3">Subscription Benefits</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    Save 15% on every delivery
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    Free shipping always
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    Cancel or modify anytime
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
