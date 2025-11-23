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
      subcategory: "Laptops",
      condition: "like-new",
      images: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400"],
      sellerId: "user1",
      status: "available",
      createdAt: new Date('2024-01-15'),
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
    },
    {
      id: "2",
      title: "Calculus Textbook - 8th Edition",
      description: "Stewart's Calculus textbook in good condition. Minimal highlighting.",
      price: "89.99",
      category: "Textbooks",
      subcategory: "Mathematics",
      condition: "good",
      images: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"],
      sellerId: "user2",
      status: "available",
      createdAt: new Date('2024-01-10'),
      deletedAt: null,
      seller: {
        id: "user2",
        firstName: "Mike",
        lastName: "Johnson",
        username: "mikej",
        email: "mike@email.com",
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    },
    {
      id: "3",
      title: "Study Desk with Chair",
      description: "Wooden study desk with matching chair. Perfect for dorm room.",
      price: "120.00",
      category: "Furniture",
      subcategory: "Desks",
      condition: "fair",
      images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"],
      sellerId: "user3",
      status: "available",
      createdAt: new Date('2024-01-05'),
      deletedAt: null,
      seller: {
        id: "user3",
        firstName: "Alex",
        lastName: "Kim",
        username: "alexk",
        email: "alex@email.com",
        profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <ItemsGrid
        items={mockItems}
        onItemClick={(item) => console.log('View item:', item.title)}
        onContactSeller={(item) => console.log('Contact seller:', `${item.seller.firstName} ${item.seller.lastName}`)}
      />
    </div>
  );
}