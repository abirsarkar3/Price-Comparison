"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">PriceCompare</h3>
            <p className="text-muted-foreground text-sm">{t("footerDesc")}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("categories")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search?category=groceries" className="text-muted-foreground hover:text-foreground">
                  {t("groceries")}
                </Link>
              </li>
              <li>
                <Link href="/search?category=food" className="text-muted-foreground hover:text-foreground">
                  {t("foodDelivery")}
                </Link>
              </li>
              <li>
                <Link href="/search?category=medicines" className="text-muted-foreground hover:text-foreground">
                  {t("medicines")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("support")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground">
                  {t("help")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  {t("contact")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  {t("privacy")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("company")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                  {t("careers")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 PriceCompare. {t("allRightsReserved")}</p>
        </div>
      </div>
    </footer>
  )
}
