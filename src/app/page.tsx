import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ParallaxServices from "@/components/ParallaxServices";
import TransformSection from "@/components/TransformSection";
import ScrollRevealText from "@/components/ScrollRevealText";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://sinapsiscr.com",
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <ParallaxServices />
      <TransformSection />
      <ScrollRevealText />
      <FAQSection />
      <ContactSection />
    </>
  );
}
