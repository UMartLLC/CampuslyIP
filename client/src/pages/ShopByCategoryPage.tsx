import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
// Imports Lucide icons used for each category card.
import { Book, Laptop, Armchair, Shirt, PencilRuler, Dumbbell, MoreHorizontal } from "lucide-react";
// Imports the useQuery hook from TanStack Query for data fetching.
import { useQuery } from "@tanstack/react-query";
// Imports the type definition for item data.
import type { ItemWithSeller } from "@shared/schema";

// Configuration array defining the name, icon, and specific color for each category.
const categoryConfig = [
  { name: "Electronics", icon: Laptop, color: "text-purple-500" },
  { name: "Textbooks", icon: Book, color: "text-blue-500" },
  { name: "Furniture", icon: Armchair, color: "text-orange-500" },
  { name: "Clothing", icon: Shirt, color: "text-pink-500" },
  { name: "School Supplies", icon: PencilRuler, color: "text-cyan-500" },
  { name: "Sports & Recreation", icon: Dumbbell, color: "text-green-500" },
  { name: "Other", icon: MoreHorizontal, color: "text-gray-500" },
];

// -----------------------------------------------------------------------------
// 1. ShopByCategoryPage Component
// -----------------------------------------------------------------------------

export default function ShopByCategoryPage() {
  // Fetches all items from the API to calculate category counts.
  const { data: items = [], isLoading } = useQuery<ItemWithSeller[]>({
    queryKey: ['/api/items'],
  });

  // Calculates the count of items in each category.
  const categoryCounts = items.reduce((acc, item) => {
    // Normalize category name for reliable comparison.
    const normalizedCategory = item.category.toLowerCase();
    
    // Finds the matching configuration based on the item's category name (using broad matching).
    const matchingConfig = categoryConfig.find(
      cat => cat.name.toLowerCase() === normalizedCategory || 
             cat.name.toLowerCase().includes(normalizedCategory) ||
             normalizedCategory.includes(cat.name.toLowerCase())
    );
    
    // Increments the count for the matched category name from config.
    if (matchingConfig) {
      acc[matchingConfig.name] = (acc[matchingConfig.name] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Creates the final array by merging the static config with the dynamic item counts.
  const categories = categoryConfig.map(cat => ({
    ...cat,
    count: categoryCounts[cat.name] || 0 // Defaults count to 0 if no items are found.
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop By Category</h1>
      
      {isLoading ? (
        // Loading state display.
        <div className="text-center text-muted-foreground">Loading categories...</div>
      ) : (
        // Grid display of category cards.
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon; // Dynamic icon component.
            return (
              // Link wraps the entire card, navigating to the /items page with a category filter query parameter.
              <Link key={category.name} href={`/items?category=${category.name.toLowerCase()}`}>
                <Card className="hover-elevate cursor-pointer" data-testid={`category-${category.name.toLowerCase()}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Icon container with colored text specific to the category. */}
                      <div className={`p-4 rounded-lg bg-muted ${category.color}`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{category.name}</h3>
                        {/* Displays the calculated item count. */}
                        <p className="text-sm text-muted-foreground" data-testid={`text-count-${category.name.toLowerCase()}`}>
                          {category.count} {category.count === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}