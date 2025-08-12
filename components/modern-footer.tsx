"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react"

export function ModernFooter() {
  const { t } = useTranslation()

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" },
  ]

  return (
    <footer className="relative mt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
        <div className="absolute top-0 right-1/4 w-64 h-64 gradient-secondary rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">PC</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  PriceCompare
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">{t("footerDesc")}</p>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="h-10 w-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center hover:gradient-primary hover:text-white transition-all duration-300 text-slate-700 dark:text-slate-300"
                  >
                    <social.icon className="h-4 w-4" />
                    <span className="sr-only">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 text-primary">{t("categories")}</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { href: "/search?category=groceries", label: t("groceries") },
                  { href: "/search?category=food", label: t("foodDelivery") },
                  { href: "/search?category=medicines", label: t("medicines") },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 text-primary">{t("support")}</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { href: "/help", label: t("help") },
                  { href: "/contact", label: t("contact") },
                  { href: "/privacy", label: t("privacy") },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 text-primary">{t("company")}</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { href: "/about", label: t("about") },
                  { href: "/careers", label: t("careers") },
                  { href: "/terms", label: t("terms") },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="border-t border-slate-200 dark:border-slate-700 mt-12 pt-8 text-center"
          >
            <p className="text-sm text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2">
              &copy; 2024 PriceCompare. {t("allRightsReserved")} Made with
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              >
                <Heart className="h-4 w-4 text-red-500 fill-current" />
              </motion.span>
              for better shopping.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
