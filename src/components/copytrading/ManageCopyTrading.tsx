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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

interface ManageCopyTradingProps {
  savedApis?: {
    id: string;
    appName: string;
    broker: string;
  }[];
}

export default function ManageCopyTrading({
  savedApis = JSON.parse(localStorage.getItem("savedApis") || "[]"),
}: ManageCopyTradingProps) {
  const [selectedApiIds, setSelectedApiIds] = useState<string[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [walletBalance, setWalletBalance] = useState(() => {
    return parseInt(localStorage.getItem("zCoinsBalance") || "100000");
  });
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [subscribedAccounts, setSubscribedAccounts] = useState<string[]>([]);

  const COPYTRADING_COST_PER_ACCOUNT = 1000;

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
    if (subscriptions.copytrading) {
      const now = new Date();
      let isAnyActive = false;
      const activeAccounts: string[] = [];

      // Find the latest expiry date among all subscribed accounts
      let latestExpiry: Date | null = null;

      Object.entries(subscriptions.copytrading).forEach(
        ([apiId, subscription]: [string, any]) => {
          const expiry = new Date(subscription.expiryDate);
          if (expiry > now) {
            isAnyActive = true;
            activeAccounts.push(apiId);

            if (!latestExpiry || expiry > latestExpiry) {
              latestExpiry = expiry;
            }
          }
        },
      );

      if (isAnyActive && latestExpiry) {
        setIsEnabled(true);
        setExpiryDate(latestExpiry.toISOString());
        setSelectedApiIds(activeAccounts);
        setSubscribedAccounts(activeAccounts);
      } else {
        setIsEnabled(false);
        setExpiryDate(null);
        setSubscribedAccounts([]);
      }
    }
  }, []);

  const handleApiToggle = (apiId: string) => {
    setSelectedApiIds((prev) => {
      if (prev.includes(apiId)) {
        return prev.filter((id) => id !== apiId);
      } else {
        return [...prev, apiId];
      }
    });
  };

  const handleToggle = () => {
    if (!isEnabled) {
      // Trying to enable
      if (selectedApiIds.length === 0) {
        return; // No accounts selected
      }

      // Calculate cost for new accounts only
      const newAccounts = selectedApiIds.filter(
        (id) => !subscribedAccounts.includes(id),
      );
      const newAccountsCost = newAccounts.length * COPYTRADING_COST_PER_ACCOUNT;

      if (newAccountsCost === 0) {
        // All selected accounts are already subscribed
        setIsEnabled(true);
        return;
      }

      if (walletBalance >= newAccountsCost) {
        // Sufficient balance
        const newBalance = walletBalance - newAccountsCost;
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
        if (!subscriptions.copytrading) {
          subscriptions.copytrading = {};
        }

        // Add new subscriptions
        newAccounts.forEach((apiId) => {
          subscriptions.copytrading[apiId] = {
            startDate: new Date().toISOString(),
            expiryDate: expiryDate.toISOString(),
          };
        });

        localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
        setSubscribedAccounts([...subscribedAccounts, ...newAccounts]);

        // Record transaction in history
        const history = JSON.parse(
          localStorage.getItem("zCoinsHistory") || "[]",
        );
        history.push({
          id: Date.now(),
          type: "deduction",
          amount: newAccountsCost,
          description: `Copy Trading - Monthly Subscription (${newAccounts.length} new accounts)`,
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
        <h1 className="text-2xl font-bold">Manage: Copy Trading</h1>
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
          <Coins className="h-5 w-5 text-primary" />
          <span className="font-medium">
            {walletBalance.toLocaleString()} Z Coins
          </span>
        </div>
      </div>

      <div className="mb-6 p-3 bg-card/50 border border-border rounded-md">
        {subscribedAccounts.length > 0 ? (
          <>
            <p className="text-sm text-green-500">
              <span className="font-medium">Subscription active</span> -{" "}
              {subscribedAccounts.length} accounts subscribed
            </p>
            {expiryDate && (
              <p className="text-sm text-green-500 mt-1">
                Valid till: {new Date(expiryDate).toLocaleDateString()} (12:00
                AM IST)
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No active subscription. Select accounts and enable Copy Trading to
            subscribe.
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Copy Trading Settings</CardTitle>
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
                <Label>Select API Connections (Multiple)</Label>
                <div className="border border-border rounded-md p-3 space-y-2">
                  {savedApis.map((api) => (
                    <div key={api.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`api-${api.id}`}
                        checked={selectedApiIds.includes(api.id)}
                        onCheckedChange={() => handleApiToggle(api.id)}
                      />
                      <Label
                        htmlFor={`api-${api.id}`}
                        className="cursor-pointer"
                      >
                        {api.appName} ({api.broker})
                      </Label>
                    </div>
                  ))}
                </div>
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
                  Copy Trading costs 1,000 Z Coins per month per account.
                </p>
                <p className="text-sm mt-2">
                  Selected accounts:{" "}
                  <span className="font-medium">{selectedApiIds.length}</span>
                </p>
                <p className="text-sm mt-1">
                  New accounts:{" "}
                  <span className="font-medium">
                    {
                      selectedApiIds.filter(
                        (id) => !subscribedAccounts.includes(id),
                      ).length
                    }
                  </span>
                </p>
                <p className="text-sm mt-1">
                  Cost for new accounts:{" "}
                  <span className="font-medium">
                    {selectedApiIds.filter(
                      (id) => !subscribedAccounts.includes(id),
                    ).length * COPYTRADING_COST_PER_ACCOUNT}{" "}
                    Z Coins
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enable Copy Trading</h3>
                  <p className="text-sm text-muted-foreground">
                    Allow copying trades from selected traders
                  </p>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={handleToggle}
                  disabled={selectedApiIds.length === 0}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
