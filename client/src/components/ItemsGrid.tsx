import { useState } from "react";
import ItemCard from "./ItemCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, X } from "lucide-react";
import type { ItemWithSeller } from "@shared/schema";

interface ItemsGridProps {
  items: ItemWithSeller[];
  onItemClick?: (item: ItemWithSeller) => void;
  onContactSeller?: (item: ItemWithSeller) => void;
}

const CATEGORIES = [
  "Electronics",
  "Textbooks", 
  "Furniture",
  "Clothing",
  "School Supplies",
  "Sports & Recreation",
  "Other"
];

const CONDITIONS = ["new", "like-new", "good", "fair"];

export default function ItemsGrid({ items, onItemClick, onContactSeller }: ItemsGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [priceRange, setPriceRange] = useState([1000]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesCondition = !selectedCondition || item.condition === selectedCondition;
    const matchesPrice = parseFloat(item.price) <= priceRange[0];
    
    return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "newest":
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedCondition("");
    setPriceRange([1000]);
    setSortBy("newest");
  };

  const activeFiltersCount = [selectedCategory, selectedCondition, searchQuery].filter(Boolean).length + (priceRange[0] < 1000 ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
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

        {/* Sort */}
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

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
          data-testid="button-filters"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 border rounded-lg bg-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Filters</h3>
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
                  <SelectItem value="">All Categories</SelectItem>
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
                  <SelectItem value="">Any Condition</SelectItem>
                  {CONDITIONS.map(condition => (
                    <SelectItem key={condition} value={condition}>
                      {condition.charAt(0).toUpperCase() + condition.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Max Price: ${priceRange[0]}
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

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground" data-testid="text-results-count">
          {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedItems.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            onViewDetails={() => onItemClick?.(item)}
            onContact={() => onContactSeller?.(item)}
          />
        ))}
      </div>

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