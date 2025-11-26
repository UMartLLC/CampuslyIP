import { QueryClient, QueryFunction } from "@tanstack/react-query";

// -----------------------------------------------------------------------------
// 1. Error Handling Utility
// -----------------------------------------------------------------------------

// Asynchronously checks if an HTTP response is successful (res.ok).
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    // If not okay, reads the response body or status text to create a detailed error message.
    const text = (await res.text()) || res.statusText;
    // Throws a new Error including the HTTP status code.
    throw new Error(`${res.status}: ${text}`);
  }
}

// -----------------------------------------------------------------------------
// 2. API Request Utility
// -----------------------------------------------------------------------------

// Utility function to perform a structured API request (used for Mutations).
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined, // Optional body data for POST/PUT/PATCH requests.
): Promise<Response> {
  const res = await fetch(url, {
    method,
    // Sets Content-Type header to JSON if data is provided.
    headers: data ? { "Content-Type": "application/json" } : {},
    // Stringifies the data for the request body.
    body: data ? JSON.stringify(data) : undefined,
    // Ensures cookies and authentication headers are sent with the request (essential for sessions).
    credentials: "include",
  });

  // Throws an error if the response status code is 4xx or 5xx.
  await throwIfResNotOk(res);
  return res;
}

// -----------------------------------------------------------------------------
// 3. Query Function Factory (Reusable Logic for Queries)
// -----------------------------------------------------------------------------

// Defines the behavior when an API request returns a 401 (Unauthorized) status.
type UnauthorizedBehavior = "returnNull" | "throw";

// Factory function that creates a standardized QueryFunction for TanStack Query.
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  // The actual QueryFunction executed by TanStack Query.
  async ({ queryKey }) => {
    // Assumes the URL is the first (and sometimes only) element in the queryKey array.
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include", // Ensures authentication credentials are included.
    });

    // Custom logic: if the behavior is 'returnNull' and status is 401, resolves the query successfully with null data.
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    // Handles all other non-OK status codes (including 401 if behavior is 'throw').
    await throwIfResNotOk(res);
    // Returns the parsed JSON body of the successful response.
    return await res.json();
  };

// -----------------------------------------------------------------------------
// 4. QueryClient Initialization
// -----------------------------------------------------------------------------

// Exports the global QueryClient instance, configured with application defaults.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Sets the default query function to throw an error on 401 (best for public/critical data).
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false, // Disables automatic refetching based on time intervals.
      refetchOnWindowFocus: false, // Disables automatic refetching when the window regains focus.
      staleTime: Infinity, // Treats data as fresh indefinitely (requiring manual invalidation).
      retry: false, // Disables automatic retries on query failure.
    },
    mutations: {
      retry: false, // Disables automatic retries on mutation failure.
    },
  },
});