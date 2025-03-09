import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, BarChart3 } from "lucide-react";

export default function ScalpingTradePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-6">
      <h1 className="text-2xl font-bold mb-6">Scalping Trade Panel</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Chart</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-accent/20">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Chart will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Trade</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="buy">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="buy">Buy</TabsTrigger>
                  <TabsTrigger value="sell">Sell</TabsTrigger>
                </TabsList>
                <TabsContent value="buy">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="symbol">Symbol</Label>
                      <Input id="symbol" placeholder="RELIANCE" />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input id="quantity" type="number" placeholder="10" />
                    </div>
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input id="price" type="number" placeholder="Market" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="takeProfit">Take Profit (%)</Label>
                        <Input
                          id="takeProfit"
                          type="number"
                          placeholder="0.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                        <Input id="stopLoss" type="number" placeholder="0.3" />
                      </div>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <ArrowUp className="mr-2 h-4 w-4" /> Buy
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="sell">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="symbol-sell">Symbol</Label>
                      <Input id="symbol-sell" placeholder="RELIANCE" />
                    </div>
                    <div>
                      <Label htmlFor="quantity-sell">Quantity</Label>
                      <Input
                        id="quantity-sell"
                        type="number"
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price-sell">Price</Label>
                      <Input
                        id="price-sell"
                        type="number"
                        placeholder="Market"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="takeProfit-sell">Take Profit (%)</Label>
                        <Input
                          id="takeProfit-sell"
                          type="number"
                          placeholder="0.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stopLoss-sell">Stop Loss (%)</Label>
                        <Input
                          id="stopLoss-sell"
                          type="number"
                          placeholder="0.3"
                        />
                      </div>
                    </div>
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <ArrowDown className="mr-2 h-4 w-4" /> Sell
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Open Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Symbol</th>
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Quantity</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Entry Price
                  </th>
                  <th className="text-left py-3 px-4 font-medium">
                    Current Price
                  </th>
                  <th className="text-left py-3 px-4 font-medium">P&L</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border hover:bg-accent/50">
                  <td className="py-3 px-4">RELIANCE</td>
                  <td className="py-3 px-4 text-green-500">BUY</td>
                  <td className="py-3 px-4">10</td>
                  <td className="py-3 px-4">2450.75</td>
                  <td className="py-3 px-4">2460.25</td>
                  <td className="py-3 px-4 text-green-500">+95.00</td>
                  <td className="py-3 px-4">
                    <Button variant="destructive" size="sm">
                      Close
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-border hover:bg-accent/50">
                  <td className="py-3 px-4">HDFCBANK</td>
                  <td className="py-3 px-4 text-red-500">SELL</td>
                  <td className="py-3 px-4">15</td>
                  <td className="py-3 px-4">1680.50</td>
                  <td className="py-3 px-4">1675.25</td>
                  <td className="py-3 px-4 text-green-500">+78.75</td>
                  <td className="py-3 px-4">
                    <Button variant="destructive" size="sm">
                      Close
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
