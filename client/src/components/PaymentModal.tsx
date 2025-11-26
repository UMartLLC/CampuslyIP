import { useState } from "react";
// Imports UI components for the modal (Dialog), container (Card), and dividers (Separator).
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
// Imports Lucide icons (CreditCard, Shield, CheckCircle, etc.).
import { CreditCard, Smartphone, Banknote, Shield, CheckCircle } from "lucide-react";
// Imports specific brand icons from react-icons/si.
import { SiApple, SiVenmo } from "react-icons/si";
// Imports type definition for item data including seller details.
import type { ItemWithSeller } from "@shared/schema";

// -----------------------------------------------------------------------------
// 1. Component Props Interface & Constants
// -----------------------------------------------------------------------------

interface PaymentModalProps {
  isOpen: boolean; // Controls modal visibility.
  onClose: () => void; // Handler to close the modal.
  item: ItemWithSeller | null; // The item being purchased.
  onPaymentComplete?: (paymentMethod: string) => void; // Callback after successful mock payment.
}

// Configuration array for available payment methods.
const PAYMENT_METHODS = [
  {
    id: "apple-pay",
    name: "Apple Pay",
    icon: SiApple,
    description: "Quick and secure with Touch ID",
    fee: 0, // 0% fee.
    recommended: true
  },
  {
    id: "venmo",
    name: "Venmo",
    icon: SiVenmo,
    description: "Split with friends, social payments",
    fee: 0
  },
  {
    id: "credit-card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Visa, Mastercard, American Express",
    fee: 2.9 // 2.9% fee example.
  }
];

// -----------------------------------------------------------------------------
// 2. PaymentModal Component
// -----------------------------------------------------------------------------

export default function PaymentModal({ isOpen, onClose, item, onPaymentComplete }: PaymentModalProps) {
  // State for the currently selected payment method ID.
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  // State for showing the loading/processing indicator on the button.
  const [isProcessing, setIsProcessing] = useState(false);
  // State for showing the success screen after the mock payment.
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Exit early if item data is missing.
  if (!item) return null;

  // Calculate costs based on the selected item and method.
  const itemPrice = parseFloat(item.price);
  const selectedMethod = PAYMENT_METHODS.find(method => method.id === selectedPaymentMethod);
  const processingFee = selectedMethod ? (itemPrice * selectedMethod.fee / 100) : 0;
  const totalAmount = itemPrice + processingFee;

  // -----------------------------------------------------------------------------
  // 3. Payment Handler (Mock Implementation)
  // -----------------------------------------------------------------------------

  const handlePayment = async () => {
    if (!selectedPaymentMethod) return;
    
    setIsProcessing(true);
    
    // Mock API call to simulate payment processing time.
    // TODO: Integrate with actual payment processing (Stripe)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setPaymentComplete(true); // Show success screen.
    onPaymentComplete?.(selectedPaymentMethod); // Execute external success callback.
    
    console.log('Payment processed:', {
      item: item.id,
      amount: totalAmount,
      method: selectedPaymentMethod
    });
    
    // Close modal after showing success screen for 2 seconds.
    setTimeout(() => {
      setPaymentComplete(false);
      setSelectedPaymentMethod("");
      onClose();
    }, 2000);
  };

  // -----------------------------------------------------------------------------
  // 4. Payment Complete View
  // -----------------------------------------------------------------------------

  if (paymentComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground mb-4">
              Your payment has been processed. The seller has been notified.
            </p>
            {/* Display a mock transaction ID for user confirmation */}
            <Badge variant="outline" className="px-3 py-1">
              Transaction ID: TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </Badge>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // -----------------------------------------------------------------------------
  // 5. Main Payment Selection View
  // -----------------------------------------------------------------------------

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Secure Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Item Summary Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                {/* Item Image */}
                <img
                  src={item.images?.[0] || "/api/placeholder/80/80"}
                  alt={item.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  {/* Item Title and Seller Name */}
                  <h4 className="font-medium line-clamp-2 mb-1" data-testid="text-payment-item-title">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Sold by {item.seller.firstName} {item.seller.lastName}
                  </p>
                  {/* Item Price */}
                  <div className="text-lg font-bold text-primary" data-testid="text-payment-item-price">
                    ${item.price}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods Selection */}
          <div>
            <h3 className="font-semibold mb-4">Choose Payment Method</h3>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon; // Dynamic icon component.
                const isSelected = selectedPaymentMethod === method.id;
                
                return (
                  <Card
                    key={method.id}
                    className={`cursor-pointer transition-all ${
                      // Highlight border and background if selected.
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'hover-elevate'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    data-testid={`card-payment-${method.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Icon Display */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{method.name}</span>
                            {/* Recommended Badge */}
                            {method.recommended && (
                              <Badge variant="secondary" className="text-xs">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {method.description}
                          </p>
                          {/* Fee Notice */}
                          {method.fee > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Processing fee: {method.fee}%
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Payment Summary (Only shows if a method is selected) */}
          {selectedPaymentMethod && (
            <div className="space-y-3">
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Item Price</span>
                  <span data-testid="text-item-price">${itemPrice.toFixed(2)}</span>
                </div>
                {/* Processing Fee Line (Conditional) */}
                {processingFee > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Processing Fee</span>
                    <span data-testid="text-processing-fee">${processingFee.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                {/* Total Amount */}
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span data-testid="text-total-amount">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Your payment is secured with 256-bit SSL encryption</span>
            </div>
          </div>

          {/* Payment Button & Cancel */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isProcessing}
              data-testid="button-cancel-payment"
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handlePayment}
              disabled={!selectedPaymentMethod || isProcessing} // Disabled if no method or processing.
              data-testid="button-complete-payment"
            >
              {isProcessing ? (
                // Processing state with spinner.
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Processing...
                </>
              ) : (
                // Default button text showing total amount.
                `Pay $${totalAmount.toFixed(2)}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}