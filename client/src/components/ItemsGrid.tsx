import { useState } from "react";
// Imports the ItemCard component for displaying individual items.
import ItemCard from "./ItemCard";
// Imports UI components for input, buttons, badges, selection, and sliders.
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
// Imports icons for search, filter, and close actions.
import { Search, Filter, X } from "lucide-react";
// Imports type definition for item data including seller details.
import type { ItemWithSeller } from "@shared/schema";

// -----------------------------------------------------------------------------
// 1. Component Props Interface & Constants
// -----------------------------------------------------------------------------

interface ItemsGridProps {
  items: ItemWithSeller[]; // The full list of items to be filtered and displayed.
  onItemClick?: (item: ItemWithSeller) => void; // Handler for clicking on an item card.
  onContactSeller?: (item: ItemWithSeller) => void; // Handler for contacting the seller.
}

// Static list of categories for the filter dropdown.
const CATEGORIES = [
  "Electronics",
  "Textbooks", 
  "Furniture",
  "Clothing",
  "School Supplies",
  "Sports & Recreation",
  "Other"
];

// Static list of conditions for the filter dropdown.
const CONDITIONS = ["new", "like-new", "good", "fair"];

// -----------------------------------------------------------------------------
// 2. ItemsGrid Component
// -----------------------------------------------------------------------------

export default function ItemsGrid({ items, onItemClick, onContactSeller }: ItemsGridProps) {
  // State for search input value.
  const [searchQuery, setSearchQuery] = useState("");
  // State for the selected category filter.
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  // State for the selected condition filter.
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  // State for the maximum price range filter (slider uses an array of numbers).
  const [priceRange, setPriceRange] = useState([1000]);
  // State for the selected sorting method.
  const [sortBy, setSortBy] = useState("newest");
  // State to control the visibility of the detailed filter panel.
  const [showFilters, setShowFilters] = useState(false);

  // -----------------------------------------------------------------------------
  // 3. Filtering Logic
  // -----------------------------------------------------------------------------

  const filteredItems = items.filter(item => {
    // Check if item title or description matches the search query (case-insensitive).
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    // Check if the item category matches the selected category (or if no category is selected).
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || item.category === selectedCategory;
    // Check if the item condition matches the selected condition (or if no condition is selected).
    const matchesCondition = !selectedCondition || selectedCondition === 'all' || item.condition === selectedCondition;
    // Check if the item price is within the selected max price range.
    const matchesPrice = parseFloat(item.price) <= priceRange[0];
    
    // An item must match all active criteria.
    return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
  });

  // -----------------------------------------------------------------------------
  // 4. Sorting Logic
  // -----------------------------------------------------------------------------

  // Creates a copy of filteredItems and sorts it based on the 'sortBy' state.
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price); // Ascending price.
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price); // Descending price.
      case "newest":
        // Sorts by creation date, newest first (descending timestamp).
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      default:
        return 0; // No sort.
    }
  });

  // -----------------------------------------------------------------------------
  // 5. Filter Management
  // -----------------------------------------------------------------------------

  // Resets all filter states to their default values.
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCondition("all");
    setPriceRange([1000]); // Resets max price to the max slider value.
    setSortBy("newest");
  };

  // Calculates the number of active filters (currently unused in the UI but available).
  const activeFiltersCount = [selectedCategory, selectedCondition, searchQuery].filter(Boolean).length + (priceRange[0] < 1000 ? 1 : 0);

  // -----------------------------------------------------------------------------
  // 6. Component Render
  // -----------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Search and Sort Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-items"
          />
        </div>

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full lg:w-[180px]" data-testid="select-sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

      </div>
      
      {/* Filter Panel (Conditionally Rendered) */}
      {showFilters && (
        <div className="p-4 border rounded-lg bg-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Filters</h3>
            {/* Clear All Filters Button */}
            <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Condition</label>
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger data-testid="select-condition">
                  <SelectValue placeholder="Any Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Condition</SelectItem>
                  {CONDITIONS.map(condition => (
                    <SelectItem key={condition} value={condition}>
                      {/* Capitalizes first letter for display */}
                      {condition.charAt(0).toUpperCase() + condition.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Slider */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Max Price: ${priceRange[0]} {/* Displays current selected max price */}
              </label>
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value)}
                max={1000}
                min={0}
                step={25}
                className="mt-2"
                data-testid="slider-price"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Results Info and Toggle Filter Button (Currently Hidden in provided JSX structure, but logic exists) */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground" data-testid="text-results-count">
          {/* Displays the count of items after filtering and sorting */}
          {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''} found
        </p>
        {/* Note: The button to toggle 'showFilters' is missing from the provided JSX in this div, 
                 but the 'showFilters' state and logic are present. */}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Maps through the final sorted list of items and renders an ItemCard for each. */}
        {sortedItems.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            onViewDetails={() => onItemClick?.(item)}
            onContact={() => onContactSeller?.(item)}
          />
        ))}
      </div>

      {/* No Results Message */}
      {sortedItems.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No items found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or browse all available items.
          </p>
          <Button onClick={clearFilters} data-testid="button-clear-search">
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
}