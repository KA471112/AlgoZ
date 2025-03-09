import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

interface Transaction {
  id: number;
  type: "purchase" | "deduction";
  amount: number;
  description: string;
  date: string;
}

export default function PricingHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Load transactions from localStorage
    const storedTransactions = JSON.parse(
      localStorage.getItem("zCoinsHistory") || "[]",
    );
    setTransactions(storedTransactions);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-6">
      <h1 className="text-2xl font-bold mb-6">Z Coins Transaction History</h1>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found. Purchase Z Coins or use services to see
              your history.
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-accent/50 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    {transaction.type === "purchase" ? (
                      <ArrowUpCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <ArrowDownCircle className="h-5 w-5 text-amber-500" />
                    )}
                    <div>
                      <div className="font-medium">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        transaction.type === "purchase"
                          ? "outline"
                          : "secondary"
                      }
                      className={
                        transaction.type === "purchase"
                          ? "text-green-500"
                          : "text-amber-500"
                      }
                    >
                      {transaction.type === "purchase" ? "+" : "-"}
                      {transaction.amount} Z Coins
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
