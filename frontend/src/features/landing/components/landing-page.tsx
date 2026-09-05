import { LandingNav } from "./landing-nav";
import { HeroSection } from "./hero-section";
import { TrustStrip } from "./trust-strip";
import { FeaturesSection } from "./features-section";
import { PollDemoSection } from "./poll-demo-section";
import { RealTimeSection } from "./real-time-section";
import { AnalyticsSection } from "./analytics-section";
import { HowItWorksSection } from "./how-it-works-section";
import { UseCasesSection } from "./use-cases-section";
import { SecuritySection } from "./security-section";
import { FAQSection } from "./faq-section";
import { CTASection } from "./cta-section";
import { Footer } from "./footer";

export function LandingPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <LandingNav />
      <main>
        <HeroSection />
        <TrustStrip />
        <FeaturesSection />
        <PollDemoSection />
        <RealTimeSection />
        <AnalyticsSection />
        <HowItWorksSection />
        <UseCasesSection />
        <SecuritySection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
