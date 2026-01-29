import {
  Navigation,
  HeroSection,
  BentoGrid,
  HowItWorks,
  RealShowcase,
  FinalCTA,
  Footer
} from "@/src/components/landing";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden 
      bg-background-light dark:bg-background-dark">
      <Navigation />
      <main className="flex-1 flex flex-col">
        {/* 1. Hero WOW (fondo brutal + CTA) */}
        <HeroSection />
        
        {/* 2. Bento Grid de features */}
        <BentoGrid />
        
        {/* 3. Cómo funciona (3 pasos) */}
        <HowItWorks />
        
        {/* 4. Showcase real (cards demo) */}
        <RealShowcase />
        
        {/* 5. CTA final */}
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}