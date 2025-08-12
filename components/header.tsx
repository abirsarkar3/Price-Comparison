"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "react-i18next"
import { User, Menu, X } from "lucide-react"
import CartButton from "@/components/CartButton"
import CartSidebar from "@/components/CartSidebar"

export function Header() {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">PC</span>
            </div>
            <span className="font-bold text-xl">PriceCompare</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              {t("home")}
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              {t("categories")}
            </Link>
            <Link href="/deals" className="text-sm font-medium hover:text-primary transition-colors">
              {t("deals")}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <LanguageToggle />
            <CartButton onClick={() => setCartOpen(true)} />

            {user ? (
              <div className="flex items-center space-x-2">
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {t("profile")}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={signOut}>
                  {t("signOut")}
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button size="sm">{t("signIn")}</Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                {t("home")}
              </Link>
              <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
                {t("categories")}
              </Link>
              <Link href="/deals" className="text-sm font-medium hover:text-primary transition-colors">
                {t("deals")}
              </Link>
            </nav>
          </div>
        )}
        {/* Cart Sidebar Modal */}
        {cartOpen && (
          <div>
            <div
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              onClick={() => setCartOpen(false)}
            />
            <CartSidebar />
          </div>
        )}
      </div>
    </header>
  )
}
