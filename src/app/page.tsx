import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ParallaxServices from "@/components/ParallaxServices";
import TransformSection from "@/components/TransformSection";
import ScrollRevealText from "@/components/ScrollRevealText";
import QuizCTA from "@/components/QuizCTA";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <ParallaxServices />
      <TransformSection />
      <ScrollRevealText />
      <QuizCTA />
      <FAQSection />
      <ContactSection />
    </>
  );
}
