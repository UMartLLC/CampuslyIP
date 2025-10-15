// Referenced from blueprint:javascript_auth_all_persistance
import { type User, type InsertUser, type Item, type InsertItem, type ItemWithSeller, type PublicUser, users, items } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<void>;
  
  getAllItems(): Promise<ItemWithSeller[]>;
  getItem(id: string): Promise<ItemWithSeller | undefined>;
  getItemsBySeller(sellerId: string): Promise<Item[]>;
  createItem(item: InsertItem, sellerId: string): Promise<Item>;
  updateItem(id: string, item: Partial<InsertItem>): Promise<Item | undefined>;
  deleteItem(id: string): Promise<boolean>;
  
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      conString: process.env.DATABASE_URL,
      createTableIfMissing: false,
      tableName: "sessions",
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));
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
      const publicSeller: PublicUser = row.users;
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
    
    const publicSeller: PublicUser = result.users;
    
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
