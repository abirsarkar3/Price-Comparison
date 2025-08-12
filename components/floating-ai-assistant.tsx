"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/hooks/use-auth"
import { MessageCircle, X, Minus, Send, Bot, User, ShoppingCart, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: CartOptimization[]
}

interface CartOptimization {
  platform: string
  items: string[]
  totalCost: number
  savings: number
}

export function FloatingAIAssistant() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting message
      const greetingMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: t("aiGreeting"),
        timestamp: new Date(),
      }
      setMessages([greetingMessage])
    }
  }, [isOpen, messages.length, t])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

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
          conversationHistory: messages.slice(-5), // Last 5 messages for context
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.message,
        timestamp: new Date(),
        suggestions: data.optimizations,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("AI Assistant error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: t("aiError"),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplySuggestion = async (optimization: CartOptimization) => {
    try {
      await fetch("/api/apply-cart-optimization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.uid,
          optimization,
        }),
      })

      const confirmMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: t("optimizationApplied"),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, confirmMessage])
    } catch (error) {
      console.error("Apply optimization error:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              <MessageCircle className="h-6 w-6" />
              <span className="sr-only">{t("openAIAssistant")}</span>
            </Button>
            {/* Notification dot for new features */}
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-2 w-2 text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]"
          >
            <Card className="shadow-2xl border-2 border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{t("aiAssistant")}</CardTitle>
                      <p className="text-xs text-muted-foreground">{t("cartOptimizer")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <CardContent className="p-0">
                      {/* Messages */}
                      <ScrollArea className="h-80 px-4">
                        <div className="space-y-4 py-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                            >
                              {message.type === "assistant" && (
                                <div className="h-8 w-8 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Bot className="h-4 w-4 text-white" />
                                </div>
                              )}
                              <div
                                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                                  message.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                {message.suggestions && message.suggestions.length > 0 && (
                                  <div className="mt-3 space-y-2">
                                    {message.suggestions.map((suggestion, index) => (
                                      <div key={index} className="bg-background rounded-lg p-3 border border-border">
                                        <div className="flex items-center justify-between mb-2">
                                          <Badge variant="secondary" className="text-xs">
                                            <ShoppingCart className="h-3 w-3 mr-1" />
                                            {suggestion.platform}
                                          </Badge>
                                          <Badge variant="default" className="text-xs bg-green-500">
                                            {t("save")} ₹{suggestion.savings}
                                          </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-2">
                                          {suggestion.items.join(", ")}
                                        </p>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm font-medium">₹{suggestion.totalCost}</span>
                                          <Button
                                            size="sm"
                                            onClick={() => handleApplySuggestion(suggestion)}
                                            className="h-6 text-xs"
                                          >
                                            {t("applySuggestion")}
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {message.type === "user" && (
                                <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                                  <User className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                          ))}
                          {isLoading && (
                            <div className="flex gap-3 justify-start">
                              <div className="h-8 w-8 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
                                <Bot className="h-4 w-4 text-white" />
                              </div>
                              <div className="bg-muted rounded-lg px-3 py-2">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                  <div
                                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                    style={{ animationDelay: "0.1s" }}
                                  ></div>
                                  <div
                                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>

                      {/* Input */}
                      <div className="border-t p-4">
                        <div className="flex gap-2">
                          <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={t("askAIAssistant")}
                            className="flex-1"
                            disabled={isLoading}
                          />
                          <Button onClick={handleSendMessage} size="sm" disabled={!inputValue.trim() || isLoading}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
