// Referenced from blueprint:javascript_auth_all_persistance
import { type User, type InsertUser, type Item, type InsertItem, type ItemWithSeller, type PublicUser, type CartItem, type CartItemWithDetails, type Favorite, type FavoriteWithDetails } from "@shared/schema";
import session from "express-session";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<void>;
  
  getAllItems(): Promise<ItemWithSeller[]>;
  getItem(id: string): Promise<ItemWithSeller | undefined>;
  getItemsBySeller(sellerId: string): Promise<Item[]>;
  getAllItemsBySeller(sellerId: string): Promise<Item[]>;
  createItem(item: InsertItem, sellerId: string): Promise<Item>;
  updateItem(id: string, item: Partial<InsertItem>): Promise<Item | undefined>;
  deleteItem(id: string): Promise<boolean>;
  repostItem(id: string): Promise<Item | undefined>;
  
  getCartItems(userId: string): Promise<CartItemWithDetails[]>;
  addToCart(userId: string, itemId: string): Promise<CartItem>;
  removeFromCart(userId: string, itemId: string): Promise<boolean>;
  clearCart(userId: string): Promise<void>;
  
  getFavorites(userId: string): Promise<FavoriteWithDetails[]>;
  addFavorite(userId: string, itemId: string): Promise<Favorite>;
  removeFavorite(userId: string, itemId: string): Promise<boolean>;
  isFavorite(userId: string, itemId: string): Promise<boolean>;
  
  sessionStore: session.Store;
}

// In-Memory Storage Implementation
export class MemStorage implements IStorage {
  sessionStore: session.Store;
  private users: Map<string, User> = new Map();
  private items: Map<string, Item> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private favorites: Map<string, Favorite> = new Map();

  constructor() {
    this.sessionStore = new SessionStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Create a default temp user
    const tempUser: User = {
      id: "temp-user-id",
      username: "tempuser",
      password: "hashed_password",
      email: "temp@unimart.local",
      firstName: "Anonymous",
      lastName: "User",
      profileImageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(tempUser.id, tempUser);
    
    // Add some sample items
    const sampleItems: Item[] = [
      {
        id: "item-1",
        title: "Calculus Textbook",
        description: "Barely used calculus textbook for MATH 101",
        price: "45.00",
        category: "Textbooks",
        subcategory: "Mathematics",
        condition: "like-new",
        images: [],
        sellerId: "temp-user-id",
        status: "available",
        createdAt: new Date(),
        deletedAt: null,
      },
      {
        id: "item-2",
        title: "Laptop Stand",
        description: "Adjustable aluminum laptop stand",
        price: "25.00",
        category: "Electronics",
        subcategory: "Accessories",
        condition: "good",
        images: [],
        sellerId: "temp-user-id",
        status: "available",
        createdAt: new Date(),
        deletedAt: null,
      },
      {
        id: "item-3",
        title: "Desk Lamp",
        description: "LED desk lamp with adjustable brightness",
        price: "15.00",
        category: "Furniture",
        subcategory: "Lighting",
        condition: "good",
        images: [],
        sellerId: "temp-user-id",
        status: "available",
        createdAt: new Date(),
        deletedAt: null,
      },
    ];
    
    sampleItems.forEach(item => this.items.set(item.id, item));
  }

  private generateId(): string {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      id: this.generateId(),
      ...userData,
      profileImageUrl: null,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.password = hashedPassword;
      user.updatedAt = new Date();
    }
  }

  async getAllItems(): Promise<ItemWithSeller[]> {
    const result: ItemWithSeller[] = [];
    const allItems = Array.from(this.items.values());
    for (const item of allItems) {
      if (!item.deletedAt) {
        const seller = this.users.get(item.sellerId);
        if (seller) {
          const publicSeller: PublicUser = seller;
          result.push({
            ...item,
            seller: publicSeller,
          });
        }
      }
    }
    return result;
  }

  async getItem(id: string): Promise<ItemWithSeller | undefined> {
    const item = this.items.get(id);
    if (!item) return undefined;
    
    const seller = this.users.get(item.sellerId);
    if (!seller) return undefined;
    
    const publicSeller: PublicUser = seller;
    return {
      ...item,
      seller: publicSeller,
    };
  }

  async getItemsBySeller(sellerId: string): Promise<Item[]> {
    return Array.from(this.items.values()).filter(
      item => item.sellerId === sellerId && !item.deletedAt
    );
  }

  async getAllItemsBySeller(sellerId: string): Promise<Item[]> {
    return Array.from(this.items.values()).filter(
      item => item.sellerId === sellerId
    );
  }

