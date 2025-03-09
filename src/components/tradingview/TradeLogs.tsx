import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface TradeLog {
  id: number;
  json: string;
  time: string;
  status: "success" | "failed" | "pending";
}

export default function TradeLogs() {
  const tradeLogs: TradeLog[] = [
    {
      id: 1,
      json: '{"symbol":"RELIANCE","action":"BUY","price":2450.75,"quantity":10}',
      time: "2023-09-15 10:32:45",
      status: "success",
    },
    {
      id: 2,
      json: '{"symbol":"HDFCBANK","action":"SELL","price":1680.50,"quantity":15}',
      time: "2023-09-15 11:15:22",
      status: "success",
    },
    {
      id: 3,
      json: '{"symbol":"TCS","action":"BUY","price":3540.25,"quantity":5}',
      time: "2023-09-15 13:05:10",
      status: "failed",
    },
    {
      id: 4,
      json: '{"symbol":"INFY","action":"BUY","price":1750.00,"quantity":8}',
      time: "2023-09-16 09:45:33",
      status: "success",
    },
    {
      id: 5,
      json: '{"symbol":"SBIN","action":"SELL","price":625.75,"quantity":20}',
      time: "2023-09-16 10:22:18",
      status: "pending",
    },
    {
      id: 6,
      json: '{"symbol":"TATAMOTORS","action":"BUY","price":780.25,"quantity":12}',
      time: "2023-09-16 14:10:05",
      status: "success",
    },
    {
      id: 7,
      json: '{"symbol":"ICICIBANK","action":"SELL","price":950.50,"quantity":10}',
      time: "2023-09-17 09:30:42",
      status: "success",
    },
    {
      id: 8,
      json: '{"symbol":"WIPRO","action":"BUY","price":450.75,"quantity":15}',
      time: "2023-09-17 11:25:30",
      status: "failed",
    },
    {
      id: 9,
      json: '{"symbol":"BAJFINANCE","action":"BUY","price":7250.00,"quantity":2}',
      time: "2023-09-17 13:40:15",
      status: "success",
    },
    {
      id: 10,
      json: '{"symbol":"ASIANPAINT","action":"SELL","price":3150.25,"quantity":5}',
      time: "2023-09-17 15:05:22",
      status: "pending",
    },
  ];

  const getStatusBadge = (status: TradeLog["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 hover:text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" /> Success
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-600">
            <XCircle className="h-3 w-3 mr-1" /> Failed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 hover:text-yellow-600">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-6">
      <h1 className="text-2xl font-bold mb-6">Trade Logs</h1>

      <Card>
        <CardHeader>
          <CardTitle>Recent Trade Executions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">
                    Serial No.
                  </th>
                  <th className="text-left py-3 px-4 font-medium">JSON</th>
                  <th className="text-left py-3 px-4 font-medium">Time</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {tradeLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-border hover:bg-accent/50"
                  >
                    <td className="py-3 px-4">{log.id}</td>
                    <td className="py-3 px-4">
                      <code className="bg-accent/50 px-2 py-1 rounded text-xs font-mono">
                        {log.json}
                      </code>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{log.time}</td>
                    <td className="py-3 px-4">{getStatusBadge(log.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
