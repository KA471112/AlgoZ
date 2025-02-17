import React from "react";
import Navbar from "./landing/Navbar";
import HeroSection from "./landing/HeroSection";
import ProductGrid from "./landing/ProductGrid";
import FeaturesSection from "./landing/FeaturesSection";
import SocialProof from "./landing/SocialProof";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Add top padding to account for fixed navbar */}
      <main className="pt-20">
        <HeroSection />

        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Trading Solutions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto px-4">
              Choose from our range of professional trading tools and services
            </p>
          </div>
          <ProductGrid />
        </div>

        <FeaturesSection />
        <SocialProof />
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} AlgoZ Trading Platform. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
