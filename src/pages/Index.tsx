import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ContentSections } from "@/components/landing/ContentSections";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10">
      <Navbar />
      <Hero />
      <ContentSections />
      <Footer />
    </div>
  );
};

export default Index;