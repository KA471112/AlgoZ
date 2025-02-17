import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import PricingSection from "./PricingSection";

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("home");
  const [zCoins, setZCoins] = useState(1000); // Initial Z Coins balance

  // Handle route changes
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the # symbol
      setCurrentPage(hash || "home");
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader zCoins={zCoins} />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          {currentPage === "pricing" && <PricingSection />}
          {currentPage === "home" && <div>Welcome to Dashboard</div>}
        </main>
      </div>
    </div>
  );
}
