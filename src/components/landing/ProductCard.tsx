import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Check } from "lucide-react";

interface Feature {
  name: string;
  included: boolean;
}

interface ProductCardProps {
  title: string;
  description: string;
  price: string;
  features: Feature[];
  popular?: boolean;
  ctaText?: string;
  onCtaClick?: () => void;
}

const ProductCard = ({
  title = "TradingView Integration",
  description = "Seamlessly connect your TradingView charts and execute trades directly from the platform.",
  price = "$49/month",
  features = [
    { name: "Real-time data sync", included: true },
    { name: "Custom indicators", included: true },
    { name: "Automated trading", included: true },
    { name: "24/7 support", included: false },
  ],
  popular = false,
  ctaText = "Get Started",
  onCtaClick = () => console.log("CTA clicked"),
}: ProductCardProps) => {
  return (
    <Card
      className={`w-[380px] h-[480px] bg-background flex flex-col ${popular ? "border-primary" : "border-border"}`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge
            variant="secondary"
            className="bg-primary text-primary-foreground"
          >
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription className="text-muted-foreground mt-2">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="mb-6">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground ml-2">/month</span>
        </div>

        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check
                size={18}
                className={
                  feature.included
                    ? "text-primary"
                    : "text-muted-foreground opacity-50"
                }
              />
              <span
                className={
                  feature.included
                    ? "text-foreground"
                    : "text-muted-foreground line-through"
                }
              >
                {feature.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={popular ? "default" : "outline"}
          onClick={onCtaClick}
        >
          {ctaText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
