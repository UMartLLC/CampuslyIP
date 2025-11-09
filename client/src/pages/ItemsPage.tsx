import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ItemsGrid from "@/components/ItemsGrid";
import PaymentModal from "@/components/PaymentModal";
import type { ItemWithSeller } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Menu, X, SlidersHorizontal, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CATEGORY_CONFIG, getAllCategories, getSubcategories } from "@shared/categories";
import { useLocation } from "wouter";

export default function ItemsPage() {
  const [location] = useLocation();
  const [selectedItem, setSelectedItem] = useState<ItemWithSeller | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Parse search query from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [location]);

  const { data: items = [], isLoading } = useQuery<ItemWithSeller[]>({
    queryKey: ['/api/items'],
  });

  const categories = getAllCategories();
  const conditions = ["new", "like-new", "good", "fair"];

  const toggleCategory = (category: string) => {
    const isCurrentlyExpanded = expandedCategories.includes(category);
    
    // If unchecking (collapsing) a category, also uncheck all its subcategories
    if (isCurrentlyExpanded) {
      const subcategoriesToRemove = getSubcategories(category);
      setSelectedSubcategories(prev => 
        prev.filter(sub => !subcategoriesToRemove.includes(sub))
      );
    }
    
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

  const filteredItems = items.filter(item => {
    // Filter by search query
    let searchMatch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      searchMatch = 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.subcategory?.toLowerCase().includes(query) || false);
    }
    
    // Filter by category and subcategory
    let categoryMatch = true;
    if (selectedSubcategories.length > 0) {
      // If subcategories are selected, filter by them
      categoryMatch = item.subcategory ? selectedSubcategories.includes(item.subcategory) : false;
    } else if (expandedCategories.length > 0) {
      // If only categories are expanded (no subcategories selected), show all items in those categories
      categoryMatch = expandedCategories.includes(item.category);
    }
    
    const conditionMatch = selectedConditions.length === 0 || selectedConditions.includes(item.condition);
    return searchMatch && categoryMatch && conditionMatch;
  });

  const handleItemClick = (item: ItemWithSeller) => {
    setSelectedItem(item);
    setIsPaymentModalOpen(true);
  };

  const handleContactSeller = (item: ItemWithSeller) => {
    const sellerName = item.seller.firstName && item.seller.lastName 
      ? `${item.seller.firstName} ${item.seller.lastName}`
      : item.seller.username;
    console.log('Contacting seller:', sellerName);
    alert(`Coming soon: Direct messaging with ${sellerName}`);
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
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse Items'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {searchQuery 
                ? `Showing ${filteredItems.length} result${filteredItems.length !== 1 ? 's' : ''}`
                : 'Discover great deals from fellow students on your campus'}
            </p>
          </div>

          {filteredItems.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 px-4" data-testid="empty-state">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">
                {searchQuery ? 'No Items Found' : 'No items available'}
              </h3>
              <p className="text-muted-foreground max-w-md mb-6 text-center">
                {searchQuery 
                  ? `We couldn't find any items matching "${searchQuery}". Try a different search term or browse all items.`
                  : 'No items match your current filters. Try adjusting your filters or check back later.'}
              </p>
              {(searchQuery || selectedSubcategories.length > 0 || selectedConditions.length > 0 || expandedCategories.length > 0) && (
                <Button
                  onClick={() => {
                    setExpandedCategories([]);
                    setSelectedSubcategories([]);
                    setSelectedConditions([]);
                    setSearchQuery("");
                    window.history.pushState({}, '', '/items');
                  }}
                  data-testid="button-clear-filters-empty"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <ItemsGrid
              items={filteredItems}
              onItemClick={handleItemClick}
              onContactSeller={handleContactSeller}
            />
          )}
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
