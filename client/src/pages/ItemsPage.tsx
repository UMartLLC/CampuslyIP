import { useState } from "react";
import ItemsGrid from "@/components/ItemsGrid";
import PaymentModal from "@/components/PaymentModal";
import type { ItemWithSeller } from "@shared/schema";

export default function ItemsPage() {
  const [selectedItem, setSelectedItem] = useState<ItemWithSeller | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // TODO: remove mock data - this will come from API
  const mockItems: ItemWithSeller[] = [
    {
      id: "1",
      title: "MacBook Air M2 - Barely Used",
      description: "Excellent condition MacBook Air with M2 chip, 8GB RAM, 256GB SSD. Perfect for students. Comes with original charger and box.",
      price: "899.99",
      category: "Electronics",
      condition: "like-new",
      images: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400"],
      sellerId: "user1",
      status: "available",
      createdAt: new Date('2024-01-15'),
      seller: {
        id: "user1",
        name: "Sarah Chen",
        username: "sarahc",
        email: "sarah@email.com",
        password: "",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b193?w=100"
      }
    },
    {
      id: "2",
      title: "Calculus Textbook - 8th Edition",
      description: "Stewart's Calculus textbook in good condition. Minimal highlighting, all pages intact. Perfect for Math 101 and 102 courses.",
      price: "89.99",
      category: "Textbooks",
      condition: "good",
      images: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"],
      sellerId: "user2",
      status: "available",
      createdAt: new Date('2024-01-10'),
      seller: {
        id: "user2",
        name: "Mike Johnson",
        username: "mikej",
        email: "mike@email.com",
        password: "",
        avatar: null
      }
    },
    {
      id: "3",
      title: "Study Desk with Chair",
      description: "Wooden study desk with matching chair. Perfect for dorm room. Some scratches but very functional. Dimensions: 48x24 inches.",
      price: "120.00",
      category: "Furniture",
      condition: "fair",
      images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"],
      sellerId: "user3",
      status: "available",
      createdAt: new Date('2024-01-05'),
      seller: {
        id: "user3",
        name: "Alex Kim",
        username: "alexk",
        email: "alex@email.com",
        password: "",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
      }
    },
    {
      id: "4",
      title: "iPhone 14 Pro - Space Black",
      description: "iPhone 14 Pro in excellent condition. Screen protector applied since day one. 128GB storage. Battery health 98%.",
      price: "699.99",
      category: "Electronics",
      condition: "like-new",
      images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"],
      sellerId: "user4",
      status: "available",
      createdAt: new Date('2024-01-12'),
      seller: {
        id: "user4",
        name: "Emma Davis",
        username: "emmad",
        email: "emma@email.com",
        password: "",
        avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100"
      }
    },
    {
      id: "5",
      title: "Organic Chemistry Textbook Bundle",
      description: "Complete set: textbook, study guide, and solution manual. Used for one semester only. Great condition.",
      price: "150.00",
      category: "Textbooks",
      condition: "like-new",
      images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"],
      sellerId: "user5",
      status: "available",
      createdAt: new Date('2024-01-08'),
      seller: {
        id: "user5",
        name: "David Park",
        username: "davidp",
        email: "david@email.com",
        password: "",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
      }
    },
    {
      id: "6",
      title: "Gaming Chair - Ergonomic",
      description: "Comfortable gaming chair with lumbar support. Black and red design. Great for long study sessions.",
      price: "180.00",
      category: "Furniture",
      condition: "good",
      images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"],
      sellerId: "user6",
      status: "available",
      createdAt: new Date('2024-01-03'),
      seller: {
        id: "user6",
        name: "Jessica Wu",
        username: "jessicaw",
        email: "jessica@email.com",
        password: "",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b193?w=100"
      }
    }
  ];

  const handleItemClick = (item: ItemWithSeller) => {
    setSelectedItem(item);
    setIsPaymentModalOpen(true);
  };

  const handleContactSeller = (item: ItemWithSeller) => {
    console.log('Contacting seller:', item.seller.name);
    // TODO: Implement messaging system
    alert(`Coming soon: Direct messaging with ${item.seller.name}`);
  };

  const handlePaymentComplete = (paymentMethod: string) => {
    console.log('Payment completed:', {
      item: selectedItem?.id,
      method: paymentMethod
    });
    
    // TODO: Update item status, notify seller, etc.
    setIsPaymentModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
          Browse Items
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover great deals from fellow students on your campus
        </p>
      </div>

      <ItemsGrid
        items={mockItems}
        onItemClick={handleItemClick}
        onContactSeller={handleContactSeller}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}