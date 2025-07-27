import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Coffee } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const Header: React.FC = () => {
  const { state: cartState } = useCart();
  const { user, logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUserClick = () => {
    if (user) {
      navigate('/account');
    } else {
      navigate('/account');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-black/10 shadow-sm'
          : 'bg-white/70 backdrop-blur-lg'
      }`}
      style={{
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Coffee 
              className="h-8 w-8 transition-all duration-300 group-hover:scale-105" 
              style={{ color: '#8B7355' }}
            />
            <span
              className="text-lg font-semibold tracking-tight transition-colors duration-300"
              style={{ color: '#8B7355' }}
            >
              Cafe at Once
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Products' },
              { to: '/insights', label: 'Insights' },
              { to: '/testimonials', label: 'Reviews' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-out group overflow-hidden"
                style={{ color: '#8B7355' }}
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-[#F5F1EB]">
                  {item.label}
                </span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-all duration-300 ease-out backdrop-blur-sm rounded-lg"
                  style={{
                    backgroundColor: '#8B7355',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                />
              </Link>
            ))}
          </nav>

          {/* Right side - Cart and User */}
          <div className="flex items-center space-x-2">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg transition-all duration-300 ease-out group overflow-hidden"
              style={{ color: '#8B7355' }}
            >
              <span className="relative z-10">
                <ShoppingCart className="h-5 w-5 transition-all duration-300 group-hover:scale-105 group-hover:text-[#F5F1EB]" />
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-all duration-300 ease-out rounded-lg"
                style={{
                  backgroundColor: '#8B7355',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              />
              {cartState.itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs font-medium rounded-full h-4 w-4 flex items-center justify-center shadow-sm z-20">
                  {cartState.itemCount}
                </span>
              )}
            </Link>

            {/* User */}
            <button
              onClick={handleUserClick}
              className="relative p-2 rounded-lg transition-all duration-300 ease-out group overflow-hidden"
              style={{ color: '#8B7355' }}
            >
              <span className="relative z-10">
                <User className="h-5 w-5 transition-all duration-300 group-hover:scale-105 group-hover:text-[#F5F1EB]" />
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-all duration-300 ease-out rounded-lg"
                style={{
                  backgroundColor: '#8B7355',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative p-2 rounded-lg transition-all duration-300 ease-out group overflow-hidden"
              style={{ color: '#8B7355' }}
            >
              <span className="relative z-10">
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 transition-all duration-300 group-hover:text-[#F5F1EB]" />
                ) : (
                  <Menu className="h-5 w-5 transition-all duration-300 group-hover:text-[#F5F1EB]" />
                )}
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-all duration-300 ease-out rounded-lg"
                style={{
                  backgroundColor: '#8B7355',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-black/10 py-3 bg-white/90 backdrop-blur-xl rounded-b-xl mx-4 mb-2 shadow-lg">
            <div className="space-y-1 px-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Products' },
                { to: '/insights', label: 'Insights' },
                { to: '/testimonials', label: 'Reviews' },
                { to: '/about', label: 'About' },
                { to: '/contact', label: 'Contact' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="relative block py-2.5 px-3 text-sm font-medium rounded-lg transition-all duration-300 group overflow-hidden"
                  style={{ color: '#8B7355' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-[#F5F1EB]">
                    {item.label}
                  </span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-all duration-300 ease-out rounded-lg"
                    style={{
                      backgroundColor: '#8B7355',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  />
                </Link>
              ))}

              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="relative block w-full text-left py-2.5 px-3 text-sm font-medium text-red-600 hover:text-red-700 rounded-lg transition-all duration-300 group overflow-hidden"
                >
                  <span className="relative z-10">Logout</span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-all duration-300 ease-out rounded-lg"
                    style={{
                      backgroundColor: '#ffebee',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
