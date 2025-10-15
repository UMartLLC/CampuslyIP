import { type User, type InsertUser, type Item, type InsertItem, type ItemWithSeller, type PublicUser, users, items } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllItems(): Promise<ItemWithSeller[]> {
    const result = await db
      .select()
      .from(items)
      .leftJoin(users, eq(items.sellerId, users.id));
    
    return result.map(row => {
      if (!row.users) {
        throw new Error(`Seller not found for item ${row.items.id}`);
      }
      const { password, ...publicSeller } = row.users;
      return {
        ...row.items,
        seller: publicSeller,
      };
    });
  }

  async getItem(id: string): Promise<ItemWithSeller | undefined> {
    const [result] = await db
      .select()
      .from(items)
      .leftJoin(users, eq(items.sellerId, users.id))
      .where(eq(items.id, id));
    
    if (!result) return undefined;
    
    if (!result.users) {
      throw new Error(`Seller not found for item ${result.items.id}`);
    }
    
    const { password, ...publicSeller } = result.users;
    
    return {
      ...result.items,
      seller: publicSeller,
    };
  }

  async getItemsBySeller(sellerId: string): Promise<Item[]> {
    return await db.select().from(items).where(eq(items.sellerId, sellerId));
  }

  async createItem(insertItem: InsertItem, sellerId: string): Promise<Item> {
    const [item] = await db
      .insert(items)
      .values({
        ...insertItem,
        sellerId,
      })
      .returning();
    return item;
  }

  async updateItem(id: string, updates: Partial<InsertItem>): Promise<Item | undefined> {
    const [item] = await db
      .update(items)
      .set(updates)
      .where(eq(items.id, id))
      .returning();
    return item || undefined;
  }

  async deleteItem(id: string): Promise<boolean> {
    const result = await db
      .delete(items)
      .where(eq(items.id, id))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
