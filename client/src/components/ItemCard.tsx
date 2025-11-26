import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Imports icons for interactive elements (Heart, MessageCircle, ShoppingCart) and navigation (ChevronLeft, ChevronRight).
import { Heart, MessageCircle, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
// Imports TanStack Query hooks for mutation handling.
import { useMutation } from "@tanstack/react-query";
// Imports query client and custom API request utility from local library.
import { queryClient, apiRequest } from "@/lib/queryClient";
// Imports local toast notification hook.
import { useToast } from "@/hooks/use-toast";
// Imports type definition for item data including seller details.
import type { ItemWithSeller } from "@shared/schema";
// Utility function for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils";

// -----------------------------------------------------------------------------
// 1. Component Props Interface
// -----------------------------------------------------------------------------

interface ItemCardProps {
  item: ItemWithSeller; // The data object for the item being displayed.
  onViewDetails?: () => void; // Optional handler to navigate/show full item details.
  onContact?: () => void; // Optional handler to initiate contact with the seller.
  isFavorited?: boolean; // Initial state indicating if the item is already a favorite.
}

// -----------------------------------------------------------------------------
// 2. ItemCard Component
// -----------------------------------------------------------------------------

export default function ItemCard({ item, onViewDetails, onContact, isFavorited = false }: ItemCardProps) {
  // State to manage the 'liked' status of the heart icon/favorite action.
  const [isLiked, setIsLiked] = useState(isFavorited);
  // State to track the currently displayed image index in the carousel.
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();
  
  // Uses item images or a placeholder image if no images exist.
  const images = item.images && item.images.length > 0 ? item.images : ["/api/placeholder/300/225"];
  const hasMultipleImages = images.length > 1;

  // Handler to cycle to the previous image, looping to the end if at the start.
  const goToPreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents click from triggering the parent card's onViewDetails handler.
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Handler to cycle to the next image, looping to the start if at the end.
  const goToNextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents click from triggering the parent card's onViewDetails handler.
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Handler to directly set the image index (currently unused in the UI, but useful for dot navigation).
  const goToImage = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  // -----------------------------------------------------------------------------
  // 3. Cart Mutation
  // -----------------------------------------------------------------------------

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ itemId: item.id }), // Sends the item ID to the backend.
      });
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidates the cart query cache to force a refresh of the cart count/details across the app.
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] }); 
      toast({
        title: "Added to cart",
        description: `${item.title} has been added to your cart.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  // -----------------------------------------------------------------------------
  // 4. Favorite Toggle Mutation
  // -----------------------------------------------------------------------------

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (currentLikedState: boolean) => {
      // Determines whether to DELETE (unfavorite) or POST (favorite).
      if (currentLikedState) {
        await apiRequest('DELETE', `/api/favorites/${item.id}`);
        return false; // New state is unfavorited.
      } else {
        await apiRequest('POST', '/api/favorites', { itemId: item.id });
        return true; // New state is favorited.
      }
    },
    onMutate: async () => {
      // Optimistic Update: Immediately changes the UI state before the API call finishes.
      const previousState = isLiked;
      setIsLiked(prev => !prev);
      return { previousState }; // Returns old state in case of rollback.
    },
    onSuccess: () => {
      // Invalidates necessary queries to reflect the change.
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
    },
    onError: (_error, _variables, context) => {
      // Rollback: If the mutation fails, reverts the UI state to the previous state.
      if (context?.previousState !== undefined) {
        setIsLiked(context.previousState);
      }
      toast({
        title: "Error",
        description: "Failed to update favorite. Please try again.",
        variant: "destructive",
      });
    },
  });

  // -----------------------------------------------------------------------------
  // 5. Condition Styling Helper
  // -----------------------------------------------------------------------------

  // Helper function to map item condition status to specific Tailwind color classes.
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "like-new": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "good": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "fair": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  // -----------------------------------------------------------------------------
  // 6. Component Render
  // -----------------------------------------------------------------------------

  return (
    // Main Card container. Click triggers the onViewDetails prop (unless propagation is stopped by a child button).
    <Card className="group hover-elevate cursor-pointer transition-all duration-200" onClick={onViewDetails} data-testid={`card-item-${item.id}`}>
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
          {/* Item Image Display */}
          <img
            src={images[currentImageIndex]} // Displays the currently selected image.
            alt={item.title}
            // Hover effect scales the image slightly for visual appeal.
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            data-testid={`img-item-${item.id}`}
          />
          
          {/* Navigation Arrows - Only rendered if there are multiple images */}
          {hasMultipleImages && (
            <>
              {/* Previous Image Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur hover:bg-white transition-all shadow-lg z-10"
                onClick={goToPreviousImage}
                data-testid={`button-prev-image-${item.id}`}
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </Button>
              {/* Next Image Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur hover:bg-white transition-all shadow-lg z-10"
                onClick={goToNextImage}
                data-testid={`button-next-image-${item.id}`}
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </Button>
            </>
          )}
        </div>
        
        {/* Favorite/Like Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 backdrop-blur hover:bg-white/90"
          onClick={(e) => {
            e.stopPropagation(); // Crucial to prevent card details from opening.
            toggleFavoriteMutation.mutate(isLiked);
          }}
          disabled={toggleFavoriteMutation.isPending}
          data-testid={`button-like-${item.id}`}
        >
          {/* Fills the heart icon red if the item is liked (optimistically updated). */}
          <Heart className={`h-4 w-4 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </Button>
        
        {/* Condition Badge */}
        <Badge className={`absolute top-2 left-2 ${getConditionColor(item.condition)}`} data-testid={`badge-condition-${item.id}`}>
          {item.condition}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          {/* Item Title */}
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-title-${item.id}`}>
            {item.title}
          </h3>
          {/* Item Price */}
          <span className="font-bold text-xl text-primary ml-2" data-testid={`text-price-${item.id}`}>
            ${item.price}
          </span>
        </div>
        
        {/* Item Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3" data-testid={`text-description-${item.id}`}>
          {item.description}
        </p>

        {/* Category Badge */}
        <Badge variant="secondary" data-testid={`badge-category-${item.id}`}>
          {item.category}
        </Badge>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {/* Add to Cart Button */}
        <Button 
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation(); // Crucial to prevent card details from opening.
            addToCartMutation.mutate();
          }}
          disabled={addToCartMutation.isPending}
          data-testid={`button-add-to-cart-${item.id}`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
        {/* Contact Seller Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation(); // Crucial to prevent card details from opening.
            onContact?.();
            console.log('Contact seller:', item.seller.username);
          }}
          data-testid={`button-contact-${item.id}`}
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}