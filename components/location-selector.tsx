"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "react-i18next"
import { MapPin, Loader2 } from "lucide-react"

interface LocationSelectorProps {
  onLocationChange: (location: string) => void
}

export function LocationSelector({ onLocationChange }: LocationSelectorProps) {
  const { t } = useTranslation()
  const [location, setLocation] = useState("")
  const [pincode, setPincode] = useState("")
  const [loading, setLoading] = useState(false)

  const detectLocation = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // In a real app, you'd reverse geocode these coordinates
          const mockLocation = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
          setLocation(mockLocation)
          onLocationChange(mockLocation)
          setLoading(false)
        },
        (error) => {
          console.error("Location detection failed:", error)
          setLoading(false)
        },
      )
    } else {
      setLoading(false)
    }
  }

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pincode) {
      setLocation(pincode)
      onLocationChange(pincode)
    }
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">{t("location")}:</span>
            {location && <span className="text-sm text-muted-foreground">{location}</span>}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={detectLocation} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
              {t("detectLocation")}
            </Button>

            <form onSubmit={handlePincodeSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder={t("enterPincode")}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-32"
              />
              <Button type="submit" size="sm">
                {t("set")}
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
