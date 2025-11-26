// Referenced from blueprint:javascript_auth_all_persistance
import { createContext, ReactNode, useContext } from "react";
import {
  useQuery, // Hook to fetch and manage user state.
  useMutation, // Hook to handle login, logout, and registration actions.
  UseMutationResult, // TypeScript type for mutation return.
} from "@tanstack/react-query";
// Imports shared TypeScript types for User and InsertUser data structure.
import { type User, type InsertUser } from "@shared/schema";
// Imports custom utility functions for API requests and the Query Client instance.
import { apiRequest, queryClient } from "../lib/queryClient";
// Imports the local toast notification hook.
import { useToast } from "@/hooks/use-toast";

// -----------------------------------------------------------------------------
// 1. Context Types and Initialization
// -----------------------------------------------------------------------------

// Defines the shape of the object provided by the AuthContext.
type AuthContextType = {
  user: User | null; // The authenticated user object or null.
  isLoading: boolean; // Loading state of the initial user fetch.
  error: Error | null; // Error from the initial user fetch.
  loginMutation: UseMutationResult<User, Error, LoginData>; // Mutation for logging in.
  logoutMutation: UseMutationResult<void, Error, void>; // Mutation for logging out.
  registerMutation: UseMutationResult<User, Error, InsertUser>; // Mutation for registering.
};

// Defines the data structure expected for the login mutation.
type LoginData = Pick<InsertUser, "username" | "password"> & { rememberMe?: boolean };

// Creates the React Context object, initialized to null.
export const AuthContext = createContext<AuthContextType | null>(null);

// -----------------------------------------------------------------------------
// 2. Auth Provider Component
// -----------------------------------------------------------------------------

// The main provider component that wraps the application and manages all auth logic.
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  // UseQuery: Fetches the current user state on initial load.
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["/api/user"], // Unique key for caching the user data.
    retry: false, // Prevents retries on failure (especially if 401).
    queryFn: async () => {
      try {
        // Tries to fetch the user session data. 'credentials: "include"' is vital for cookies/sessions.
        const res = await fetch("/api/user", { credentials: "include" });
        if (!res.ok) {
          // If response is 401 (Unauthorized), means no active session, so return null user.
          if (res.status === 401) {
            return null;
          }
          // Throws error for other HTTP status codes.
          throw new Error(await res.text());
        }
        return await res.json(); // Returns the user object on success.
      } catch (error) {
        // Catches network errors or explicitly handles 401 errors if they skip the previous check.
        if (error instanceof Error && error.message.includes("401")) {
          return null;
        }
        throw error;
      }
    },
  });

  // UseMutation: Handles the user login process.
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      // Calls the custom API request utility for the POST request.
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json(); // Returns the authenticated user object.
    },
    onSuccess: (user: User) => {
      // Optimistically updates the user state in the cache immediately upon successful login.
      queryClient.setQueryData(["/api/user"], user);
    },
    onError: (error: Error) => {
      // Shows a toast notification on login failure.
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // UseMutation: Handles the user registration process.
  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      // Calls the custom API request utility for the POST request.
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json(); // Returns the newly created and authenticated user object.
    },
    onSuccess: (user: User) => {
      // Optimistically updates the user state in the cache upon successful registration.
      queryClient.setQueryData(["/api/user"], user);
    },
    onError: (error: Error) => {
      // Shows a toast notification on registration failure.
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // UseMutation: Handles the user logout process.
  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Sends a request to terminate the server session.
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      // Clears the user state from the cache immediately upon successful logout.
      queryClient.setQueryData(["/api/user"], null);
    },
    onError: (error: Error) => {
      // Shows a toast notification on logout failure (though rare).
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    // Provides the authentication state and mutation functions to the rest of the application.
    <AuthContext.Provider
      value={{
        user: user ?? null, // Ensures user is always null if undefined.
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// -----------------------------------------------------------------------------
// 3. useAuth Hook
// -----------------------------------------------------------------------------

// Custom hook to consume the AuthContext conveniently.
export function useAuth() {
  const context = useContext(AuthContext);
  // Ensures the hook is used inside an AuthProvider.
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}