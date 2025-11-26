import HeroSection from "@/components/HeroSection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Laptop, Home, Shirt, PenTool, Dumbbell, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import marketplaceImage from '@assets/generated_images/Student_marketplace_items_e4885668.png';

const CATEGORIES = [
  { name: "Electronics", icon: Laptop, count: "120+ items", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" },
  { name: "Textbooks", icon: BookOpen, count: "85+ items", color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
  { name: "Furniture", icon: Home, count: "45+ items", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400" },
  { name: "Clothing", icon: Shirt, count: "60+ items", color: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400" },
  { name: "School Supplies", icon: PenTool, count: "35+ items", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400" },
  { name: "Sports & Recreation", icon: Dumbbell, count: "25+ items", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400" }
];

export default function Welcome() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Categories Section */}
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find exactly what you need from fellow students, faculty, and staff on your campus
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.name} href={`/items?category=${encodeURIComponent(category.name)}`}>
                  <Card className="h-full hover-elevate cursor-pointer transition-all duration-200" data-testid={`card-category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2 text-sm">{category.name}</h3>
                      <Badge variant="secondary" className={`text-xs ${category.color}`}>
                        {category.count}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link href="/items">
              <Button size="lg" variant="outline" data-testid="button-view-all-items">
                View All Items
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              How the Campusly Marketplace Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              It's Simple, Safe, and Secure
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">List Your Item</h3>
              <p className="text-muted-foreground">
                Take photos, add details, and set your price. Listing is free and takes just minutes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect Safely</h3>
              <p className="text-muted-foreground">
                Chat with verified students on your campus. Arrange meetups in safe, public locations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Paid Securely</h3>
              <p className="text-muted-foreground">
                Choose from multiple payment options. Payments are protected and processed instantly.
              </p>
            </div>
          </div>

          {/* Featured Items Preview */}
          <div className="relative rounded-2xl overflow-hidden">
            <img 
              src={marketplaceImage} 
              alt="Student marketplace items" 
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Join the Hundreds Already Trading
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/items">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-100" data-testid="button-start-shopping">
                    Start Shopping
                  </Button>
                </Link>
                <Link href="/sell">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" data-testid="button-start-selling">
                    Start Selling
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}