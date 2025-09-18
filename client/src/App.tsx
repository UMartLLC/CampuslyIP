import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Welcome from "@/pages/Welcome";
import ItemsPage from "@/pages/ItemsPage";
import AddItemPage from "@/pages/AddItemPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/items" component={ItemsPage} />
      <Route path="/add-item" component={AddItemPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSearch={(query) => console.log('Search:', query)}
        onToggleTheme={toggleTheme}
        isDark={theme === 'dark'}
      />
      <main>
        <Router />
      </main>
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
