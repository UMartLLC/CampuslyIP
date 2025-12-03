import { Search, User, ShoppingBag, Menu, Moon, Sun, MessageCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Link, useLocation } from "wouter";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onToggleTheme?: () => void;
  isDark?: boolean;
}

export default function Header({ onSearch, onToggleTheme, isDark }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to coming soon for search
    setLocation('/coming-soon');
    onSearch?.(searchQuery);
  };

  const navItems = [
    { href: "/coming-soon", label: "Marketplace", testId: "link-marketplace" },
    { href: "/coming-soon", label: "Sell Items", testId: "link-sell-items" },
    { href: "/coming-soon", label: "Advertise (LocoLoco)", testId: "link-advertise" },
    { href: "/coming-soon", label: "Design your room", testId: "link-design-room" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* LEFT cluster: hamburger + logo + optional desktop nav */}
          <div className="flex items-center flex-none gap-3">
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
                      key={item.label}
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
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setSidebarOpen(false)} asChild>
                    <Link href="/about">About Us</Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-2 hover-elevate rounded-md px-2 py-1" data-testid="link-home">
                <ShoppingBag className="h-7 w-7 text-primary" />
                <span className="text-xl font-bold text-primary font-heading">Campusly</span>
              </div>
            </Link>

            {/* Desktop inline nav (visible md+) */}
            <nav className="hidden md:flex items-center space-x-6 ml-2">
              <Link href="/about" className="text-sm font-medium hover:text-primary">About Us</Link>
              <Link href="/coming-soon" className="text-sm font-medium hover:text-primary">Marketplace</Link>
              <Link href="/coming-soon" className="text-sm font-medium hover:text-primary">LocoLoco</Link>
            </nav>
          </div>

          {/* CENTER: Search bar */}
          <div className="flex-1 min-w-0 px-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for textbooks, electronics, furniture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                  data-testid="input-search"
                />
              </div>
            </form>
          </div>

          {/* RIGHT cluster: icons */}
          <div className="flex items-center flex-none gap-1">
            <Button variant="ghost" size="icon" onClick={onToggleTheme} data-testid="button-theme">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Link href="/coming-soon">
              <Button variant="ghost" size="icon" data-testid="button-chat">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/coming-soon">
              <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-profile">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/coming-soon" data-testid="link-account">
                    Account
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
