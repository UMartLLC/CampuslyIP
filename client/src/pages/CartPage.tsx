import { useQuery, useMutation } from "@tanstack/react-query";
import { ShoppingCart, Trash2, Package, MessageCircle, Minus, Plus } from 'lucide-react';
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { CartItemWithDetails } from "@shared/schema";

const getConditionColor = (condition: string) => {
  switch (condition) {
    case "new": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "like-new": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "good": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "fair": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const formatCondition = (condition: string) => {
  return condition.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function CartPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: cartItems = [], isLoading } = useQuery<CartItemWithDetails[]>({
    queryKey: ['/api/cart'],
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await apiRequest('DELETE', `/api/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      return await apiRequest('PATCH', `/api/cart/${itemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update quantity.",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', '/api/cart');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear cart.",
        variant: "destructive",
      });
    },
  });

  const handleContactSeller = (sellerId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocation(`/messages?seller=${sellerId}`);
  };

  const handleQuantityChange = (itemId: string, currentQuantity: number, maxQuantity: number, delta: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newQuantity = Math.max(1, Math.min(currentQuantity + delta, maxQuantity));
    if (newQuantity !== currentQuantity) {
      updateQuantityMutation.mutate({ itemId, quantity: newQuantity });
    }
  };

  const handleRemove = (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromCartMutation.mutate(itemId);
  };

  const totalAmount = cartItems.reduce((sum, cartItem) => {
    const quantity = cartItem.quantity || 1;
    return sum + (parseFloat(cartItem.item.price) * quantity);
  }, 0);

  const totalItems = cartItems.reduce((sum, cartItem) => sum + (cartItem.quantity || 1), 0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Title and Clear Cart Button */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>
        {cartItems.length > 0 && (
          <Button
            variant="outline"
            onClick={() => clearCartMutation.mutate()}
            disabled={clearCartMutation.isPending}
            data-testid="button-clear-cart"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        )}
      </div>

      {cartItems.length === 0 ? (
        /* Empty Cart State */
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Your cart is empty</p>
            <p className="text-muted-foreground mb-4">Browse items and add them to your cart</p>
            <Link href="/items">
              <Button data-testid="button-browse-items">
                Browse Items
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        /* Cart Content Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((cartItem) => {
              const itemImage = cartItem.item.images?.[0] || `/api/placeholder/200/200`;
              const quantity = cartItem.quantity || 1;
              const maxQuantity = cartItem.item.quantity || 1;
              const itemTotal = parseFloat(cartItem.item.price) * quantity;
              
              return (
                <Link key={cartItem.id} href={`/items/${cartItem.item.id}`}>
                  <Card className="cursor-pointer hover-elevate transition-all" data-testid={`card-cart-item-${cartItem.item.id}`}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Item Image - Larger and more prominent */}
                        <div className="w-28 h-28 md:w-32 md:h-32 flex-shrink-0 overflow-hidden rounded-lg border">
                          <img
                            src={itemImage}
                            alt={cartItem.item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `/api/placeholder/200/200`;
                            }}
                            data-testid={`img-cart-item-${cartItem.item.id}`}
                          />
                        </div>
                        
                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors" data-testid={`text-cart-item-title-${cartItem.item.id}`}>
                            {cartItem.item.title}
                          </h3>
                          
                          {/* Category and Condition Badges */}
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="secondary" data-testid={`badge-cart-item-category-${cartItem.item.id}`}>
                              {cartItem.item.category}
                            </Badge>
                            <Badge 
                              className={getConditionColor(cartItem.item.condition)} 
                              data-testid={`badge-cart-item-condition-${cartItem.item.id}`}
                            >
                              {formatCondition(cartItem.item.condition)}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                            {cartItem.item.description}
                          </p>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            Seller: Anonymous Seller
                          </p>

                          {/* Quantity Selector */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">Qty:</span>
                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-r-none"
                                onClick={(e) => handleQuantityChange(cartItem.item.id, quantity, maxQuantity, -1, e)}
                                disabled={quantity <= 1 || updateQuantityMutation.isPending}
                                data-testid={`button-decrease-qty-${cartItem.item.id}`}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-3 text-sm font-medium min-w-[2rem] text-center" data-testid={`text-qty-${cartItem.item.id}`}>
                                {quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-l-none"
                                onClick={(e) => handleQuantityChange(cartItem.item.id, quantity, maxQuantity, 1, e)}
                                disabled={quantity >= maxQuantity || updateQuantityMutation.isPending}
                                data-testid={`button-increase-qty-${cartItem.item.id}`}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            {maxQuantity > 1 && (
                              <span className="text-xs text-muted-foreground">
                                ({maxQuantity} available)
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Price, Contact and Remove */}
                        <div className="flex flex-col items-end justify-between gap-2">
                          <div className="text-right">
                            <span className="font-bold text-xl text-primary block" data-testid={`text-cart-item-price-${cartItem.item.id}`}>
                              ${itemTotal.toFixed(2)}
                            </span>
                            {quantity > 1 && (
                              <span className="text-xs text-muted-foreground">
                                ${parseFloat(cartItem.item.price).toFixed(2)} each
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => handleContactSeller(cartItem.item.sellerId, e)}
                              data-testid={`button-contact-seller-${cartItem.item.id}`}
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Contact
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => handleRemove(cartItem.item.id, e)}
                              disabled={removeFromCartMutation.isPending}
                              data-testid={`button-remove-cart-item-${cartItem.item.id}`}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items ({totalItems})</span>
                    <span data-testid="text-subtotal">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary" data-testid="text-total">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={() => setLocation('/checkout')}
                  data-testid="button-checkout"
                >
                  Proceed to Checkout
                </Button>
                <Link href="/items">
                  <Button variant="outline" className="w-full" data-testid="button-continue-shopping">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
