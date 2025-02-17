import React from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onStartCopyTrading?: () => void;
  onBrowseStrategies?: () => void;
}

const HeroSection = ({
  onStartCopyTrading = () => console.log("Start copy trading clicked"),
  onBrowseStrategies = () => console.log("Browse strategies clicked"),
}: HeroSectionProps) => {
  return (
    <section className="relative w-full h-[800px] bg-background flex items-center justify-center overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />

      {/* Animated trading chart lines in background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[2px] bg-primary"
            style={{
              left: 0,
              top: `${20 + i * 15}%`,
              width: "100%",
            }}
            animate={{
              x: ["-100%", "100%"],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Algorithmic Trading
          <span className="text-primary block">Made Simple</span>
        </motion.h1>

        <motion.p
          className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Leverage advanced trading algorithms and copy successful strategies
          with our automated trading platform. Start maximizing your returns
          today.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            size="lg"
            className="text-lg px-8"
            onClick={onStartCopyTrading}
          >
            Start Copy Trading
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8"
            onClick={onBrowseStrategies}
          >
            Browse Strategies
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div>
            <h3 className="text-4xl font-bold text-primary">$2.5B+</h3>
            <p className="text-muted-foreground">Trading Volume</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-primary">50K+</h3>
            <p className="text-muted-foreground">Active Traders</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-primary">99.9%</h3>
            <p className="text-muted-foreground">Uptime</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
