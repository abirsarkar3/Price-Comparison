"use client"

import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import Image from "next/image"
import { platformLogos, fallbackLogos } from "@/lib/platformLogos"

export function PlatformShowcase() {
  const { t } = useTranslation()

  const platforms = platformLogos

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-slate-100">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Trusted Platforms
            </span>
          </h2>
          <p className="text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto font-medium">
            Compare prices across India's most popular delivery platforms
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                scale: 1.05,
              }}
              className="group"
            >
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-center">
                {/* Logo Container */}
                <div
                  className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${platform.color} p-2 shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center`}
                >
                  <div className="w-full h-full bg-white/95 dark:bg-white/10 rounded-xl flex items-center justify-center p-2">
                    <Image
                      src={platform.logo}
                      alt={platform.altText}
                      width={60}
                      height={40}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = fallbackLogos[platform.name] || "/platform-placeholder.svg";
                      }}
                      unoptimized={platform.logo.startsWith('data:')}
                    />
                  </div>
                </div>

                {/* Platform Name */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary transition-colors">
                  {platform.name}
                </h3>

                {/* Category Badge */}
                <span className="inline-block px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                  {platform.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Real-time</div>
              <div className="text-slate-700 dark:text-slate-300 font-medium">Price Updates</div>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">100%</div>
              <div className="text-slate-700 dark:text-slate-300 font-medium">Accurate Data</div>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">24/7</div>
              <div className="text-slate-700 dark:text-slate-300 font-medium">Price Monitoring</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
