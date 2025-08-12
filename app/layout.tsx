import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/components/i18n-provider";
import { AuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/hooks/useCart";
import { Toaster } from "@/components/ui/toaster";
import { ModernFloatingAIAssistant } from "@/components/modern-floating-ai-assistant";
import { ModernHeader } from "@/components/modern-header";
import LocationPermissionPrompt from "@/components/location-permission-prompt";
import FirebaseHealthCheck from "@/components/firebase-health-check";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PriceCompare - Best Deals Across Platforms",
  description:
    "Compare prices across Zepto, Blinkit, Swiggy, Zomato, Apollo and more. Find the best deals and save money on groceries, food delivery, and medicines.",
  keywords: "price comparison, groceries, food delivery, medicines, deals, coupons",
  authors: [{ name: "PriceCompare Team" }],
  openGraph: {
    title: "PriceCompare - Best Deals Across Platforms",
    description: "Compare prices and find the best deals across multiple platforms",
    type: "website",
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} font-inter`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <AuthProvider>
              <CartProvider>
                <ModernHeader />
                {children}
                <ModernFloatingAIAssistant />
                <LocationPermissionPrompt />
                <FirebaseHealthCheck />
                <Toaster />
              </CartProvider>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
