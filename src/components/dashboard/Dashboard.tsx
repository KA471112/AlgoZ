import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import PricingSection from "./PricingSection";
import ApiStatus from "./ApiStatus";

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
          {currentPage === "home" && (
            <div className="w-full">
              <div className="p-6 bg-card rounded-lg border border-border mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  Welcome to Dashboard
                </h2>
                <p className="text-muted-foreground">
                  Manage your trading accounts and monitor your performance
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
