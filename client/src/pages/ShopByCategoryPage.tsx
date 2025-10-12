import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Book, Laptop, Armchair, Shirt, Dumbbell, MoreHorizontal } from "lucide-react";

const categories = [
  { name: "Textbooks", icon: Book, color: "text-blue-500", count: 45 },
  { name: "Electronics", icon: Laptop, color: "text-purple-500", count: 32 },
  { name: "Furniture", icon: Armchair, color: "text-orange-500", count: 28 },
  { name: "Clothing", icon: Shirt, color: "text-pink-500", count: 56 },
  { name: "Sports", icon: Dumbbell, color: "text-green-500", count: 19 },
  { name: "Other", icon: MoreHorizontal, color: "text-gray-500", count: 23 },
];

export default function ShopByCategoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop By Category</h1>
      
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
                      <p className="text-sm text-muted-foreground">
                        {category.count} items
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
