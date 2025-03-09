import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ApiStatusProps {
  connectedApis?: {
    name: string;
    broker: string;
    status: "live" | "inactive";
  }[];
}

export default function ApiStatus({
  connectedApis = [
    { name: "API 1", broker: "Zerodha", status: "live" },
    { name: "API 2", broker: "Upstox", status: "inactive" },
  ],
}: ApiStatusProps) {
  const liveCount = connectedApis.filter((api) => api.status === "live").length;
  const inactiveCount = connectedApis.length - liveCount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected APIs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{liveCount}</div>
            <div className="text-sm text-muted-foreground">Live</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{inactiveCount}</div>
            <div className="text-sm text-muted-foreground">Inactive</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{connectedApis.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </div>

        <div className="space-y-3">
          {connectedApis.map((api, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-accent/50 rounded-md"
            >
              <div>
                <div className="font-medium">{api.name}</div>
                <div className="text-sm text-muted-foreground">
                  {api.broker}
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${api.status === "live" ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"}`}
              >
                {api.status.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
