// Referenced from blueprint:javascript_auth_all_persistance
import { useAuth } from "@/hooks/use-auth"; // Imports the custom hook to access global authentication state (user, isLoading).
import { Loader2 } from "lucide-react"; // Imports a spinner icon for the loading state.
import { Redirect, Route } from "wouter"; // Imports wouter components for routing definition and redirection.

// -----------------------------------------------------------------------------
// 1. ProtectedRoute Component
// -----------------------------------------------------------------------------

// Defines a route component that enforces authentication before rendering its content.
export function ProtectedRoute({
  path, // The URL path this route should match.
  component: Component, // The component to render if the user is authenticated.
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  // Destructures user and loading state from the authentication context.
  const { user, isLoading } = useAuth();

  // Case 1: Loading State
  if (isLoading) {
    return (
      // Defines the route path.
      <Route path={path}>
        {/* Displays a centered loading spinner while the authentication status is being determined. */}
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  // Case 2: Unauthenticated State (Access Denied)
  if (!user) {
    return (
      <Route path={path}>
        {/* Redirects the user to the '/auth' route (login page) if they are not logged in. */}
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Case 3: Authenticated State (Access Granted)
  // Renders the specified component, passing control to the wrapped component.
  return <Route path={path} component={Component} />;
}