// Referenced from blueprint:javascript_auth_all_persistance
// NOTE: Authentication temporarily disabled
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/use-auth";
// import { ProtectedRoute } from "@/lib/protected-route";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import AuthPage from "@/pages/AuthPage";
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
import FAQPage from "@/pages/FAQPage";
import PrivacyPage from "@/pages/PrivacyPage";
import AboutPage from "@/pages/AboutPage";
import ItemDetailPage from "@/pages/ItemDetailPage";
import CheckoutPage from "@/pages/CheckoutPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Authentication temporarily disabled */}
      {/* <Route path="/auth" component={AuthPage} /> */}
      <Route path="/" component={Welcome} />
      <Route path="/items" component={ItemsPage} />
      <Route path="/items/:id" component={ItemDetailPage} />
      <Route path="/account" component={AccountPage} />
      <Route path="/messages" component={MessagesPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/sell" component={SellPage} />
      <Route path="/locoloco" component={LocoLocoPage} />
      <Route path="/shop-by-category" component={ShopByCategoryPage} />
      <Route path="/design-room" component={DesignRoomPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/about" component={AboutPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  // Authentication temporarily disabled - always show UI
  // const { user, isLoading } = useAuth();
  
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
