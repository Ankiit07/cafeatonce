import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import WhatsAppButton from './WhatsAppButton';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  badges?: string[];
  description: string;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  rating,
  reviews,
  badges = [],
  description,
  viewMode = 'grid',
}) => {
  const { dispatch } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id,
        name,
        price,
        image,
        type: 'single',
      },
    });
  };

  if (viewMode === 'list') {
    return (
      <Link to={`/products/${id}`} className="group">
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
          <div className="flex p-4">
            {/* Image */}
            <div className="w-32 h-32 bg-gradient-to-br from-cream to-cream-dark p-4 rounded-lg mr-4 flex-shrink-0">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {name}
                </h3>
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {badges.slice(0, 2).map((badge, index) => (
                      <span
                        key={index}
                        className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-full font-medium"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({reviews})</span>
              </div>

              {/* Price and Add to Cart */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-lg font-bold text-gray-900">₹{priceInINR}</span>
                  <div className="text-xs text-gray-500">
                    <span className="line-through">₹{Math.round(priceInINR * 1.15)}</span>
                    <span className="text-primary ml-1">Save 15%</span>
                  </div>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="p-2 rounded-lg transition-all duration-300 group/btn"
                  style={{ 
                    backgroundColor: '#8B7355'
                  }}
                >
                  <ShoppingCart 
                    className="h-5 w-5 group-hover/btn:scale-110 transition-transform"
                    style={{ color: '#F5F1EB' }}
                  />
                </button>
              </div>
            
              {/* WhatsApp Buy Button */}
              <div className="mt-3">
                <WhatsAppButton
                  type="buy"
                  productName={name}
                  productPrice={price}
                  productImage={image}
                  className="text-sm py-2"
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/products/${id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square bg-gradient-to-br from-cream to-cream-dark p-8">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {badges.length > 0 && (
            <div className="absolute top-2 left-2 space-y-1">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-full font-medium"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({reviews})</span>
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-lg font-bold text-gray-900">₹{price}</span>
              <div className="text-xs text-gray-500">
                <span className="line-through">₹{Math.round(price * 1.18)}</span>
                <span className="text-primary ml-1">Save 15%</span>
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-lg transition-all duration-300 group/btn"
              style={{ 
                backgroundColor: '#8B7355'
              }}
            >
              <ShoppingCart 
                className="h-5 w-5 group-hover/btn:scale-110 transition-transform"
                style={{ color: '#F5F1EB' }}
              />
            </button>
          </div>
          
          {/* WhatsApp Buy Button */}
          <div className="mt-3">
            <WhatsAppButton
              type="buy"
              productName={name}
              productPrice={price}
              productImage={image}
              className="text-sm py-2"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;