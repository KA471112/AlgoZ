import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, CheckCircle2 } from "lucide-react";

export default function WebhookUrl() {
  const [copied, setCopied] = useState(false);
  const webhookUrl = `https://algoz.com/webhook/${generateUniqueId()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-6">
      <h1 className="text-2xl font-bold mb-6">Your Webhook URL</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>TradingView Webhook</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This is your unique webhook URL for TradingView integration. Use
            this URL in your TradingView alerts to send signals to AlgoZ.
          </p>

          <div className="flex items-center gap-2 bg-accent/50 p-4 rounded-md mb-4">
            <code className="flex-1 font-mono text-sm break-all">
              {webhookUrl}
            </code>
            <Button size="sm" variant="ghost" onClick={handleCopy}>
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="bg-card border border-border rounded-md p-4">
            <h3 className="font-medium mb-2">How to use your webhook URL:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Go to TradingView and open your chart</li>
              <li>Create a new alert or edit an existing one</li>
              <li>In the "Alert actions" section, select "Webhook URL"</li>
              <li>Paste your unique webhook URL</li>
              <li>Configure your alert message in JSON format</li>
              <li>Save your alert</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function generateUniqueId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
