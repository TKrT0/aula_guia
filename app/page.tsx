import Navbar from "@/src/components/layout/Navbar";
import Hero from "@/src/components/features/home/Hero";
import Features from "@/src/components/features/home/Features";
import Footer from "@/src/components/layout/Footer";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}