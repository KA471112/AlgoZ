import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Broker {
  id: string;
  name: string;
  logo: string;
}

interface BrokerSelectionProps {
  title: string;
  description?: string;
  onBrokerSelect: (brokerId: string) => void;
  selectedBrokerId?: string;
}

export default function BrokerSelection({
  title,
  description,
  onBrokerSelect,
  selectedBrokerId,
}: BrokerSelectionProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const brokers: Broker[] = [
    {
      id: "dhan",
      name: "Dhan",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=DH",
    },
    {
      id: "zerodha",
      name: "Zerodha",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=ZR",
    },
    {
      id: "upstox",
      name: "Upstox",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=UP",
    },
    {
      id: "angelone",
      name: "Angel One",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=AO",
    },
  ];

  const filteredBrokers = brokers.filter((broker) =>
    broker.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-full">
      {/* Left Panel */}
      <div className="w-80 border-r border-border h-full flex flex-col">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-1">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search brokers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {filteredBrokers.map((broker) => (
            <button
              key={broker.id}
              onClick={() => onBrokerSelect(broker.id)}
              className={cn(
                "w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors",
                selectedBrokerId === broker.id && "bg-accent",
              )}
            >
              <img
                src={broker.logo}
                alt={broker.name}
                className="w-8 h-8 rounded"
              />
              <span>{broker.name}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <Button className="w-full" disabled={!selectedBrokerId}>
            Continue
          </Button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 p-6">
        {selectedBrokerId ? (
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-4">
              Connect your{" "}
              {brokers.find((b) => b.id === selectedBrokerId)?.name} account
            </h3>
            {/* Add broker-specific authentication form here */}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            Select a broker to continue
          </div>
        )}
      </div>
    </div>
  );
}
