import { Card, CardContent } from "@/components/ui/card";
// Imports the AlertCircle icon from lucide-react.
import { AlertCircle } from "lucide-react";

// -----------------------------------------------------------------------------
// 1. NotFound Component (404 Error Page)
// -----------------------------------------------------------------------------

// Defines the default component rendered when a user navigates to an undefined route (404 error).
export default function NotFound() {
  return (
    // Sets the page to take up at least the full viewport height and centers the content horizontally and vertically.
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      {/* Card container with a maximum width limit, centered on the screen. */}
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          {/* Header area combining an icon and the main title. */}
          <div className="flex mb-4 gap-2">
            {/* Alert icon styled with red color. */}
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          {/* Diagnostic message often used during development. */}
          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}