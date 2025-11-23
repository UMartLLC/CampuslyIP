import { useState } from 'react';
import PaymentModal from '../PaymentModal';
import { Button } from '@/components/ui/button';
import type { ItemWithSeller } from '@shared/schema';

export default function PaymentModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  
  // TODO: remove mock data
  const mockItem: ItemWithSeller = {
    id: "1",
    title: "MacBook Air M2 - Barely Used",
    description: "Excellent condition MacBook Air with M2 chip, 8GB RAM, 256GB SSD.",
    price: "899.99",
    category: "Electronics",
    subcategory: "Laptops",
    condition: "like-new",
    images: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400"],
    sellerId: "user1",
    status: "available",
    createdAt: new Date(),
    deletedAt: null,
    seller: {
      id: "user1",
      firstName: "Sarah",
      lastName: "Chen",
      username: "sarahc",
      email: "sarah@email.com",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b193?w=100",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)} data-testid="button-open-payment">
        Open Payment Modal
      </Button>
      
      <PaymentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        item={mockItem}
        onPaymentComplete={(method) => {
          console.log('Payment completed with:', method);
          alert('Payment successful!');
        }}
      />
    </div>
  );
}