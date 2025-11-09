// Referenced from blueprint:javascript_auth_all_persistance
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthPage from "@/pages/AuthPage";
import Welcome from "@/pages/Welcome";
import ItemsPage from "@/pages/ItemsPage";
import AccountPage from "@/pages/AccountPage";
import MessagesPage from "@/pages/MessagesPage";
import CartPage from "@/pages/CartPage";
import SellPage from "@/pages/SellPage";
import LocoLocoPage from "@/pages/LocoLocoPage";
import ShopByCategoryPage from "@/pages/ShopByCategoryPage";
import DesignRoomPage from "@/pages/DesignRoomPage";
import TermsPage from "@/pages/TermsPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={Welcome} />
      <ProtectedRoute path="/items" component={ItemsPage} />
      <ProtectedRoute path="/account" component={AccountPage} />
      <ProtectedRoute path="/messages" component={MessagesPage} />
      <ProtectedRoute path="/cart" component={CartPage} />
      <ProtectedRoute path="/sell" component={SellPage} />
      <ProtectedRoute path="/locoloco" component={LocoLocoPage} />
      <ProtectedRoute path="/shop-by-category" component={ShopByCategoryPage} />
      <ProtectedRoute path="/design-room" component={DesignRoomPage} />
      <ProtectedRoute path="/terms" component={TermsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { user, isLoading } = useAuth();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isLoading && user && (
        <Header 
          onSearch={(query) => console.log('Search:', query)}
          onToggleTheme={toggleTheme}
          isDark={theme === 'dark'}
        />
      )}
      <main className="flex-1">
        <Router />
      </main>
      {!isLoading && user && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <ThemeProvider>
            <AppContent />
            <Toaster />
          </ThemeProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
