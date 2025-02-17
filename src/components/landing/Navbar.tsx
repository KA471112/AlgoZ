import React from "react";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { cn } from "@/lib/utils";
import { LogIn, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

interface NavbarProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onContactSalesClick?: () => void;
  isLoggedIn?: boolean;
}

const Navbar = ({
  onLoginClick = () => (window.location.href = "/login"),
  onSignupClick = () => (window.location.href = "/signup"),
  onContactSalesClick = () => console.log("Contact sales clicked"),
  isLoggedIn = false,
}: NavbarProps) => {
  const navigationItems = [
    {
      title: "Products",
      items: [
        { title: "TradingView Integration", href: "#" },
        { title: "Pine Script Strategies", href: "#" },
        { title: "MQL Solutions", href: "#" },
        { title: "AFL Scripts", href: "#" },
      ],
    },
    {
      title: "Resources",
      items: [
        { title: "Documentation", href: "#" },
        { title: "API Reference", href: "#" },
        { title: "Community", href: "#" },
      ],
    },
    {
      title: "Company",
      items: [
        { title: "About", href: "#" },
        { title: "Blog", href: "#" },
        { title: "Careers", href: "#" },
      ],
    },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="text-2xl font-bold text-primary">
            AlgoZ
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {item.items.map((subItem) => (
                        <li key={subItem.title}>
                          <NavigationMenuLink asChild>
                            <a
                              href={subItem.href}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              )}
                            >
                              <div className="text-sm font-medium leading-none">
                                {subItem.title}
                              </div>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center space-x-4">
            {!isLoggedIn && (
              <>
                <Button variant="ghost" onClick={onLoginClick}>
                  Log In
                </Button>
                <Button onClick={onSignupClick}>Sign Up</Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate through our platform
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {navigationItems.map((section) => (
                  <div key={section.title} className="space-y-2">
                    <h3 className="text-sm font-medium">{section.title}</h3>
                    {section.items.map((item) => (
                      <a
                        key={item.title}
                        href={item.href}
                        className="block px-2 py-1 text-sm text-muted-foreground hover:text-primary"
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                ))}
                <div className="pt-4 space-y-2">
                  {!isLoggedIn && (
                    <>
                      <Button
                        className="w-full justify-start"
                        variant="ghost"
                        onClick={onLoginClick}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Log In
                      </Button>
                      <Button className="w-full" onClick={onSignupClick}>
                        Sign Up
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
