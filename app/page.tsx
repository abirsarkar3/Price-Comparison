// app/page.tsx
import { ModernHero } from "@/components/modern-hero";
import { PlatformShowcase } from "@/components/platform-showcase";
import { ModernFooter } from "@/components/modern-footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <ModernHero />
      <PlatformShowcase />
      <ModernFooter />
    </main>
  );
}
