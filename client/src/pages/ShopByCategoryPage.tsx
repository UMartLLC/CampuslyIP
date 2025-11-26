import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Book, Laptop, Armchair, Shirt, PencilRuler, Dumbbell, MoreHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { ItemWithSeller } from "@shared/schema";

const categoryConfig = [
  { name: "Electronics", icon: Laptop, color: "text-purple-500" },
  { name: "Textbooks", icon: Book, color: "text-blue-500" },
  { name: "Furniture", icon: Armchair, color: "text-orange-500" },
  { name: "Clothing", icon: Shirt, color: "text-pink-500" },
  { name: "School Supplies", icon: PencilRuler, color: "text-cyan-500" },
  { name: "Sports & Recreation", icon: Dumbbell, color: "text-green-500" },
  { name: "Other", icon: MoreHorizontal, color: "text-gray-500" },
];

export default function ShopByCategoryPage() {
  const { data: items = [], isLoading } = useQuery<ItemWithSeller[]>({
    queryKey: ['/api/items'],
  });

  // Count items by category (case-insensitive matching)
  const categoryCounts = items.reduce((acc, item) => {
    // Normalize category name to match config
    const normalizedCategory = item.category.toLowerCase();
    
    // Find matching category config
    const matchingConfig = categoryConfig.find(
      cat => cat.name.toLowerCase() === normalizedCategory || 
             cat.name.toLowerCase().includes(normalizedCategory) ||
             normalizedCategory.includes(cat.name.toLowerCase())
    );
    
    if (matchingConfig) {
      acc[matchingConfig.name] = (acc[matchingConfig.name] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Combine category config with counts
  const categories = categoryConfig.map(cat => ({
    ...cat,
    count: categoryCounts[cat.name] || 0
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop By Category</h1>
      
      {isLoading ? (
        <div className="text-center text-muted-foreground">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.name} href={`/items?category=${category.name.toLowerCase()}`}>
                <Card className="hover-elevate cursor-pointer" data-testid={`category-${category.name.toLowerCase()}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-lg bg-muted ${category.color}`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{category.name}</h3>
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
