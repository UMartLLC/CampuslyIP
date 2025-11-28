import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Heart, 
  ShoppingCart, 
  MessageCircle, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Package,
  Tag,
  User,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { ItemWithSeller } from "@shared/schema";

function getConditionColor(condition: string) {
  switch (condition) {
    case "new":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "like-new":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "good":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "fair":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
}

function formatDate(dateString: string | Date | null | undefined) {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ItemDetailPage() {
  const [, params] = useRoute("/items/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const itemId = params?.id;

  const { data: item, isLoading, error } = useQuery<ItemWithSeller>({
    queryKey: ["/api/items", itemId],
    queryFn: async () => {
      const response = await fetch(`/api/items/${itemId}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch item");
      }
      return response.json();
    },
    enabled: !!itemId,
  });

  const { data: favorites = [] } = useQuery<{ itemId: string }[]>({
    queryKey: ["/api/favorites"],
  });

  const isFavorited = favorites.some((fav) => fav.itemId === itemId);

  const addToCartMutation = useMutation({
    mutationFn: async (itemToAdd: { id: string; title: string }) => {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ itemId: itemToAdd.id }),
      });
      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }
      return response.json();
    },
    onSuccess: (_, itemToAdd) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${itemToAdd.title} has been added to your cart.`,
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

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (currentLikedState: boolean) => {
      if (currentLikedState) {
        await apiRequest("DELETE", `/api/favorites/${itemId}`);
        return false;
      } else {
        await apiRequest("POST", "/api/favorites", { itemId });
        return true;
      }
    },
    onMutate: async () => {
      setIsLiked((prev) => !prev);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
    onError: () => {
      setIsLiked((prev) => !prev);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-muted rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-12 bg-muted rounded w-1/4"></div>
              <div className="h-24 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/items")}
          className="mb-6"
          data-testid="button-back-to-marketplace"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Item Not Found</h2>
          <p className="text-muted-foreground mb-4">
            This item may have been removed or is no longer available.
          </p>
          <Button onClick={() => setLocation("/items")} data-testid="button-browse-items">
            Browse Items
          </Button>
        </Card>
      </div>
    );
  }

  const images = item.images && item.images.length > 0 ? item.images : ["/api/placeholder/600/600"];
  const hasMultipleImages = images.length > 1;

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const sellerName = item.seller?.firstName && item.seller?.lastName
    ? `${item.seller.firstName} ${item.seller.lastName}`
    : item.seller?.username || "Anonymous Seller";

  const sellerInitials = item.seller?.firstName && item.seller?.lastName
    ? `${item.seller.firstName[0]}${item.seller.lastName[0]}`
    : "AS";

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Button
        variant="ghost"
        onClick={() => setLocation("/items")}
        className="mb-6"
        data-testid="button-back-to-marketplace"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Marketplace
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt={item.title}
              className="w-full h-full object-cover"
              data-testid="img-item-main"
            />
            
            {hasMultipleImages && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur hover:bg-white shadow-lg"
                  onClick={goToPreviousImage}
                  data-testid="button-prev-image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur hover:bg-white shadow-lg"
                  onClick={goToNextImage}
                  data-testid="button-next-image"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            <Badge 
              className={`absolute top-4 left-4 ${getConditionColor(item.condition)}`}
              data-testid="badge-condition"
            >
              {item.condition}
            </Badge>

            {item.status === "sold" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  SOLD
                </Badge>
              </div>
            )}
          </div>

          {hasMultipleImages && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-muted-foreground/30"
                  }`}
                  data-testid={`button-thumbnail-${index}`}
                >
                  <img
                    src={img}
                    alt={`${item.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl lg:text-3xl font-bold" data-testid="text-item-title">
                {item.title}
              </h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleFavoriteMutation.mutate(isFavorited || isLiked)}
                  disabled={toggleFavoriteMutation.isPending}
                  data-testid="button-favorite"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isFavorited || isLiked ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({ title: "Link copied to clipboard" });
                  }}
                  data-testid="button-share"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {item.category}
              </Badge>
              {item.subcategory && (
                <Badge variant="outline">{item.subcategory}</Badge>
              )}
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary" data-testid="text-item-price">
              ${parseFloat(item.price).toFixed(2)}
            </span>
            {item.status === "available" && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Available
              </Badge>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Description</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap" data-testid="text-item-description">
              {item.description}
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Item Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>Condition: <strong className="text-foreground">{item.condition}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Listed: <strong className="text-foreground">{formatDate(item.createdAt)}</strong></span>
              </div>
            </div>
          </div>

          <Separator />

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={item.seller?.profileImageUrl || undefined} />
                  <AvatarFallback>{sellerInitials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium" data-testid="text-seller-name">{sellerName}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Seller</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/messages")}
                  data-testid="button-contact-seller"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={() => addToCartMutation.mutate({ id: item.id, title: item.title })}
              disabled={addToCartMutation.isPending || item.status !== "available"}
              data-testid="button-add-to-cart"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setLocation("/cart")}
              data-testid="button-view-cart"
            >
              View Cart
            </Button>
          </div>

          {item.status !== "available" && (
            <p className="text-center text-muted-foreground text-sm">
              This item is currently {item.status} and cannot be purchased.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
