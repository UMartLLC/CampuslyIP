// Referenced from blueprint:javascript_auth_all_persistance
// NOTE: Authentication temporarily disabled
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/use-auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Welcome from "@/pages/Welcome";
import AboutPage from "@/pages/AboutPage";
import ComingSoonPage from "@/pages/ComingSoonPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/about" component={AboutPage} />
      <Route path="/coming-soon" component={ComingSoonPage} />
      {/* All other routes redirect to Coming Soon */}
      <Route path="/items" component={ComingSoonPage} />
      <Route path="/items/:id" component={ComingSoonPage} />
      <Route path="/account" component={ComingSoonPage} />
      <Route path="/messages" component={ComingSoonPage} />
      <Route path="/cart" component={ComingSoonPage} />
      <Route path="/checkout" component={ComingSoonPage} />
      <Route path="/sell" component={ComingSoonPage} />
      <Route path="/locoloco" component={ComingSoonPage} />
      <Route path="/shop-by-category" component={ComingSoonPage} />
      <Route path="/design-room" component={ComingSoonPage} />
      <Route path="/terms" component={ComingSoonPage} />
      <Route path="/faq" component={ComingSoonPage} />
      <Route path="/privacy" component={ComingSoonPage} />
      <Route path="/community" component={ComingSoonPage} />
      <Route path="/blog" component={ComingSoonPage} />
      <Route path="/ambassadors" component={ComingSoonPage} />
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
