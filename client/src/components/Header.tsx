import { Search, Plus, User, ShoppingBag, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onToggleTheme?: () => void;
  isDark?: boolean;
}

export default function Header({ onSearch, onToggleTheme, isDark }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 hover-elevate rounded-md px-2 py-1" data-testid="link-home">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary font-heading">CampusMarket</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for textbooks, electronics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </form>
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/items">
              <Button variant="ghost" data-testid="button-browse">
                Browse Items
              </Button>
            </Link>
            <Link href="/add-item">
              <Button data-testid="button-sell">
                <Plus className="h-4 w-4 mr-2" />
                Sell Item
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={onToggleTheme} data-testid="button-theme">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-profile">
              <User className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-mobile"
                  />
                </div>
              </form>
              <div className="flex flex-col space-y-2">
                <Link href="/items">
                  <Button variant="ghost" className="w-full justify-start" data-testid="button-browse-mobile">
                    Browse Items
                  </Button>
                </Link>
                <Link href="/add-item">
                  <Button className="w-full justify-start" data-testid="button-sell-mobile">
                    <Plus className="h-4 w-4 mr-2" />
                    Sell Item
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start" data-testid="button-profile-mobile">
                  <User className="h-4 w-4 mr-2" />
                  My Account
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}