import { Search, User, ShoppingBag, Menu, Moon, Sun, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Link } from "wouter";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onToggleTheme?: () => void;
  isDark?: boolean;
}

export default function Header({ onSearch, onToggleTheme, isDark }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const navItems = [
    { href: "/shop-by-category", label: "Shop By Category", testId: "link-shop-by-category" },
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
            <Button variant="ghost" size="icon" onClick={onToggleTheme} data-testid="button-theme">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link href="/account">
              <Button variant="ghost" size="icon" data-testid="button-profile">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
