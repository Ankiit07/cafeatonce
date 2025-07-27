import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import { whatsappService } from '../services/whatsappService';
import { apiService } from '../services/apiService';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await apiService.sendContactMessage(formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error - could show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-cream py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Message Sent!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  subject: '',
                  message: '',
                  category: 'general'
                });
              }}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-primary/20 to-primary-dark/20 rounded-full blur-3xl animate-pulse"></div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 relative z-10 animate-fade-in">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed relative z-10 animate-slide-up">
            Have questions about our products or need support? We're here to help you 
            get the perfect coffee experience.
          </p>
          <div className="absolute -bottom-4 right-1/4 w-16 h-16 bg-gradient-to-r from-amber-400/30 to-orange-500/30 rounded-full blur-2xl animate-bounce"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-dark/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 relative z-10">Contact Information</h2>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300 group/item">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover/item:bg-primary group-hover/item:scale-110 transition-all duration-300">
                    <Mail className="h-6 w-6 text-primary group-hover/item:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">{whatsappService.getBusinessEmail()}</p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300 group/item">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover/item:bg-primary group-hover/item:scale-110 transition-all duration-300">
                    <Phone className="h-6 w-6 text-primary group-hover/item:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">+{whatsappService.getBusinessNumber()}</p>
                    <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM IST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300 group/item">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover/item:bg-primary group-hover/item:scale-110 transition-all duration-300">
                    <MapPin className="h-6 w-6 text-primary group-hover/item:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Address</h3>
                    <p className="text-gray-600">
                      Powai<br />
                      Mumbai, MH 400076
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300 group/item">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover/item:bg-primary group-hover/item:scale-110 transition-all duration-300">
                    <Clock className="h-6 w-6 text-primary group-hover/item:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 relative z-10">Quick Help</h3>
              <div className="space-y-4 relative z-10">
                {[
                  'How do I use coffee concentrates?',
                  'What\'s included in my order?',
                  'How do I modify my order?',
                  'What are your shipping policies?'
                ].map((question, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary-light hover:shadow-md transition-all duration-300 group/faq transform hover:scale-102"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 group-hover/faq:text-primary-dark transition-colors duration-300">{question}</span>
                      <HelpCircle className="h-4 w-4 text-gray-400 group-hover/faq:text-primary group-hover/faq:rotate-12 transition-all duration-300" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-primary-dark/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-8 relative z-10">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-gray-400"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-gray-400"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-gray-400"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="order">Order Support</option>
                    <option value="technical">Technical Issue</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-gray-400"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all duration-300 hover:border-gray-400"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 text-white py-4 px-8 rounded-lg font-medium transition-all duration-300 flex items-center justify-center transform hover:scale-105 hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Support Options */}
        <div className="mt-16 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-12 transform hover:scale-105 transition-all duration-500 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="text-center">
            <MessageCircle className="h-16 w-16 mx-auto mb-6 animate-bounce" />
            <h2 className="text-3xl font-bold mb-6">Need Immediate Help?</h2>
            <p className="text-primary-light mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
              For urgent matters or immediate assistance, you can also reach us through 
              our social media channels or live chat during business hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-white text-primary hover:bg-cream-dark px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Start Live Chat
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                Call Now: +{whatsappService.getBusinessNumber()}
              </button>
              <div className="w-full max-w-xs mx-auto">
                <WhatsAppButton
                  type="chat"
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 relative"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;