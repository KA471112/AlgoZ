import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ManageTradingViewProps {
  savedApis?: {
    id: string;
    appName: string;
    broker: string;
  }[];
}

export default function ManageTradingView({
  savedApis = JSON.parse(localStorage.getItem("savedApis") || "[]"),
}: ManageTradingViewProps) {
  const navigate = useNavigate();
  const [selectedApiId, setSelectedApiId] = useState<string>("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [walletBalance, setWalletBalance] = useState(() => {
    return parseInt(localStorage.getItem("zCoinsBalance") || "100000");
  });
  const [expiryDate, setExpiryDate] = useState<string | null>(null);

  const TRADINGVIEW_COST = 1200;

  useEffect(() => {
    // Initialize wallet with 100,000 Z Coins if not already set
    if (!localStorage.getItem("zCoinsBalance")) {
      localStorage.setItem("zCoinsBalance", "100000");
      setWalletBalance(100000);
    }

    // Check if subscription is active
    const subscriptions = JSON.parse(
      localStorage.getItem("subscriptions") || "{}",
    );
    if (subscriptions.tradingview && selectedApiId) {
      const subscription = subscriptions.tradingview[selectedApiId];
      if (subscription) {
        const expiry = new Date(subscription.expiryDate);
        if (expiry > new Date()) {
          setIsEnabled(true);
          setExpiryDate(subscription.expiryDate);
        } else {
          setIsEnabled(false);
          setExpiryDate(null);
        }
      }
    }
  }, [selectedApiId]);

  const handleToggle = () => {
    if (!isEnabled) {
      // Check if subscription is already active
      const subscriptions = JSON.parse(
        localStorage.getItem("subscriptions") || "{}",
      );
      if (
        subscriptions.tradingview &&
        subscriptions.tradingview[selectedApiId] &&
        new Date(subscriptions.tradingview[selectedApiId].expiryDate) >
          new Date()
      ) {
        // Subscription is still valid
        setIsEnabled(true);
        setExpiryDate(subscriptions.tradingview[selectedApiId].expiryDate);
        return;
      }

      // Trying to enable - need to pay
      if (walletBalance >= TRADINGVIEW_COST) {
        // Sufficient balance
        const newBalance = walletBalance - TRADINGVIEW_COST;
        localStorage.setItem("zCoinsBalance", newBalance.toString());
        setWalletBalance(newBalance);
        setIsEnabled(true);

        // Calculate expiry date (29 days from now)
        const now = new Date();
        const expiryDate = new Date(now.setDate(now.getDate() + 29));
        expiryDate.setHours(23, 59, 59, 999); // Set to end of day (midnight IST)
        setExpiryDate(expiryDate.toISOString());

        // Save subscription
        const subscriptions = JSON.parse(
          localStorage.getItem("subscriptions") || "{}",
        );
        if (!subscriptions.tradingview) {
          subscriptions.tradingview = {};
        }
        subscriptions.tradingview[selectedApiId] = {
          startDate: new Date().toISOString(),
          expiryDate: expiryDate.toISOString(),
        };
        localStorage.setItem("subscriptions", JSON.stringify(subscriptions));

        // Record transaction in history
        const history = JSON.parse(
          localStorage.getItem("zCoinsHistory") || "[]",
        );
        history.push({
          id: Date.now(),
          type: "deduction",
          amount: TRADINGVIEW_COST,
          description: "TradingView Integration - Monthly Subscription",
          date: new Date().toISOString(),
        });
        localStorage.setItem("zCoinsHistory", JSON.stringify(history));
      } else {
        // Insufficient balance
        setShowAlert(true);
      }
    } else {
      // Disabling - just turn it off
      setIsEnabled(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage: TradingView</h1>
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
          <Coins className="h-5 w-5 text-primary" />
          <span className="font-medium">
            {walletBalance.toLocaleString()} Z Coins
          </span>
        </div>
      </div>

      <div className="mb-6 p-3 bg-card/50 border border-border rounded-md">
        {expiryDate ? (
          <>
            <p className="text-sm text-green-500">
              <span className="font-medium">Subscription active</span> - 1
              account subscribed
            </p>
            <p className="text-sm text-green-500 mt-1">
              Valid till: {new Date(expiryDate).toLocaleDateString()} (12:00 AM
              IST)
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No active subscription. Enable TradingView integration to subscribe.
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>TradingView Integration Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {savedApis.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No API connections found. Please add an API connection in Broker
              Auth section first.
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="api-select">Select API Connection</Label>
                <Select value={selectedApiId} onValueChange={setSelectedApiId}>
                  <SelectTrigger id="api-select">
                    <SelectValue placeholder="Select an API connection" />
                  </SelectTrigger>
                  <SelectContent>
                    {savedApis.map((api) => (
                      <SelectItem key={api.id} value={api.id}>
                        {api.appName} ({api.broker})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showAlert && (
                <Alert variant="destructive" className="my-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Insufficient Z Coins</AlertTitle>
                  <AlertDescription>
                    You don't have enough Z Coins. Please recharge your wallet.
                  </AlertDescription>
                </Alert>
              )}

              <div className="p-4 border border-border rounded-md bg-card/50 my-4">
                <p className="text-sm font-medium">Pricing Information</p>
                <p className="text-sm text-muted-foreground mt-1">
                  TradingView integration costs 1,200 Z Coins per month per
                  account.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">
                    Enable TradingView Integration
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Allow TradingView to execute trades through this API
                  </p>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={handleToggle}
                  disabled={!selectedApiId}
                />
              </div>

              {isEnabled && (
                <div className="mt-6">
                  <Button
                    onClick={() => navigate("/webhook-url")}
                    className="w-full"
                  >
                    Go to Webhook URL
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
