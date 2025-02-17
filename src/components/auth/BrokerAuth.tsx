import React from "react";
import BrokerSelection from "./BrokerSelection";

interface BrokerAuthProps {
  type: "tradingview" | "scalping" | "copytrading";
}

export default function BrokerAuth({ type }: BrokerAuthProps) {
  const [selectedBrokerId, setSelectedBrokerId] = React.useState<string>();

  const titles = {
    tradingview: "Connect TradingView",
    scalping: "Connect Scalping Tool",
    copytrading: "Connect Copy Trading",
  };

  const descriptions = {
    tradingview: "Select your broker to connect with TradingView integration",
    scalping: "Select your broker to enable the scalping tool",
    copytrading: "Select your broker to start copy trading",
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <BrokerSelection
        title={titles[type]}
        description={descriptions[type]}
        selectedBrokerId={selectedBrokerId}
        onBrokerSelect={setSelectedBrokerId}
      />
    </div>
  );
}
