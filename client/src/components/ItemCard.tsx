import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, ShoppingCart, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ItemWithSeller } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  item: ItemWithSeller;
  onViewDetails?: () => void;
  onContact?: () => void;
  isFavorited?: boolean;
}

export default function ItemCard({ item, onViewDetails, onContact, isFavorited = false }: ItemCardProps) {
  const [isLiked, setIsLiked] = useState(isFavorited);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cartQuantity, setCartQuantity] = useState(1);
  const { toast } = useToast();
  
  const images = item.images && item.images.length > 0 ? item.images : ["/api/placeholder/300/225"];
  const hasMultipleImages = images.length > 1;
  const maxQuantity = item.quantity || 1;
  const isOutOfStock = maxQuantity <= 0;
  
  // Reset cart quantity when item changes
  useEffect(() => {
    setCartQuantity(1);
  }, [item.id]);

  const goToPreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const addToCartMutation = useMutation({
    mutationFn: async (quantity: number) => {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ itemId: item.id, quantity }),
      });
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      return response.json();
    },
    onSuccess: (_, quantity) => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Added to cart",
        description: `${quantity} x ${item.title} has been added to your cart.`,
      });
      setCartQuantity(1); // Reset quantity after adding
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleQuantityChange = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCartQuantity(prev => Math.max(1, Math.min(prev + delta, maxQuantity)));
  };

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (currentLikedState: boolean) => {
      if (currentLikedState) {
        await apiRequest('DELETE', `/api/favorites/${item.id}`);
        return false;
      } else {
        await apiRequest('POST', '/api/favorites', { itemId: item.id });
        return true;
      }
    },
    onMutate: async () => {
      const previousState = isLiked;
      setIsLiked(prev => !prev);
      return { previousState };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
    },
    onError: (_error, _variables, context) => {
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

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "like-new": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "good": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "fair": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <Card className="group hover-elevate transition-all duration-200" data-testid={`card-item-${item.id}`}>
      {/* Clickable image and content area - navigates to detail page */}
      <div className="cursor-pointer" onClick={onViewDetails}>
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
            <img
              src={images[currentImageIndex]}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              data-testid={`img-item-${item.id}`}
            />
            
            {/* Navigation Arrows - Only show if multiple images */}
            {hasMultipleImages && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur hover:bg-white transition-all shadow-lg z-10"
                  onClick={goToPreviousImage}
                  data-testid={`button-prev-image-${item.id}`}
                >
                  <ChevronLeft className="h-6 w-6 text-gray-700" />
                </Button>
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
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 backdrop-blur hover:bg-white/90"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoriteMutation.mutate(isLiked);
            }}
            disabled={toggleFavoriteMutation.isPending}
            data-testid={`button-like-${item.id}`}
          >
            <Heart className={`h-4 w-4 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
          <Badge className={`absolute top-2 left-2 ${getConditionColor(item.condition)}`} data-testid={`badge-condition-${item.id}`}>
            {item.condition}
          </Badge>
        </div>

        <CardContent className="p-4">
          {/* Title - fixed height for consistency */}
          <h3 className="font-semibold text-base line-clamp-2 h-12 group-hover:text-primary transition-colors mb-2" data-testid={`text-title-${item.id}`}>
            {item.title}
          </h3>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-xl text-primary" data-testid={`text-price-${item.id}`}>
            ${parseFloat(item.price).toFixed(2)}
          </span>
          {item.quantity && item.quantity > 1 && (
            <span className="text-xs text-muted-foreground">
              {item.quantity} available
            </span>
          )}
        </div>
        
        {/* Description - fixed height for consistency */}
        <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-3" data-testid={`text-description-${item.id}`}>
          {item.description}
        </p>

        {/* Category Badge */}
        <Badge variant="secondary" data-testid={`badge-category-${item.id}`}>
          {item.category}
        </Badge>
        </CardContent>
      </div>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        {/* Quantity Selector */}
        {maxQuantity > 1 && (
          <div className="flex items-center justify-center gap-2 w-full mb-1">
            <span className="text-xs text-muted-foreground">Qty:</span>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-r-none"
                onClick={(e) => handleQuantityChange(-1, e)}
                disabled={cartQuantity <= 1}
                data-testid={`button-decrease-qty-${item.id}`}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="px-2 text-sm font-medium min-w-[1.5rem] text-center" data-testid={`text-qty-${item.id}`}>
                {cartQuantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-l-none"
                onClick={(e) => handleQuantityChange(1, e)}
                disabled={cartQuantity >= maxQuantity}
                data-testid={`button-increase-qty-${item.id}`}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <span className="text-xs text-muted-foreground">of {maxQuantity}</span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 w-full">
          <Button 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              // Clamp quantity to available stock before submitting
              const safeQuantity = Math.min(cartQuantity, maxQuantity);
              addToCartMutation.mutate(safeQuantity);
            }}
            disabled={addToCartMutation.isPending || isOutOfStock || item.status !== "available"}
            data-testid={`button-add-to-cart-${item.id}`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isOutOfStock ? 'Out of Stock' : `Add${cartQuantity > 1 ? ` (${cartQuantity})` : ''} to Cart`}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onContact?.();
              console.log('Contact seller:', item.seller.username);
            }}
            data-testid={`button-contact-${item.id}`}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}