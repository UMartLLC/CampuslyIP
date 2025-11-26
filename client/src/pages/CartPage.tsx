import React from 'react';
// Imports necessary hooks from TanStack Query for data fetching and manipulation.
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
// Imports icons for shopping cart, trash, and package (used in UI elements).
import { ShoppingCart, Trash2, Package } from 'lucide-react';
// Imports Link component from wouter for client-side navigation.
import { Link } from "wouter";

// 1. Define the QueryClient directly in the file (needed for invalidating queries).
const queryClient = new QueryClient(); 

// 2. Mock the type interface for the Cart Item (necessary to satisfy TypeScript without external file).
interface ItemDetails {
  id: string; // Product ID
  title: string;
  price: string;
  description: string;
  category: string;
  condition: string;
  images: string[];
}

interface CartItemWithDetails {
  id: string; // Cart Item ID
  itemId: string;
  quantity: number;
  item: ItemDetails; // Detailed product information.
}

// --- TypeScript Interfaces for Props ---

// Base interface for components that accept standard children and optional classes.
interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

// Props specific to the custom Button component.
interface ButtonProps extends BaseProps {
  variant?: 'default' | 'outline' | 'destructive' | 'secondary';
  size?: 'default' | 'lg' | 'sm';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  'data-testid'?: string;
}

// Empty interfaces defining props for Card structure components.
interface CardProps extends BaseProps {}
interface CardHeaderProps extends BaseProps {}
interface CardTitleProps extends BaseProps {}
interface CardContentProps extends BaseProps {}

// Props specific to the custom Badge component.
interface BadgeProps extends BaseProps {
  variant?: 'default' | 'secondary' | 'outline';
}

// Interface for the Toast properties.
interface ToastProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive' | 'secondary' | 'outline';
}

// --- Component Replacements (Styled with standard Tailwind classes) ---

// Mock hook to replace useToast, using a browser alert for notifications.
const useToast = () => {
  return {
    // Explicitly type the destructured parameter object with ToastProps
    toast: ({ title, description, variant }: ToastProps) => { 
      console.log(`Toast: ${title} - ${description} (Variant: ${variant})`);
      alert(`${title}: ${description}`);
    },
  };
};

// Custom Card component (styled div).
const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`rounded-lg border bg-white text-gray-900 shadow-sm ${className}`}>
    {children}
  </div>
);

// Custom Card Header component.
const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

// Custom Card Title component (styled h3).
const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

// Custom Card Content component (styled div, typically used without top padding after a CardHeader).
const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Custom Button component with simulated variants and sizes.
const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'default', 
  size = 'default', 
  onClick, 
  disabled, 
  'data-testid': dataTestId, 
  ...props 
}) => {
  let baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50';
  let variantClasses = '';
  let sizeClasses = '';

  // Simulate common button styles
  if (variant === 'default') {
    variantClasses = 'bg-blue-600 text-white shadow hover:bg-blue-700';
  } else if (variant === 'outline') {
    variantClasses = 'border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100';
  }

  // Simulate common button sizing
  if (size === 'default') {
    sizeClasses = 'h-9 px-4 py-2';
  } else if (size === 'lg') {
    sizeClasses = 'h-10 px-6';
  } else if (size === 'sm') {
    sizeClasses = 'h-8 rounded-md px-3 text-xs';
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestId}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Badge component with simulated variants.
const Badge: React.FC<BadgeProps> = ({ children, className = '', variant = 'default' }) => {
  let baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors';
  let variantClasses = '';

  // Simulate common badge styles
  if (variant === 'secondary') {
    variantClasses = 'bg-gray-100 text-gray-800 border-transparent';
  } else if (variant === 'outline') {
    variantClasses = 'bg-white text-gray-600 border-gray-300';
  }

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </div>
  );
};

// -----------------------------------------------------------------------------
// 4. CartPage Component
// -----------------------------------------------------------------------------

export default function CartPage() {
  const { toast } = useToast();

  // Fetch cart items data from the API.
  const { data: cartItems = [], isLoading } = useQuery<CartItemWithDetails[]>({
    queryKey: ['/api/cart'],
  });

  // Mutation to remove a single item from the cart.
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
      // Invalidates cache to trigger a UI refresh and cart count update.
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

  // Mutation to clear all items from the cart.
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
      // Invalidates cache to trigger a UI refresh.
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

  // Calculates the total monetary amount of all items in the cart.
  const totalAmount = cartItems.reduce((sum, cartItem) => {
    return sum + parseFloat(cartItem.item.price);
  }, 0);

  // Loading state display.
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Title and Clear Cart Button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>
        {/* Clear Cart Button (visible only if cart is not empty) */}
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
        /* Empty Cart State View */
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Your cart is empty</p>
            <p className="text-gray-500 mb-4">Browse items and add them to your cart</p>
            <Link href="/items">
              <Button data-testid="button-browse-items">
                Browse Items
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        /* Cart Content Grid (Items List and Summary) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((cartItem) => (
              <Card key={cartItem.id} data-testid={`card-cart-item-${cartItem.item.id}`}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Item Image */}
                    {cartItem.item.images && cartItem.item.images.length > 0 && (
                      <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={cartItem.item.images[0]}
                          alt={cartItem.item.title}
                          className="w-full h-full object-cover"
                          data-testid={`img-cart-item-${cartItem.item.id}`}
                        />
                      </div>
                    )}
                    {/* Item Details */}
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
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {cartItem.item.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Seller: Anonymous Seller
                      </p>
                    </div>
                    {/* Price and Remove Button */}
                    <div className="flex flex-col items-end justify-between">
                      <span className="font-bold text-xl text-blue-600" data-testid={`text-cart-item-price-${cartItem.item.id}`}>
                        {/* Displays price formatted to two decimal places */}
                        ${parseFloat(cartItem.item.price).toFixed(2)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        // Triggers mutation to remove this specific cart item.
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
            <Card className="sticky top-20"> {/* Sticky positioning for summary box */}
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Items ({cartItems.length})</span>
                    <span data-testid="text-subtotal">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-blue-600" data-testid="text-total">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                {/* Checkout Button */}
                <Button className="w-full" size="lg" data-testid="button-checkout">
                  Proceed to Checkout
                </Button>
                {/* Continue Shopping Link */}
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