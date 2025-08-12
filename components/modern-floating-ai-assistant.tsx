"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Minimize2, Maximize2, Send, Sparkles, Heart, ShoppingCart, Search, TrendingUp, Zap, Target, MapPin, Clock, DollarSign } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: CartOptimization[];
}

interface CartOptimization {
  platform: string;
  items: string[];
  totalCost: number;
  savings: number;
}

// Generate stable IDs for messages using a counter instead of Date.now()
let messageIdCounter = 0;
const generateMessageId = () => {
  messageIdCounter += 1;
  return `msg_${messageIdCounter}`;
};

export function ModernFloatingAIAssistant() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
    
    // Listen for open AI assistant event from header
    const handleOpenAI = () => setIsOpen(true);
    window.addEventListener('openAIAssistant', handleOpenAI);
    
    return () => {
      window.removeEventListener('openAIAssistant', handleOpenAI);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isClient && isOpen && messages.length === 0) {
      const greetingMessage: Message = {
        id: generateMessageId(),
        type: "assistant",
        content: t("aiGreeting") || "Hello! I'm your AI shopping assistant. I can help you find the best deals and optimize your cart to save money. What would you like to know?",
        timestamp: new Date(),
      };
      setMessages([greetingMessage]);
    }
  }, [isClient, isOpen, messages.length, t]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateMessageId(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          userId: user?.uid,
          language: i18n.language,
          conversationHistory: messages.slice(-5),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        id: generateMessageId(),
        type: "assistant",
        content: data.message,
        timestamp: new Date(),
        suggestions: data.optimizations,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Provide helpful fallback responses based on the user's message
      let fallbackMessage = t("aiError") || "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.";
      
      const messageLower = inputValue.toLowerCase();
      if (messageLower.includes("cart") || messageLower.includes("optimize")) {
        fallbackMessage = "I can help you with cart optimization! Try asking me to 'show best deals' or 'help me save money on my cart'.";
      } else if (messageLower.includes("price") || messageLower.includes("compare")) {
        fallbackMessage = "I can help you compare prices! Try asking me to 'find the best price for [product]' or 'compare prices across platforms'.";
      } else if (messageLower.includes("deal") || messageLower.includes("offer")) {
        fallbackMessage = "I can help you find deals! Try asking me to 'show today\'s best deals' or 'find offers on [product]'.";
      } else if (messageLower.includes("delivery")) {
        fallbackMessage = "I can help with delivery tips! Try asking me for 'delivery optimization tips' or 'how to save on delivery fees'.";
      }

      const errorMessage: Message = {
        id: generateMessageId(),
        type: "assistant",
        content: fallbackMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = async (optimization: CartOptimization) => {
    try {
      const response = await fetch("/api/apply-cart-optimization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          optimization,
          userId: user?.uid,
        }),
      });

      if (response.ok) {
        const successMessage: Message = {
          id: generateMessageId(),
          type: "assistant",
          content: t("aiSuggestionApplied") || "Great! I've applied the optimization to your cart. You should see the savings reflected now!",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, successMessage]);
      }
    } catch (error) {
      console.error("Error applying suggestion:", error);
    }
  };

  const handleSaveItem = (item: string) => {
    // Save item to localStorage for now
    const savedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');
    const newItem = {
      id: Date.now().toString(),
      name: item,
      platform: 'AI Suggestion',
      price: 0,
      date: new Date().toISOString()
    };
    savedItems.push(newItem);
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
    
    const saveMessage: Message = {
      id: generateMessageId(),
      type: "assistant",
      content: `I've saved "${item}" to your saved items! You can view it in your profile.`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, saveMessage]);
  };

  const handleQuickAction = (action: string) => {
    let message = "";
    switch (action) {
      case "best_deals":
        message = "Show me the best deals available today";
        break;
      case "cart_optimize":
        message = "Help me optimize my shopping cart to save money";
        break;
      case "price_compare":
        message = "Compare prices for groceries across different platforms";
        break;
      case "delivery_tips":
        message = "Give me tips for faster and cheaper delivery";
        break;
      default:
        message = action;
    }
    
    setInputValue(message);
    setShowQuickActions(false);
    // Automatically send the message
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    
    // Keyboard shortcuts
    if (e.key === "Escape") {
      setIsOpen(false);
    }
    
    if (e.key === "m" && e.ctrlKey) {
      e.preventDefault();
      setIsMinimized(!isMinimized);
    }
    
    if (e.key === "q" && e.ctrlKey) {
      e.preventDefault();
      setShowQuickActions(!showQuickActions);
    }
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + A to open AI assistant
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyPress);
    return () => window.removeEventListener('keydown', handleGlobalKeyPress);
  }, []);

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in">
      {!isOpen ? (
        <div className="relative group">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-110 border-2 border-white/20 animate-pulse-slow ai-glow"
            size="icon"
          >
            <MessageCircle className="h-7 w-7 text-white" />
          </Button>
          
          {/* Enhanced notification badge */}
          <div className="absolute -top-2 -right-2 h-7 w-7 bg-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce border-2 border-white">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          
          {/* Enhanced hover hint */}
          <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              AI Shopping Assistant
            </div>
            <div className="text-xs text-slate-300 mt-1">Click for help with deals & cart optimization</div>
          </div>
          
          {/* Quick actions tooltip */}
          {showQuickActions && (
            <div className="absolute bottom-full right-0 mb-3 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 p-3 animate-in slide-in-from-bottom-2">
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Quick Actions:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickAction("best_deals")}
                  className="text-xs h-8 bg-green-50 hover:bg-green-100 text-green-700 border-green-200 hover:scale-105 transition-transform"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Best Deals
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickAction("cart_optimize")}
                  className="text-xs h-8 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:scale-105 transition-transform"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Optimize Cart
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickAction("price_compare")}
                  className="text-xs h-8 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 hover:scale-105 transition-transform"
                >
                  <Search className="h-3 w-3 mr-1" />
                  Compare Prices
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickAction("delivery_tips")}
                  className="text-xs h-8 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 hover:scale-105 transition-transform"
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  Delivery Tips
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card className="w-96 shadow-2xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm animate-in slide-in-from-bottom-2">
          <CardContent className="p-0">
            {/* Enhanced Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="font-semibold text-lg">{t("aiAssistant") || "AI Shopping Assistant"}</span>
                  <div className="text-xs text-white/80 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Online • Always here to help
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  title="Quick Actions"
                >
                  <Zap className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Enhanced Quick Stats */}
                <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700 dark:to-blue-900/20 border-b">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="text-xs">
                      <div className="text-slate-600 dark:text-slate-400 mb-1">🛒 Cart Items</div>
                      <div className="font-bold text-blue-600 text-lg">{JSON.parse(localStorage.getItem('cart') || '[]').length}</div>
                    </div>
                    <div className="text-xs">
                      <div className="text-slate-600 dark:text-slate-400 mb-1">❤️ Saved Items</div>
                      <div className="font-bold text-green-600 text-lg">{JSON.parse(localStorage.getItem('savedItems') || '[]').length}</div>
                    </div>
                    <div className="text-xs">
                      <div className="text-slate-600 dark:text-slate-400 mb-1">💰 Total Saved</div>
                      <div className="font-bold text-purple-600 text-lg">₹0</div>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.href = '/profile'}
                      className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    >
                      <Target className="h-3 w-3 mr-1" />
                      View Full Profile
                    </Button>
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      💡 <strong>Tip:</strong> Use Ctrl+Shift+A to quickly open me!
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-3 ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                            : "bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">💡 Smart Suggestions:</p>
                            {message.suggestions.map((suggestion, index) => (
                              <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    {suggestion.platform}
                                  </Badge>
                                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                    Save ₹{suggestion.savings}
                                  </span>
                                </div>
                                <p className="text-xs mb-2 text-slate-700 dark:text-slate-300">
                                  {suggestion.items.join(", ")}
                                </p>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleApplySuggestion(suggestion)}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
                                  >
                                    <ShoppingCart className="h-3 w-3 mr-1" />
                                    Apply
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSaveItem(suggestion.items[0])}
                                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 text-xs"
                                  >
                                    <Heart className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-slate-700 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t bg-white dark:bg-slate-800">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t("aiInputPlaceholder") || "Ask me about deals, cart optimization..."}
                      className="flex-1 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      size="icon"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Quick action buttons */}
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAction("best_deals")}
                      className="text-xs h-7 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Best Deals
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAction("cart_optimize")}
                      className="text-xs h-7 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Optimize
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
