"use client"
import { ModernHeader } from "@/components/modern-header"
import { ProfileTabs } from "@/components/profile-tabs"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "react-i18next"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('saved') ? 'saved' : 'saved'

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <ModernHeader />
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] pt-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <ModernHeader />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-3 text-white">{t("profile")}</h1>
                <p className="text-slate-300 text-lg">{t("manageAccount") || "Manage your account and preferences"}</p>
                {user?.email && (
                  <p className="text-slate-400 text-sm mt-2">Logged in as: {user.email}</p>
                )}
              </div>
              <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30">
              <p className="text-blue-200 text-sm">
                💡 <strong>Tip:</strong> Use the profile icon in the header to quickly access your saved items, cart, and settings!
              </p>
            </div>
          </div>

          <ProfileTabs defaultTab={defaultTab} />
        </div>
      </main>
    </div>
  )
}
