import { type User, type InsertUser, type Item, type InsertItem, type ItemWithSeller } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllItems(): Promise<ItemWithSeller[]>;
  getItem(id: string): Promise<ItemWithSeller | undefined>;
  getItemsBySeller(sellerId: string): Promise<Item[]>;
  createItem(item: InsertItem, sellerId: string): Promise<Item>;
  updateItem(id: string, item: Partial<InsertItem>): Promise<Item | undefined>;
  deleteItem(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private items: Map<string, Item>;

  constructor() {
    this.users = new Map();
    this.items = new Map();
    
    const defaultUser: User = {
      id: "temp-user-id",
      username: "defaultuser",
      email: "default@unimart.edu",
      name: "Default User",
      password: "placeholder",
      avatar: null,
    };
    this.users.set(defaultUser.id, defaultUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, avatar: insertUser.avatar || null };
    this.users.set(id, user);
    return user;
  }

  async getAllItems(): Promise<ItemWithSeller[]> {
    const items = Array.from(this.items.values());
    const itemsWithSellers = await Promise.all(
      items.map(async (item) => {
        const seller = await this.getUser(item.sellerId);
        if (!seller) {
          throw new Error(`Seller not found for item ${item.id}`);
        }
        return { ...item, seller };
      })
    );
    return itemsWithSellers;
  }

  async getItem(id: string): Promise<ItemWithSeller | undefined> {
    const item = this.items.get(id);
    if (!item) return undefined;
    
    const seller = await this.getUser(item.sellerId);
    if (!seller) {
      throw new Error(`Seller not found for item ${item.id}`);
    }
    
    return { ...item, seller };
  }

  async getItemsBySeller(sellerId: string): Promise<Item[]> {
    return Array.from(this.items.values()).filter(
      (item) => item.sellerId === sellerId
    );
  }

  async createItem(insertItem: InsertItem, sellerId: string): Promise<Item> {
    const id = randomUUID();
    const item: Item = {
      ...insertItem,
      id,
      sellerId,
      images: insertItem.images || null,
      status: "available",
      createdAt: new Date(),
    };
    this.items.set(id, item);
    return item;
  }

  async updateItem(id: string, updates: Partial<InsertItem>): Promise<Item | undefined> {
    const item = this.items.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates };
    this.items.set(id, updatedItem);
    return updatedItem;
  }

  async deleteItem(id: string): Promise<boolean> {
    return this.items.delete(id);
  }
}

export const storage = new MemStorage();
