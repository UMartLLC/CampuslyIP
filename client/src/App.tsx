// Referenced from blueprint:javascript_auth_all_persistance
// NOTE: Authentication temporarily disabled
import { Switch, Route } from "wouter"; // Imports wouter components for switch-based conditional routing.
import { queryClient } from "./lib/queryClient"; // Imports the configured global TanStack Query Client instance.
import { QueryClientProvider } from "@tanstack/react-query"; // Imports the provider for TanStack Query.
import { Toaster } from "@/components/ui/toaster"; // Imports the component responsible for rendering all toast notifications.
import { TooltipProvider } from "@/components/ui/tooltip"; // Imports the provider required for Radix Tooltip functionality.
import { ThemeProvider, useTheme } from "@/components/ThemeProvider"; // Imports the Theme Provider and hook for light/dark mode.
import { AuthProvider } from "@/hooks/use-auth"; // Imports the provider for global authentication state.
// import { ProtectedRoute } from "@/lib/protected-route"; // Protected route component (currently unused/disabled).
// Imports components for the fixed header and footer.
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// Imports all individual page components for routing.
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
import NotFound from "@/pages/not-found"; // Component for 404 errors.

// -----------------------------------------------------------------------------
// 1. Router Component
// -----------------------------------------------------------------------------

// Defines all application routes using wouter's Switch component (renders the first matching route).
function Router() {
  return (
    <Switch>
      {/* Authentication temporarily disabled */}
      {/* <Route path="/auth" component={AuthPage} /> */}
      <Route path="/" component={Welcome} />
      <Route path="/items" component={ItemsPage} />
      <Route path="/account" component={AccountPage} />
      <Route path="/messages" component={MessagesPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/sell" component={SellPage} />
      <Route path="/locoloco" component={LocoLocoPage} />
      <Route path="/shop-by-category" component={ShopByCategoryPage} />
      <Route path="/design-room" component={DesignRoomPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/about" component={AboutPage} />
      {/* The default route: matches any path not matched by the routes above (404 handler). */}
      <Route component={NotFound} />
    </Switch>
  );
}

// -----------------------------------------------------------------------------
// 2. App Content Component (Layout and Theme Integration)
// -----------------------------------------------------------------------------

// Wrapper component that consumes the theme context and applies the main layout structure.
function AppContent() {
  // Consumes theme context to get current theme state and the toggle function.
  const { theme, toggleTheme } = useTheme(); 
  // Authentication temporarily disabled - always show UI
  // const { user, isLoading } = useAuth();
  
  return (
    // Main layout container: full height, theme background, flex column for header-main-footer stack.
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        onSearch={(query) => console.log('Search:', query)}
        onToggleTheme={toggleTheme} // Passes the theme toggle function to the Header component.
        isDark={theme === 'dark'} // Passes the current dark mode status.
      />
      <main className="flex-1">
        <Router /> {/* Renders the core application routes */}
      </main>
      <Footer />
    </div>
  );
}

// -----------------------------------------------------------------------------
// 3. App Root Component (Provider Stack)
// -----------------------------------------------------------------------------

// The root application component, setting up all necessary global contexts.
function App() {
  return (
    // 1. TanStack Query Provider: Enables global state management and API caching.
    <QueryClientProvider client={queryClient}>
      {/* 2. Auth Provider: Manages user session state globally. */}
      <AuthProvider>
        {/* 3. Tooltip Provider: Required by Radix UI for tooltips. */}
        <TooltipProvider>
          {/* 4. Theme Provider: Manages and applies light/dark mode classes. */}
          <ThemeProvider>
            <AppContent /> {/* Renders the application structure. */}
            <Toaster /> {/* Renders the notification system viewport (must be outside the main layout). */}
          </ThemeProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;