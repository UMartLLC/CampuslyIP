import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Welcome from "@/pages/Welcome";
import ItemsPage from "@/pages/ItemsPage";
import AddItemPage from "@/pages/AddItemPage";
import AccountPage from "@/pages/AccountPage";
import MessagesPage from "@/pages/MessagesPage";
import SellPage from "@/pages/SellPage";
import LocoLocoPage from "@/pages/LocoLocoPage";
import ShopByCategoryPage from "@/pages/ShopByCategoryPage";
import DesignRoomPage from "@/pages/DesignRoomPage";
import TermsPage from "@/pages/TermsPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/items" component={ItemsPage} />
      <Route path="/add-item" component={AddItemPage} />
      <Route path="/account" component={AccountPage} />
      <Route path="/messages" component={MessagesPage} />
      <Route path="/sell" component={SellPage} />
      <Route path="/locoloco" component={LocoLocoPage} />
      <Route path="/shop-by-category" component={ShopByCategoryPage} />
      <Route path="/design-room" component={DesignRoomPage} />
      <Route path="/terms" component={TermsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        onSearch={(query) => console.log('Search:', query)}
        onToggleTheme={toggleTheme}
        isDark={theme === 'dark'}
      />
      <main className="flex-1">
        <Router />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AppContent />
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
