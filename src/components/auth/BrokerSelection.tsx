import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [showApiForm, setShowApiForm] = useState(false);
  const [apiCredentials, setApiCredentials] = useState({
    appName: "",
    apiKey: "",
    secretKey: "",
    totp: "",
  });
  const [isConnected, setIsConnected] = useState(false);

  const brokers: Broker[] = [
    {
      id: "5paisa",
      name: "5 Paisa",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=5P",
    },
    {
      id: "aliceblue",
      name: "Alice Blue",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=AB",
    },
    {
      id: "angelone",
      name: "Angel One",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=AO",
    },
    {
      id: "dhan",
      name: "Dhan",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=DH",
    },
    {
      id: "finvasia",
      name: "Finvasia",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=FV",
    },
    {
      id: "flattrade",
      name: "Flattrade",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=FT",
    },
    {
      id: "forex",
      name: "Forex",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=FX",
    },
    {
      id: "fyers",
      name: "Fyers",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=FY",
    },
    {
      id: "metatrader4",
      name: "MetaTrader 4",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=MT4",
    },
    {
      id: "metatrader5",
      name: "MetaTrader 5",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=MT5",
    },
    {
      id: "samco",
      name: "Samco",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=SC",
    },
    {
      id: "tradesmart",
      name: "TradeSmart",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=TS",
    },
    {
      id: "upstox",
      name: "Upstox",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=UP",
    },
    {
      id: "zerodha",
      name: "Zerodha",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=ZR",
    },
  ];

  const filteredBrokers = brokers.filter((broker) =>
    broker.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleContinue = () => {
    setShowApiForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Here you would typically send the API credentials to your backend
    console.log("Saving API credentials:", apiCredentials);
    setIsConnected(true);

    // Store in localStorage for demo purposes
    const savedApis = JSON.parse(localStorage.getItem("savedApis") || "[]");
    savedApis.push({
      id: Date.now().toString(),
      appName: apiCredentials.appName,
      broker: selectedBroker?.name,
      isActive: true,
    });
    localStorage.setItem("savedApis", JSON.stringify(savedApis));
  };

  const selectedBroker = brokers.find((b) => b.id === selectedBrokerId);

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
              onClick={() => {
                onBrokerSelect(broker.id);
                setShowApiForm(false);
                setIsConnected(false);
              }}
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
          <Button
            className="w-full"
            disabled={!selectedBrokerId}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 p-6">
        {selectedBrokerId ? (
          <div className="max-w-md mx-auto">
            {!showApiForm ? (
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Connect your {selectedBroker?.name} account
                </h3>
                <p className="text-muted-foreground mb-4">
                  Click continue to set up API credentials for{" "}
                  {selectedBroker?.name}.
                </p>
              </div>
            ) : isConnected ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-green-500">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">
                      Connected to {selectedBroker?.name}
                    </span>
                  </div>
                  <div className="mt-4 bg-accent/50 p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <span>API 1</span>
                      <span className="text-green-500 font-medium">LIVE</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Add API: {selectedBroker?.name}
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="appName">App Name</Label>
                    <Input
                      id="appName"
                      name="appName"
                      value={apiCredentials.appName}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      name="apiKey"
                      value={apiCredentials.apiKey}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="secretKey">Secret Key</Label>
                    <Input
                      id="secretKey"
                      name="secretKey"
                      type="password"
                      value={apiCredentials.secretKey}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totp">TOTP</Label>
                    <Input
                      id="totp"
                      name="totp"
                      value={apiCredentials.totp}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <Button className="w-full" onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </div>
            )}
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
