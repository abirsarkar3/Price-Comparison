"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next"
import { Heart, Bell, Search, Settings, ShoppingCart, Trash2, Plus, ExternalLink } from "lucide-react"
import LocationDisplay from "@/components/location-display"
import { useCart } from "@/hooks/useCart"
import { useState, useEffect } from "react"

interface ProfileTabsProps {
  defaultTab?: string
}

export function ProfileTabs({ defaultTab = "saved" }: ProfileTabsProps) {
  const { t } = useTranslation()
  const { cart, removeFromCart, clearCart } = useCart()
  const [savedItems, setSavedItems] = useState<any[]>([])
  const [searchHistory, setSearchHistory] = useState<any[]>([])

  // Load saved items and search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedItems')
    const history = localStorage.getItem('searchHistory')
    
    if (saved) {
      setSavedItems(JSON.parse(saved))
    }
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  const handleSaveItem = (item: any) => {
    const newSavedItems = [...savedItems, item]
    setSavedItems(newSavedItems)
    localStorage.setItem('savedItems', JSON.stringify(newSavedItems))
  }

  const handleRemoveSavedItem = (itemId: string) => {
    const newSavedItems = savedItems.filter(item => item.id !== itemId)
    setSavedItems(newSavedItems)
    localStorage.setItem('savedItems', JSON.stringify(newSavedItems))
  }

  const handleClearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-sm border border-slate-700 mb-8">
        <TabsTrigger 
          value="saved"
          className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 data-[state=active]:border-yellow-500"
        >
          <Heart className="h-4 w-4 mr-2" />
          {t("saved") || "Saved"}
        </TabsTrigger>
        <TabsTrigger 
          value="cart"
          className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {t("cart") || "Cart"}
        </TabsTrigger>
        <TabsTrigger 
          value="alerts"
          className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 data-[state=active]:border-green-500"
        >
          <Bell className="h-4 w-4 mr-2" />
          {t("alerts") || "Alerts"}
        </TabsTrigger>
        <TabsTrigger 
          value="history"
          className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 data-[state=active]:border-purple-500"
        >
          <Search className="h-4 w-4 mr-2" />
          {t("history") || "History"}
        </TabsTrigger>
        <TabsTrigger 
          value="settings"
          className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400 data-[state=active]:border-indigo-500"
        >
          <Settings className="h-4 w-4 mr-2" />
          {t("settings") || "Settings"}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="saved" className="space-y-6">
        <Card className="bg-white/10 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center justify-between">
              {t("savedProducts") || "Saved Products"}
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.location.href = '/search'}
                className="bg-blue-600/20 border-blue-500 text-blue-400 hover:bg-blue-600/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add More
              </Button>
            </CardTitle>
            <CardDescription className="text-slate-300">
              {t("savedProductsDesc") || "Products you've saved for later"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {savedItems.length > 0 ? (
              <div className="space-y-4">
                {savedItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-slate-600">
                                            <div className="flex items-center space-x-4">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name || 'Product'} 
                              className="h-12 w-12 rounded-lg object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=200&fit=crop";
                              }}
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{item.name?.charAt(0) || 'P'}</span>
                            </div>
                          )}
                          <div>
                            <h4 className="text-white font-medium">{item.name || 'Product'}</h4>
                            <p className="text-slate-400 text-sm">{item.platform || 'Platform'}</p>
                            {item.price && item.price > 0 ? (
                              <p className="text-green-400 font-medium">₹{item.price}</p>
                            ) : (
                              <p className="text-slate-400 text-sm">Price not available</p>
                            )}
                          </div>
                        </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-green-600/20 border-green-500 text-green-400 hover:bg-green-600/30"
                        onClick={() => {
                          if (item.link) {
                            window.open(item.link, '_blank');
                          } else {
                            // If no link, redirect to search
                            const searchParams = new URLSearchParams();
                            if (item.name) searchParams.set('q', item.name);
                            if (item.platform) searchParams.set('category', item.platform);
                            window.location.href = `/search?${searchParams.toString()}`;
                          }
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {item.link ? 'View' : 'Search'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleRemoveSavedItem(item.id || index.toString())}
                        className="bg-red-600/20 border-red-500 text-red-400 hover:bg-red-600/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-400 text-lg">{t("noSavedProducts") || "No saved products yet"}</p>
                <p className="text-slate-500 text-sm mt-2">Start saving products to see them here</p>
                <Button 
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.location.href = '/search'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Item
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="cart" className="space-y-6">
        <Card className="bg-white/10 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center justify-between">
              {t("cartItems") || "Cart Items"}
              {cart.length > 0 && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={clearCart}
                  className="bg-red-600/20 border-red-500 text-red-400 hover:bg-red-600/30"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              )}
            </CardTitle>
            <CardDescription className="text-slate-300">
              {t("cartItemsDesc") || "Items in your shopping cart"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-slate-600">
                                            <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{item.item?.charAt(0) || 'I'}</span>
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{item.item || 'Item'}</h4>
                            <p className="text-slate-400 text-sm">{item.platform || 'Platform'}</p>
                            <div className="flex items-center space-x-2">
                              {item.price && (
                                <p className="text-green-400 font-medium">₹{item.price}</p>
                              )}
                              {item.delivery_fee && (
                                <p className="text-slate-400 text-sm">+ ₹{item.delivery_fee} delivery</p>
                              )}
                            </div>
                          </div>
                        </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-500">
                        Qty: {item.quantity || 1}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => removeFromCart(item)}
                        className="bg-red-600/20 border-red-500 text-red-400 hover:bg-red-600/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-slate-600">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">Total Items:</span>
                      <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-500">
                        {cart.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">Total Cost:</span>
                      <span className="text-green-400 font-bold">
                        ₹{cart.reduce((total, item) => total + (item.price || 0) + (item.delivery_fee || 0), 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-400 text-lg">{t("cartEmpty") || "Your cart is empty"}</p>
                <p className="text-slate-500 text-sm mt-2">Start adding items to your cart</p>
                <Button 
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.location.href = '/search'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Items to Cart
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="alerts" className="space-y-6">
        <Card className="bg-white/10 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">{t("priceAlerts") || "Price Alerts"}</CardTitle>
            <CardDescription className="text-slate-300">
              {t("priceAlertsDesc") || "Get notified when prices drop"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Bell className="h-16 w-16 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-400 text-lg">{t("noPriceAlerts") || "No price alerts set"}</p>
              <p className="text-slate-500 text-sm mt-2">Set up alerts to get notified about price drops</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history" className="space-y-6">
        <Card className="bg-white/10 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center justify-between">
              {t("searchHistory") || "Search History"}
              {searchHistory.length > 0 && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleClearHistory}
                  className="bg-red-600/20 border-red-500 text-red-400 hover:bg-red-600/30"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear History
                </Button>
              )}
            </CardTitle>
            <CardDescription className="text-slate-300">
              {t("searchHistoryDesc") || "Your recent searches and comparisons"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {searchHistory.length > 0 ? (
              <div className="space-y-4">
                {searchHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-slate-600">
                                            <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{item.query?.charAt(0) || 'H'}</span>
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{item.query || 'Search'}</h4>
                            <p className="text-slate-400 text-sm">
                              {item.date ? new Date(item.date).toLocaleDateString() : 'Date not available'}
                            </p>
                            {item.category && (
                              <p className="text-slate-500 text-xs">{item.category}</p>
                            )}
                            {item.resultsCount && (
                              <p className="text-slate-500 text-xs">{item.resultsCount} results found</p>
                            )}
                          </div>
                        </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-blue-600/20 border-blue-500 text-blue-400 hover:bg-blue-600/30"
                        onClick={() => {
                          const searchParams = new URLSearchParams();
                          if (item.query) searchParams.set('q', item.query);
                          if (item.category) searchParams.set('category', item.category);
                          if (item.location) searchParams.set('location', item.location);
                          window.location.href = `/search?${searchParams.toString()}`;
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleRemoveSavedItem(index.toString())}
                        className="bg-red-600/20 border-red-500 text-red-400 hover:bg-red-600/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-400 text-lg">{t("noSearchHistory") || "No search history"}</p>
                <p className="text-slate-500 text-sm mt-2">Your search history will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        <Card className="bg-white/10 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">Location</CardTitle>
            <CardDescription className="text-slate-300">
              Manage your saved city and pincode for personalized results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LocationDisplay />
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">{t("preferences") || "Preferences"}</CardTitle>
            <CardDescription className="text-slate-300">
              {t("preferencesDesc") || "Manage your account preferences"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">{t("email") || "Email"}</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                className="bg-white/10 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-slate-300">{t("emailNotifications") || "Email Notifications"}</Label>
                <p className="text-sm text-slate-400">{t("emailNotificationsDesc") || "Receive email updates about deals"}</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-slate-300">{t("pushNotifications") || "Push Notifications"}</Label>
                <p className="text-sm text-slate-400">{t("pushNotificationsDesc") || "Get push notifications for price drops"}</p>
              </div>
              <Switch />
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {t("saveSettings") || "Save Settings"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
