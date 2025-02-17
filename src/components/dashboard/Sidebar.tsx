import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  LineChart,
  Zap,
  Copy,
  HeadphonesIcon,
  HelpCircle,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn("w-64 bg-card border-r border-border h-full", className)}
    >
      <nav className="p-4 space-y-2">
        <a
          href="#"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </a>

        <a
          href="#"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </a>

        <div className="py-2">
          <div className="h-[1px] bg-border" />
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="tradingview" className="border-none">
            <AccordionTrigger className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center space-x-3">
                <LineChart className="h-5 w-5" />
                <span>TradingView</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-11 space-y-2">
                <a
                  onClick={() => navigate("/connect/tradingview")}
                  className="block py-2 hover:text-primary transition-colors cursor-pointer"
                >
                  Broker Auth
                </a>
                <a
                  href="#"
                  className="block py-2 hover:text-primary transition-colors"
                >
                  Webhook URL
                </a>
                <a
                  href="#"
                  className="block py-2 hover:text-primary transition-colors"
                >
                  Symbol
                </a>
                <a
                  href="#"
                  className="block py-2 hover:text-primary transition-colors"
                >
                  JSON
                </a>
                <a
                  href="#"
                  className="block py-2 hover:text-primary transition-colors"
                >
                  Trade Logs
                </a>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="scalping" className="border-none">
            <AccordionTrigger className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5" />
                <span>Scalping Tool</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-11 space-y-2">
                <a
                  onClick={() => navigate("/connect/scalping")}
                  className="block py-2 hover:text-primary transition-colors cursor-pointer"
                >
                  Broker Auth
                </a>
                <a
                  href="#"
                  className="block py-2 hover:text-primary transition-colors"
                >
                  Trade Panel
                </a>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="copytrading" className="border-none">
            <AccordionTrigger className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center space-x-3">
                <Copy className="h-5 w-5" />
                <span>Copy Trading</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-11 space-y-2">
                <a
                  onClick={() => navigate("/connect/copytrading")}
                  className="block py-2 hover:text-primary transition-colors cursor-pointer"
                >
                  Broker Authentication
                </a>
                <a
                  href="#"
                  className="block py-2 hover:text-primary transition-colors"
                >
                  Strategy
                </a>
                <a
                  href="#"
                  className="block py-2 hover:text-primary transition-colors"
                >
                  Manage
                </a>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="strategy" className="border-none">
            <AccordionTrigger className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center space-x-3">
                <LineChart className="h-5 w-5" />
                <span>Strategy</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-11 space-y-2">
                <a
                  href="#"
                  className="block py-2 hover:text-primary transition-colors"
                >
                  Pine Script
                </a>
                <a
                  href="#"
                  className="block py-2 hover:text-primary transition-colors"
                >
                  MQL
                </a>
                <a
                  href="#"
                  className="block py-2 hover:text-primary transition-colors"
                >
                  AFL
                </a>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <a
          href="#pricing"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
        >
          <CreditCard className="h-5 w-5" />
          <span>Pricing</span>
        </a>

        <div className="py-2">
          <div className="h-[1px] bg-border" />
        </div>

        <a
          href="#"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
        >
          <HeadphonesIcon className="h-5 w-5" />
          <span>Contact Us</span>
        </a>

        <a
          href="#"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
        >
          <HelpCircle className="h-5 w-5" />
          <span>FAQ</span>
        </a>
      </nav>
    </div>
  );
}
