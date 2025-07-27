import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Coffee, Clock, Truck, CreditCard, HelpCircle } from 'lucide-react';
import { whatsappService } from '../services/whatsappService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: string[];
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setTimeout(() => {
        addBotMessage(
          "Hi! 👋 I'm your Cafe at Once assistant. How can I help you today?",
          [
            "Product Information",
            "Pricing & Offers",
            "Shipping & Delivery",
            "Health Benefits",
            "How to Use",
            "Contact Support"
          ]
        );
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (text: string, options?: string[]) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      options,
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
  };

  const handleBotResponse = (userInput: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const input = userInput.toLowerCase();
      
      if (input.includes('product') || input.includes('coffee') || input.includes('concentrate')) {
        addBotMessage(
          "We offer premium coffee concentrates! ☕\n\n• Cafe at Once Latte - ₹199\n• Cafe at Once Americano - ₹199\n• Cafe at Once Tea & Coffee - ₹199\n• Cafe at Once Mocha - ₹199\n• Cafe at Once Espresso - ₹379\n• Cafe at Once Cold Brew II - ₹199\n\nAll our products are sugar-free, gluten-free, and made from 100% Arabica beans!",
          ["View Products", "Health Benefits", "How to Order"]
        );
      } else if (input.includes('price') || input.includes('cost') || input.includes('offer')) {
        addBotMessage(
          "Our pricing is very affordable! 💰\n\n• Most products: ₹199 each\n• Premium Espresso: ₹379\n• Free shipping on orders above ₹1000\n• Subscribe & Save 15% on every order\n• Special bulk discounts available\n\nWould you like to know about our subscription offers?",
          ["Subscription Details", "Bulk Orders", "Current Offers"]
        );
      } else if (input.includes('shipping') || input.includes('delivery')) {
        addBotMessage(
          "We offer fast and reliable delivery! 🚚\n\n• Standard Delivery: 3-5 business days\n• Express Delivery: 1-2 business days (₹50 extra)\n• Free shipping on orders above ₹1000\n• Cash on Delivery available (₹25 charges)\n• Pan-India delivery\n\nWe serve 50+ cities across India!",
          ["Track Order", "Delivery Areas", "COD Information"]
        );
      } else if (input.includes('health') || input.includes('benefit') || input.includes('sugar') || input.includes('gluten')) {
        addBotMessage(
          "Cafe at Once is India's healthiest coffee! 🌿\n\n✅ 100% Sugar-Free\n✅ Gluten-Free\n✅ No artificial additives\n✅ 100% Natural Arabica beans\n✅ Rich in antioxidants\n✅ Boosts metabolism\n✅ Enhances mental alertness\n\nPerfect for diabetics and health-conscious individuals!",
          ["Nutritional Info", "Diabetic Friendly", "Ingredients"]
        );
      } else if (input.includes('how') || input.includes('use') || input.includes('prepare')) {
        addBotMessage(
          "Super easy to use! Just 3 steps: 🎯\n\n1️⃣ PEEL - Open the concentrate tube\n2️⃣ PRESS - Squeeze into hot/cold water\n3️⃣ GO - Enjoy perfect coffee in 5 seconds!\n\n• Use 4-6 oz water for strong coffee\n• Use 6-8 oz water for mild coffee\n• Works with hot or cold water\n• No stirring required!",
          ["Video Tutorial", "Recipe Ideas", "Storage Tips"]
        );
      } else if (input.includes('contact') || input.includes('support') || input.includes('help')) {
        addBotMessage(
          "We're here to help! 📞\n\n• Phone: +91-7979837079\n• Email: cafeatoncebusiness@gmail.com\n• WhatsApp: Available 24/7\n• Business Hours: Mon-Fri 9AM-6PM\n• Response Time: Within 24 hours\n\nYou can also reach us through our contact page!",
          ["Call Now", "Send Email", "WhatsApp Chat"]
        );
      } else if (input.includes('subscription') || input.includes('subscribe')) {
        addBotMessage(
          "Save with our subscription! 💝\n\n• 15% off on every delivery\n• Free shipping always\n• Flexible delivery schedule\n• Cancel or modify anytime\n• No minimum commitment\n• Priority customer support\n\nChoose weekly, bi-weekly, or monthly delivery!",
          ["Start Subscription", "Subscription Benefits", "Modify Subscription"]
        );
      } else if (input.includes('order') || input.includes('buy') || input.includes('purchase')) {
        addBotMessage(
          "Ready to order? Here are your options! 🛒\n\n1. Order online at our website\n2. WhatsApp us directly for quick ordering\n3. Call us at +91-7979837079\n\nPayment options:\n• Online payment (Cards, UPI, Net Banking)\n• Cash on Delivery (₹25 charges)\n\nWhich method would you prefer?",
          ["Order Online", "WhatsApp Order", "Call to Order"]
        );
      } else {
        addBotMessage(
          "I'd be happy to help! Here are some common topics I can assist with:",
          [
            "Product Information",
            "Pricing & Offers", 
            "Shipping & Delivery",
            "Health Benefits",
            "How to Use",
            "Contact Support"
          ]
        );
      }
    }, 1000);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addUserMessage(inputValue);
      handleBotResponse(inputValue);
      setInputValue('');
    }
  };

  const handleOptionClick = (option: string) => {
    addUserMessage(option);
    handleBotResponse(option);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-32 z-50 group">
        <button
        onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white p-5 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:animate-bounce animate-pulse"
        title="Chat with our AI assistant"
      >
        <MessageCircle className="h-8 w-8 transition-transform duration-300" />
        </button>
        
        {/* Chatbot Label */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none">
          AI Assistant
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-32 w-80 h-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col border border-gray-200">
      {/* Header */}
      <div className="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">☕ Cafe at Once Assistant</h3>
            <p className="text-xs opacity-90">Always here to help!</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'} rounded-lg p-3`}>
              <div className="flex items-start space-x-2">
                {message.sender === 'bot' && <Bot className="h-4 w-4 mt-0.5 text-primary" />}
                {message.sender === 'user' && <User className="h-4 w-4 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  {message.options && (
                    <div className="mt-2 space-y-1">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="block w-full text-left text-xs bg-white text-primary border border-primary rounded px-2 py-1 hover:bg-primary hover:text-white transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-primary" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;