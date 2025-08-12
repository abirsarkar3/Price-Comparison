"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModernThemeToggle } from "@/components/modern-theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import LocationDisplay from "@/components/location-display";

import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "@/hooks/use-location";
import { useTranslation } from "react-i18next";
import {
  Search,
  User,
  Menu,
  X,
  ShoppingCart,
  Utensils,
  Pill,
  Settings,
  Heart,
  LogOut,
  Plus,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export function ModernHeader() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { location } = useLocation();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("groceries");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const locationParam = location
        ? `&location=${encodeURIComponent(location.fullAddress || location.city)}`
        : "";
      router.push(
        `/search?q=${encodeURIComponent(searchQuery)}&category=${category}${locationParam}`
      );
    }
  };

  const categoryIcons = {
    groceries: ShoppingCart,
    food: Utensils,
    medicines: Pill,
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-lg border-b border-slate-200 dark:border-slate-700"
          : "bg-white/10 dark:bg-slate-900/10 backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">PC</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                PriceCompare
              </span>
            </Link>
          </motion.div>

          {/* Location Display */}
          <motion.div
            className="hidden lg:flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <LocationDisplay compact />
          </motion.div>

          {/* Icons & Toggles */}
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <ModernThemeToggle />
            <LanguageToggle />
            
            {/* AI Assistant Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Trigger AI assistant to open
                const event = new CustomEvent('openAIAssistant');
                window.dispatchEvent(event);
              }}
              className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 hover:from-blue-500/30 hover:to-purple-500/30"
              title="AI Shopping Assistant"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">AI Assistant</span>
            </Button>

            {user ? (
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="h-10 w-10 bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center cursor-pointer"
                    >
                      <User className="h-5 w-5 text-slate-900 dark:text-slate-100" />
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                    <DropdownMenuLabel className="text-slate-900 dark:text-slate-100">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{user.email || "User"}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center space-x-2 cursor-pointer">
                        <Settings className="h-4 w-4" />
                        <span>{t("profile")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile?saved=true" className="flex items-center space-x-2 cursor-pointer">
                        <Heart className="h-4 w-4" />
                        <span>{t("saved") || "Saved Items"}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/search" className="flex items-center space-x-2 cursor-pointer">
                        <Plus className="h-4 w-4" />
                        <span>{t("addItems") || "Add Items"}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={signOut}
                      className="flex items-center space-x-2 cursor-pointer text-red-600 dark:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t("signOut")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button
                  size="sm"
                  className="gradient-primary hover:scale-105 transition-transform duration-200 text-white"
                >
                  {t("signIn")}
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg mt-2 p-4 space-y-4"
            >
              <div className="lg:hidden">
                <LocationDisplay compact />
              </div>
              <form onSubmit={handleSearch}>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center p-2">
                  <Search className="h-5 w-5 text-slate-500 dark:text-slate-400 mr-2" />
                  <Input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  />
                </div>
              </form>
              <nav className="flex flex-col space-y-3">
                <Link href="/" className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {t("home")}
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
