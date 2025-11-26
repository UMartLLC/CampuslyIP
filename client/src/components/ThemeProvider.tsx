import { createContext, useContext, useEffect, useState } from "react";

// Defines the possible types for the theme state.
type Theme = "light" | "dark";

// -----------------------------------------------------------------------------
// 1. Context Interface
// -----------------------------------------------------------------------------

// Defines the structure of the object provided by the Theme Context.
interface ThemeContextProps {
  theme: Theme; // The current theme value ("light" or "dark").
  toggleTheme: () => void; // Function to switch between "light" and "dark".
}

// Creates the React Context object with an initial value of undefined.
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// -----------------------------------------------------------------------------
// 2. useTheme Hook
// -----------------------------------------------------------------------------

// Custom hook to consume the Theme Context.
export function useTheme() {
  const context = useContext(ThemeContext);
  // Ensures the hook is used inside a ThemeProvider.
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// -----------------------------------------------------------------------------
// 3. Theme Provider Component
// -----------------------------------------------------------------------------

// Defines the props for the ThemeProvider component (accepts React children).
interface ThemeProviderProps {
  children: React.ReactNode;
}

// The component responsible for managing the theme state and applying it globally.
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initializes the theme state.
  const [theme, setTheme] = useState<Theme>(() => {
    // Initialization function runs only on the first render:
    const stored = localStorage.getItem("theme");
    // Attempts to retrieve the theme from localStorage, defaulting to "light" if none is found.
    return (stored as Theme) || "light"; 
  });

  // Effect hook runs whenever the 'theme' state changes.
  useEffect(() => {
    const root = document.documentElement; // Targets the root <html> element of the document.
    // Removes both classes to ensure consistency.
    root.classList.remove("light", "dark");
    // Adds the current theme class (e.g., 'dark') to the root element for global CSS styling.
    root.classList.add(theme);
    // Persists the current theme setting in the browser's localStorage.
    localStorage.setItem("theme", theme);
  }, [theme]); // Dependency array ensures effect re-runs only when 'theme' changes.

  // Function to switch the theme state between "light" and "dark".
  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    // Provides the current theme state and the toggle function to all descendant components.
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}