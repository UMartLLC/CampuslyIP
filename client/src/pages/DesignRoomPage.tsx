import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Imports the Construction icon from lucide-react.
import { Construction } from "lucide-react";

// -----------------------------------------------------------------------------
// 1. DesignRoomPage Component
// -----------------------------------------------------------------------------

// Defines a placeholder page for a feature that is currently under development.
export default function DesignRoomPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Centered card container with maximum width restriction. */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {/* Icon indicating construction/work-in-progress. */}
            <Construction className="h-6 w-6" />
            Design Your Room
          </CardTitle>
          <CardDescription>This feature is coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Descriptive text for the coming soon feature. */}
          <p className="text-muted-foreground">
            We're working on an exciting new feature that will allow you to design and visualize 
            your room layout using items from our marketplace. Stay tuned!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}