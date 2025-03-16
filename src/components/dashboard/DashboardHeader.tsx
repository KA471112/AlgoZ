import React from "react";
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
import { useAuth } from "@/lib/mockAuth";

interface DashboardHeaderProps {
  username?: string;
  clientCode?: string;
  zCoins?: number;
}

export default function DashboardHeader({
  username,
  clientCode,
  zCoins,
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();

  // Use props if provided, otherwise use user context
  const displayName = username || user?.username || "User";
  const displayClientId = clientCode || user?.clientId || "--";
  const displayZCoins = zCoins !== undefined ? zCoins : user?.zCoins || 0;

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="w-full h-16 bg-background border-b border-border px-4">
      <div className="h-full flex items-center justify-between">
        <div className="text-2xl font-bold text-primary">AlgoZ</div>

        <div className="flex items-center gap-4">
          {/* Z Coins Display */}
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
            <Coins className="h-5 w-5 text-primary" />
            <span className="font-medium">
              {displayZCoins.toLocaleString()}
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
            <div className="font-medium">{displayName}</div>
            <div className="text-sm text-muted-foreground">
              Client #{displayClientId}
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
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
