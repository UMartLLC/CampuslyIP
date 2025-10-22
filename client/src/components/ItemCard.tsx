import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ItemWithSeller } from "@shared/schema";

interface ItemCardProps {
  item: ItemWithSeller;
  onViewDetails?: () => void;
  onContact?: () => void;
}

export default function ItemCard({ item, onViewDetails, onContact }: ItemCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ itemId: item.id }),
      });
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      return response.json();
    },
    onSuccess: () => {
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
    <Card className="group hover-elevate cursor-pointer transition-all duration-200" onClick={onViewDetails} data-testid={`card-item-${item.id}`}>
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
          <img
            src={item.images?.[0] || "/api/placeholder/300/225"}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            data-testid={`img-item-${item.id}`}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 backdrop-blur hover:bg-white/90"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
            console.log('Item liked:', item.id);
          }}
          data-testid={`button-like-${item.id}`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </Button>
        <Badge className={`absolute top-2 left-2 ${getConditionColor(item.condition)}`} data-testid={`badge-condition-${item.id}`}>
          {item.condition}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-title-${item.id}`}>
            {item.title}
          </h3>
          <span className="font-bold text-xl text-primary ml-2" data-testid={`text-price-${item.id}`}>
            ${item.price}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3" data-testid={`text-description-${item.id}`}>
          {item.description}
        </p>

        <Badge variant="secondary" className="mb-3" data-testid={`badge-category-${item.id}`}>
          {item.category}
        </Badge>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-muted">
                AS
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground" data-testid={`text-seller-${item.id}`}>
              Anonymous Seller
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            addToCartMutation.mutate();
          }}
          disabled={addToCartMutation.isPending}
          data-testid={`button-add-to-cart-${item.id}`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
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
      </CardFooter>
    </Card>
  );
}