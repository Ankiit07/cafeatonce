import React from 'react';
import {
  Coffee,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Coffee className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Cafe at Once</span>
            </div>
            <p className="text-gray-400 text-sm">
              Premium coffee concentrates for the modern professional. Coffee in
              5 seconds, whenever you need it.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link
                to="/products"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Products
              </Link>
              <Link
                to="/insights"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Coffee Insights
              </Link>
              <Link
                to="/about"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <div className="space-y-2">
              <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                Shipping Policy
              </div>
              <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                Return Policy
              </div>
              <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                Terms & Conditions
              </div>
              <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                Privacy Policy
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-gray-400">cafeatoncebusiness@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-gray-400">+917979837079</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-gray-400">Mumbai, MH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Get the latest updates on new products and exclusive offers.
            </p>
            <div className="flex rounded-lg overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
              />
              <button className="bg-primary hover:bg-primary-dark px-6 py-2 font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Cafe at Once. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;