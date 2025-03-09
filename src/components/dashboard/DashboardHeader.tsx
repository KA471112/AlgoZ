import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Coins, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

interface DashboardHeaderProps {
  username?: string;
  clientCode?: string;
  zCoins?: number;
}

export default function DashboardHeader({
  username = "John Doe",
  clientCode = "01",
  zCoins = 0,
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [walletBalance, setWalletBalance] = useState(() => {
    return parseInt(localStorage.getItem("zCoinsBalance") || "100000");
  });

  // Update zCoins when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setWalletBalance(
        parseInt(localStorage.getItem("zCoinsBalance") || "100000"),
      );
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Initialize wallet with 100,000 Z Coins if not already set
  useEffect(() => {
    if (!localStorage.getItem("zCoinsBalance")) {
      localStorage.setItem("zCoinsBalance", "100000");
      setWalletBalance(100000);
    }
  }, []);

  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="w-full h-16 bg-background border-b border-border px-4">
      <div className="h-full flex items-center justify-between">
        <div className="text-2xl font-bold text-primary">AlgoZ</div>

        <div className="flex items-center gap-4">
          {/* Z Coins Display */}
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
            <Coins className="h-5 w-5 text-primary" />
            <span className="font-medium">
              {walletBalance.toLocaleString()}
            </span>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <div className="text-right mr-2">
            <div className="font-medium">{username}</div>
            <div className="text-sm text-muted-foreground">
              Client #{clientCode}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/")}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
