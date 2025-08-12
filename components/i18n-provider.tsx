"use client"

import type React from "react"

import { useEffect } from "react"
import i18n from "@/lib/i18n"

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize i18n
    i18n.init()
  }, [])

  return <>{children}</>
}
