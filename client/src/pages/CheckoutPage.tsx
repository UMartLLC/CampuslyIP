import { useState, useEffect, FormEvent } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { ArrowLeft, ShoppingBag, CreditCard, Check, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { CartItemWithDetails, ShippingAddress } from "@shared/schema";

const CheckoutForm = ({ 
  clientSecret, 
  orderId, 
  totalAmount,
  onSuccess 
}: { 
  clientSecret: string; 
  orderId: string;
  totalAmount: string;
  onSuccess: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();

  const completeOrderMutation = useMutation({
    mutationFn: async ({ orderId, paymentIntentId }: { orderId: string; paymentIntentId: string }) => {
      return await apiRequest('POST', '/api/checkout/complete', { orderId, paymentIntentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      onSuccess();
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/cart",
      },
      redirect: "if_required",
    });

    if (error) {
      toast({
        title: "Payment failed",
        description: error.message || "An error occurred during payment.",
        variant: "destructive",
      });
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      completeOrderMutation.mutate({ orderId, paymentIntentId: paymentIntent.id });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg">
        <PaymentElement />
      </div>
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!stripe || isProcessing || completeOrderMutation.isPending}
        data-testid="button-pay"
      >
        {isProcessing || completeOrderMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay ${totalAmount}
          </>
        )}
      </Button>
    </form>
  );
};

export default function CheckoutPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<string>("0.00");
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  const { data: cartItems = [], isLoading: isLoadingCart } = useQuery<CartItemWithDetails[]>({
    queryKey: ['/api/cart'],
  });

  useEffect(() => {
    const fetchStripeKey = async () => {
      try {
        const response = await apiRequest('GET', '/api/stripe/publishable-key');
        const data = await response.json();
        if (data.publishableKey) {
          setStripePromise(loadStripe(data.publishableKey));
        }
      } catch (error) {
        console.error("Failed to load Stripe:", error);
      }
    };
    fetchStripeKey();
  }, []);

  const createPaymentIntentMutation = useMutation({
    mutationFn: async (address: ShippingAddress) => {
      const response = await apiRequest('POST', '/api/checkout/create-payment-intent', {
        shippingAddress: address,
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
      setTotalAmount(data.totalAmount);
      setStep("payment");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleShippingSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!shippingAddress.fullName || !shippingAddress.addressLine1 || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createPaymentIntentMutation.mutate(shippingAddress);
  };

  const handlePaymentSuccess = () => {
    setStep("success");
    toast({
      title: "Payment successful!",
      description: "Your order has been placed successfully.",
    });
  };

  const subtotal = cartItems.reduce((sum, cartItem) => {
    const quantity = cartItem.quantity || 1;
    return sum + (parseFloat(cartItem.item.price) * quantity);
  }, 0);

  const totalItems = cartItems.reduce((sum, cartItem) => sum + (cartItem.quantity || 1), 0);

  if (isLoadingCart) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground mt-2">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && step !== "success") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">Add some items before checkout.</p>
            <Button asChild data-testid="link-browse-items">
              <Link href="/items">Browse Items</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Order Confirmed!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. You will receive an email confirmation shortly.
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild variant="outline" data-testid="link-continue-shopping">
                <Link href="/items">Continue Shopping</Link>
              </Button>
              <Button asChild data-testid="link-view-orders">
                <Link href="/account">View Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4" data-testid="link-back-to-cart">
          <Link href="/cart">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
        </Button>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === "shipping" && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>Enter your delivery information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      placeholder="John Doe"
                      required
                      data-testid="input-full-name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      value={shippingAddress.addressLine1}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                      placeholder="123 Main Street"
                      required
                      data-testid="input-address-1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      value={shippingAddress.addressLine2}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                      placeholder="Apt 4B (optional)"
                      data-testid="input-address-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        placeholder="New York"
                        required
                        data-testid="input-city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        placeholder="NY"
                        required
                        data-testid="input-state"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                        placeholder="10001"
                        required
                        data-testid="input-zip"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                        placeholder="US"
                        data-testid="input-country"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={createPaymentIntentMutation.isPending}
                    data-testid="button-continue-to-payment"
                  >
                    {createPaymentIntentMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Continue to Payment"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === "payment" && stripePromise && clientSecret && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Enter your payment information securely</CardDescription>
              </CardHeader>
              <CardContent>
                <Elements 
                  stripe={stripePromise} 
                  options={{ 
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#4F46E5',
                      },
                    },
                  }}
                >
                  <CheckoutForm 
                    clientSecret={clientSecret} 
                    orderId={orderId!}
                    totalAmount={totalAmount}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartItems.map((cartItem) => (
                  <div key={cartItem.id} className="flex gap-3" data-testid={`order-item-${cartItem.itemId}`}>
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {cartItem.item.images && cartItem.item.images[0] ? (
                        <img
                          src={`/public-objects/${cartItem.item.images[0]}`}
                          alt={cartItem.item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{cartItem.item.title}</p>
                      <p className="text-sm text-muted-foreground">Qty: {cartItem.quantity || 1}</p>
                      <p className="text-sm font-medium">
                        ${(parseFloat(cartItem.item.price) * (cartItem.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span data-testid="text-order-total">${step === "payment" ? totalAmount : subtotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
