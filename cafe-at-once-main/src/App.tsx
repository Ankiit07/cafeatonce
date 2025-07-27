import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import InsightsPage from './pages/InsightsPage';
import TestimonialsPage from './pages/TestimonialsPage';
import AccountPage from './pages/AccountPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { SupabaseProvider } from './context/SupabaseContext';
import ChatBot from './components/ChatBot';
import WhatsAppButton from './components/WhatsAppButton';
import BackendStatus from './components/BackendStatus';

function App() {
  return (
    <SupabaseProvider>
      <UserProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-cream flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/insights" element={<InsightsPage />} />
                  <Route path="/testimonials" element={<TestimonialsPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                </Routes>
              </main>
              <Footer />
              
              {/* Chat Bot */}
              <ChatBot />
              
              {/* WhatsApp Chat Button - Only show the floating button */}
              <WhatsAppButton type="chat" />
              
              {/* Backend Status Indicator */}
              <BackendStatus />
            </div>
          </Router>
        </CartProvider>
      </UserProvider>
    </SupabaseProvider>
  );
}

export default App;