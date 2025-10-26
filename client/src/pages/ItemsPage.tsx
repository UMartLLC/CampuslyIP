import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ItemsGrid from "@/components/ItemsGrid";
import PaymentModal from "@/components/PaymentModal";
import type { ItemWithSeller } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Menu, X, SlidersHorizontal, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CATEGORY_CONFIG, getAllCategories } from "@shared/categories";

export default function ItemsPage() {
  const [selectedItem, setSelectedItem] = useState<ItemWithSeller | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const { data: items = [], isLoading } = useQuery<ItemWithSeller[]>({
    queryKey: ['/api/items'],
  });

  // TODO: remove mock data - fallback for empty state
  const mockItems: ItemWithSeller[] = items.length > 0 ? [] : [
    {
      id: "1",
      title: "MacBook Air M2 - Barely Used",
      description: "Excellent condition MacBook Air with M2 chip, 8GB RAM, 256GB SSD. Perfect for students. Comes with original charger and box.",
      price: "899.99",
      category: "Electronics",
      condition: "like-new",
      images: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400"],
      sellerId: "user1",
      status: "available",
      createdAt: new Date('2024-01-15'),
      seller: {
        id: "user1",
        name: "Sarah Chen",
        username: "sarahc",
        email: "sarah@email.com",
        password: "",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b193?w=100"
      }
    },
    {
      id: "2",
      title: "Calculus Textbook - 8th Edition",
      description: "Stewart's Calculus textbook in good condition. Minimal highlighting, all pages intact. Perfect for Math 101 and 102 courses.",
      price: "89.99",
      category: "Textbooks",
      condition: "good",
      images: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"],
      sellerId: "user2",
      status: "available",
      createdAt: new Date('2024-01-10'),
      seller: {
        id: "user2",
        name: "Mike Johnson",
        username: "mikej",
        email: "mike@email.com",
        password: "",
        avatar: null
      }
    },
    {
      id: "3",
      title: "Study Desk with Chair",
      description: "Wooden study desk with matching chair. Perfect for dorm room. Some scratches but very functional. Dimensions: 48x24 inches.",
      price: "120.00",
      category: "Furniture",
      condition: "fair",
      images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"],
      sellerId: "user3",
      status: "available",
      createdAt: new Date('2024-01-05'),
      seller: {
        id: "user3",
        name: "Alex Kim",
        username: "alexk",
        email: "alex@email.com",
        password: "",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
      }
    },
    {
      id: "4",
      title: "iPhone 14 Pro - Space Black",
      description: "iPhone 14 Pro in excellent condition. Screen protector applied since day one. 128GB storage. Battery health 98%.",
      price: "699.99",
      category: "Electronics",
      condition: "like-new",
      images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"],
      sellerId: "user4",
      status: "available",
      createdAt: new Date('2024-01-12'),
      seller: {
        id: "user4",
        name: "Emma Davis",
        username: "emmad",
        email: "emma@email.com",
        password: "",
        avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100"
      }
    },
    {
      id: "5",
      title: "Organic Chemistry Textbook Bundle",
      description: "Complete set: textbook, study guide, and solution manual. Used for one semester only. Great condition.",
      price: "150.00",
      category: "Textbooks",
      condition: "like-new",
      images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"],
      sellerId: "user5",
      status: "available",
      createdAt: new Date('2024-01-08'),
      seller: {
        id: "user5",
        name: "David Park",
        username: "davidp",
        email: "david@email.com",
        password: "",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
      }
    },
    {
      id: "6",
      title: "Gaming Chair - Ergonomic",
      description: "Comfortable gaming chair with lumbar support. Black and red design. Great for long study sessions.",
      price: "180.00",
      category: "Furniture",
      condition: "good",
      images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"],
      sellerId: "user6",
      status: "available",
      createdAt: new Date('2024-01-03'),
      seller: {
        id: "user6",
        name: "Jessica Wu",
        username: "jessicaw",
        email: "jessica@email.com",
        password: "",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b193?w=100"
      }
    }
  ];

  const displayItems = items.length > 0 ? items : mockItems;

  const categories = getAllCategories();
  const conditions = ["new", "like-new", "good", "fair"];

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategory) ? prev.filter(c => c !== subcategory) : [...prev, subcategory]
    );
  };

  const handleConditionToggle = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
    );
  };

  // Get selected categories based on which subcategories are selected
  const selectedCategories = Array.from(new Set(
    Object.entries(CATEGORY_CONFIG)
      .filter(([_, config]) => 
        config.subcategories.some(sub => selectedSubcategories.includes(sub))
      )
      .map(([category]) => category)
  ));

  const filteredItems = displayItems.filter(item => {
    const subcategoryMatch = selectedSubcategories.length === 0 || 
      (item.subcategory && selectedSubcategories.includes(item.subcategory));
    const conditionMatch = selectedConditions.length === 0 || selectedConditions.includes(item.condition);
    return subcategoryMatch && conditionMatch;
  });

  const handleItemClick = (item: ItemWithSeller) => {
    setSelectedItem(item);
    setIsPaymentModalOpen(true);
  };

  const handleContactSeller = (item: ItemWithSeller) => {
    console.log('Contacting seller:', item.seller.name);
    alert(`Coming soon: Direct messaging with ${item.seller.name}`);
  };

  const handlePaymentComplete = (paymentMethod: string) => {
    console.log('Payment completed:', {
      item: selectedItem?.id,
      method: paymentMethod
    });
    
    setIsPaymentModalOpen(false);
    setSelectedItem(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className={cn(
        "border-r bg-card transition-all duration-300 flex flex-col overflow-y-auto",
        sidebarOpen ? "w-64" : "w-0 overflow-hidden"
      )}>
        <div className="p-4 border-b flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <h2 className="font-semibold">Filters</h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            data-testid="button-close-sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 p-4 space-y-6">
          {/* Categories with expandable subcategories */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm mb-3">Categories</h3>
            {categories.map((category) => {
              const subcategories = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG].subcategories;
              const isExpanded = expandedCategories.includes(category);
              const hasSelectedSubcategories = subcategories.some(sub => selectedSubcategories.includes(sub));
              
              return (
                <div key={category} className="space-y-1">
                  <button
                    onClick={() => toggleCategory(category)}
                    className={cn(
                      "flex items-center justify-between w-full px-2 py-1.5 rounded-md text-sm hover-elevate active-elevate-2",
                      hasSelectedSubcategories && "bg-accent/50"
                    )}
                    data-testid={`button-category-${category.toLowerCase()}`}
                  >
                    <span className={cn(hasSelectedSubcategories && "font-medium")}>
                      {category}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="ml-4 space-y-2 pt-1 pb-2">
                      {subcategories.map((subcategory) => (
                        <div key={subcategory} className="flex items-center space-x-2">
                          <Checkbox
                            id={`subcategory-${subcategory}`}
                            checked={selectedSubcategories.includes(subcategory)}
                            onCheckedChange={() => handleSubcategoryToggle(subcategory)}
                            data-testid={`checkbox-subcategory-${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                          />
                          <Label
                            htmlFor={`subcategory-${subcategory}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {subcategory}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Condition */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Condition</h3>
            <div className="space-y-2">
              {conditions.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={`condition-${condition}`}
                    checked={selectedConditions.includes(condition)}
                    onCheckedChange={() => handleConditionToggle(condition)}
                    data-testid={`checkbox-condition-${condition}`}
                  />
                  <Label
                    htmlFor={`condition-${condition}`}
                    className="text-sm font-normal cursor-pointer capitalize"
                  >
                    {condition.replace('-', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Clear Filters */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setExpandedCategories([]);
              setSelectedSubcategories([]);
              setSelectedConditions([]);
            }}
            data-testid="button-clear-filters"
          >
            Clear All Filters
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              {!sidebarOpen && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  data-testid="button-open-sidebar"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-heading">
                  Browse Items
                </h1>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">
              Discover great deals from fellow students on your campus
            </p>
          </div>

          <ItemsGrid
            items={filteredItems}
            onItemClick={handleItemClick}
            onContactSeller={handleContactSeller}
          />
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}