  async createItem(insertItem: InsertItem, sellerId: string): Promise<Item> {
    const item: Item = {
      id: this.generateId(),
      ...insertItem,
      images: insertItem.images || null,
      subcategory: insertItem.subcategory || null,
      sellerId,
      status: "available",
      createdAt: new Date(),
      deletedAt: null,
    };
    this.items.set(item.id, item);
    return item;
  }

  async updateItem(id: string, updates: Partial<InsertItem>): Promise<Item | undefined> {
    const item = this.items.get(id);
    if (!item) return undefined;
    
    Object.assign(item, updates);
    return item;
  }

  async deleteItem(id: string): Promise<boolean> {
    const item = this.items.get(id);
    if (!item) return false;
    
    item.deletedAt = new Date();
    return true;
  }

  async repostItem(id: string): Promise<Item | undefined> {
    const item = this.items.get(id);
    if (!item) return undefined;
    
    item.deletedAt = null;
    item.status = 'available';
    return item;
  }

  async getCartItems(userId: string): Promise<CartItemWithDetails[]> {
    const result: CartItemWithDetails[] = [];
    const allCartItems = Array.from(this.cartItems.values());
    
    for (const cartItem of allCartItems) {
      if (cartItem.userId === userId) {
        const item = this.items.get(cartItem.itemId);
        if (item) {
          const seller = this.users.get(item.sellerId);
          if (seller) {
            const publicSeller: PublicUser = seller;
            const itemWithSeller: ItemWithSeller = {
              ...item,
              seller: publicSeller,
            };
            result.push({
              ...cartItem,
              item: itemWithSeller,
            });
          }
        }
      }
    }
    
    return result;
  }

  async addToCart(userId: string, itemId: string): Promise<CartItem> {
    // Check if already in cart
    const existing = Array.from(this.cartItems.values()).find(
      ci => ci.userId === userId && ci.itemId === itemId
    );
    
    if (existing) return existing;

    const cartItem: CartItem = {
      id: this.generateId(),
      userId,
      itemId,
      createdAt: new Date(),
    };
    this.cartItems.set(cartItem.id, cartItem);
    return cartItem;
  }

  async removeFromCart(userId: string, itemId: string): Promise<boolean> {
    const entries = Array.from(this.cartItems.entries());
    for (const [id, cartItem] of entries) {
      if (cartItem.userId === userId && cartItem.itemId === itemId) {
        this.cartItems.delete(id);
        return true;
      }
    }
    return false;
  }

  async clearCart(userId: string): Promise<void> {
    const entries = Array.from(this.cartItems.entries());
    for (const [id, cartItem] of entries) {
      if (cartItem.userId === userId) {
        this.cartItems.delete(id);
      }
    }
  }

  async getFavorites(userId: string): Promise<FavoriteWithDetails[]> {
    const result: FavoriteWithDetails[] = [];
    const allFavorites = Array.from(this.favorites.values());
    
    for (const favorite of allFavorites) {
      if (favorite.userId === userId) {
        const item = this.items.get(favorite.itemId);
        
        // Skip if item doesn't exist, is deleted, or is sold
        if (!item || item.deletedAt || item.status === 'sold') {
          continue;
        }
        
        const seller = this.users.get(item.sellerId);
        if (seller) {
          const publicSeller: PublicUser = seller;
          const itemWithSeller: ItemWithSeller = {
            ...item,
            seller: publicSeller,
          };
          result.push({
            ...favorite,
            item: itemWithSeller,
          });
        }
      }
    }
    
    return result;
  }

  async addFavorite(userId: string, itemId: string): Promise<Favorite> {
    // Check if already favorited
    const existing = Array.from(this.favorites.values()).find(
      f => f.userId === userId && f.itemId === itemId
    );
    
    if (existing) return existing;

    const favorite: Favorite = {
      id: this.generateId(),
      userId,
      itemId,
      createdAt: new Date(),
    };
    this.favorites.set(favorite.id, favorite);
    return favorite;
  }

  async removeFavorite(userId: string, itemId: string): Promise<boolean> {
    const entries = Array.from(this.favorites.entries());
    for (const [id, favorite] of entries) {
      if (favorite.userId === userId && favorite.itemId === itemId) {
        this.favorites.delete(id);
        return true;
      }
    }
    return false;
  }

  async isFavorite(userId: string, itemId: string): Promise<boolean> {
    const allFavorites = Array.from(this.favorites.values());
    return allFavorites.some(
      f => f.userId === userId && f.itemId === itemId
    );
  }
}

export const storage = new MemStorage();
