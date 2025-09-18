import ItemsGrid from '../ItemsGrid';
import type { ItemWithSeller } from '@shared/schema';

export default function ItemsGridExample() {
  // TODO: remove mock data
  const mockItems: ItemWithSeller[] = [
    {
      id: "1",
      title: "MacBook Air M2 - Barely Used",
      description: "Excellent condition MacBook Air with M2 chip, 8GB RAM, 256GB SSD.",
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
      description: "Stewart's Calculus textbook in good condition. Minimal highlighting.",
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
      description: "Wooden study desk with matching chair. Perfect for dorm room.",
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
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <ItemsGrid
        items={mockItems}
        onItemClick={(item) => console.log('View item:', item.title)}
        onContactSeller={(item) => console.log('Contact seller:', item.seller.name)}
      />
    </div>
  );
}