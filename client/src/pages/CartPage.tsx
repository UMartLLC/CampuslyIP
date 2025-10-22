import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Trash2, Package } from "lucide-react";
import { Link } from "wouter";
import type { CartItemWithDetails } from "@shared/schema";

export default function CartPage() {
  const { toast } = useToast();

  const { data: cartItems = [], isLoading } = useQuery<CartItemWithDetails[]>({
    queryKey: ['/api/cart'],
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to remove from cart');
      }
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

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
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

  const totalAmount = cartItems.reduce((sum, cartItem) => {
    return sum + parseFloat(cartItem.item.price);
  }, 0);

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
      <div className="mb-6 flex items-center justify-between">
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
            Clear Cart
          </Button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Your cart is empty</p>
            <p className="text-muted-foreground mb-4">Browse items and add them to your cart</p>
            <Link href="/">
              <Button data-testid="button-browse-items">
                Browse Items
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((cartItem) => (
              <Card key={cartItem.id} data-testid={`card-cart-item-${cartItem.item.id}`}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {cartItem.item.images && cartItem.item.images.length > 0 && (
                      <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={cartItem.item.images[0]}
                          alt={cartItem.item.title}
                          className="w-full h-full object-cover"
                          data-testid={`img-cart-item-${cartItem.item.id}`}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1" data-testid={`text-cart-item-title-${cartItem.item.id}`}>
                        {cartItem.item.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary" data-testid={`badge-cart-item-category-${cartItem.item.id}`}>
                          {cartItem.item.category}
                        </Badge>
                        <Badge variant="outline" data-testid={`badge-cart-item-condition-${cartItem.item.id}`}>
                          {cartItem.item.condition}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {cartItem.item.description}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Seller: {cartItem.item.seller.firstName && cartItem.item.seller.lastName
                          ? `${cartItem.item.seller.firstName} ${cartItem.item.seller.lastName}`
                          : cartItem.item.seller.username}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <span className="font-bold text-xl text-primary" data-testid={`text-cart-item-price-${cartItem.item.id}`}>
                        ${cartItem.item.price}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCartMutation.mutate(cartItem.item.id)}
                        disabled={removeFromCartMutation.isPending}
                        data-testid={`button-remove-cart-item-${cartItem.item.id}`}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                    <span className="text-muted-foreground">Items ({cartItems.length})</span>
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
                <Button className="w-full" size="lg" data-testid="button-checkout">
                  Proceed to Checkout
                </Button>
                <Link href="/">
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
