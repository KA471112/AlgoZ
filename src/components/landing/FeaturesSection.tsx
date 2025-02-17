import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { MousePointerClick, LineChart, Zap } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  features?: Feature[];
}

const FeaturesSection = ({
  features = [
    {
      icon: <MousePointerClick className="w-12 h-12 text-primary" />,
      title: "One-Click Trading",
      description:
        "Execute trades instantly with our streamlined one-click trading interface. No more complex order forms.",
    },
    {
      icon: <LineChart className="w-12 h-12 text-primary" />,
      title: "Real-Time Metrics",
      description:
        "Monitor your trading performance with live updates on key metrics, P&L, and portfolio analytics.",
    },
    {
      icon: <Zap className="w-12 h-12 text-primary" />,
      title: "Lightning Fast Execution",
      description:
        "Experience ultra-low latency trade execution with our optimized trading infrastructure.",
    },
  ],
}: FeaturesSectionProps) => {
  return (
    <section className="w-full min-h-[500px] bg-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Trading Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the next generation of algorithmic trading with our
            cutting-edge features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="px-8">
            Explore All Features
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
