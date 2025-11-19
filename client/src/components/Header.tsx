import { Search, User, ShoppingBag, Menu, Moon, Sun, MessageCircle, ShoppingCart, Package, History, Heart, Gavel, Megaphone, AlertTriangle, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Link, useLocation } from "wouter";
// import { useAuth } from "@/hooks/use-auth"; // Authentication temporarily disabled
import { useQuery } from "@tanstack/react-query";
import type { CartItemWithDetails } from "@shared/schema";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onToggleTheme?: () => void;
  isDark?: boolean;
}

export default function Header({ onSearch, onToggleTheme, isDark }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setLocation] = useLocation();
  // Authentication temporarily disabled
  // const { user, logoutMutation } = useAuth();

  // Fetch cart items
  const { data: cartItems = [] } = useQuery<CartItemWithDetails[]>({
    queryKey: ['/api/cart'],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to items page with search query
      setLocation(`/items?search=${encodeURIComponent(searchQuery.trim())}`);
    }
    onSearch?.(searchQuery);
  };

  const navItems = [
    { href: "/items", label: "Marketplace", testId: "link-marketplace" },
    { href: "/sell", label: "Sell Items", testId: "link-sell-items" },
    { href: "/locoloco", label: "Advertise (LocoLoco)", testId: "link-advertise" },
    { href: "/design-room", label: "Design your room", testId: "link-design-room" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-4">
          {/* Hamburger Menu with Sidebar */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-hamburger-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setSidebarOpen(false)}
                    asChild
                  >
                    <Link href={item.href} data-testid={item.testId}>
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 hover-elevate rounded-md px-2 py-1" data-testid="link-home">
              <ShoppingBag className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold text-primary font-heading">UniMart</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for textbooks, electronics, furniture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-1">
            <Link href="/messages">
              <Button variant="ghost" size="icon" data-testid="button-chat">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <Badge 
                    variant="default" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    data-testid="badge-cart-count"
                  >
                    {cartItems.length}
                  </Badge>
                )}
              </Button>
            </Link>
            
            <Button variant="ghost" size="icon" onClick={onToggleTheme} data-testid="button-theme">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-profile">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account?tab=dashboard" data-testid="link-dashboard">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account?tab=market" data-testid="link-my-market">
                    <Package className="h-4 w-4 mr-2" />
                    My Market
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account?tab=history" data-testid="link-items-history">
                    <History className="h-4 w-4 mr-2" />
                    Items History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account?tab=favorites" data-testid="link-favorites">
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account?tab=bids" data-testid="link-my-bids">
                    <Gavel className="h-4 w-4 mr-2" />
                    My Bids
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account?tab=purchases" data-testid="link-my-purchases">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    My Purchases
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account?tab=locoloco" data-testid="link-my-locoloco">
                    <Megaphone className="h-4 w-4 mr-2" />
                    My LocoLoco
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account?tab=report" data-testid="link-report-concern">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report a Concern
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account?tab=legal" data-testid="link-legal">
                    <Scale className="h-4 w-4 mr-2" />
                    Legal
                  </Link>
                </DropdownMenuItem>
                {/* Logout temporarily disabled - authentication removed */}
                {/* <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logoutMutation.mutate()} data-testid="button-logout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
