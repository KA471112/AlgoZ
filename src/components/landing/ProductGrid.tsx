import React from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  features: Array<{ name: string; included: boolean }>;
  popular?: boolean;
}

interface ProductGridProps {
  products?: Product[];
}

const ProductGrid = ({
  products = [
    {
      id: "1",
      title: "TradingView Integration",
      description:
        "Seamlessly connect your TradingView charts and execute trades directly from the platform.",
      price: "$49",
      features: [
        { name: "Real-time data sync", included: true },
        { name: "Custom indicators", included: true },
        { name: "Automated trading", included: true },
        { name: "24/7 support", included: false },
      ],
      popular: true,
    },
    {
      id: "2",
      title: "Pine Script Strategies",
      description:
        "Access a library of pre-built trading strategies or create your own using Pine Script.",
      price: "$79",
      features: [
        { name: "Strategy library", included: true },
        { name: "Backtesting tools", included: true },
        { name: "Custom script editor", included: true },
        { name: "Strategy optimization", included: true },
      ],
    },
    {
      id: "3",
      title: "MQL Solutions",
      description:
        "Professional MetaTrader integration with custom MQL4/5 expert advisors and indicators.",
      price: "$99",
      features: [
        { name: "MT4/MT5 integration", included: true },
        { name: "Custom EA development", included: true },
        { name: "Indicator library", included: true },
        { name: "Priority support", included: true },
      ],
    },
  ],
}: ProductGridProps) => {
  return (
    <div className="w-full max-w-[1200px] mx-auto bg-background p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            description={product.description}
            price={product.price}
            features={product.features}
            popular={product.popular}
            ctaText="Get Started"
            onCtaClick={() => console.log(`Selected ${product.title}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
