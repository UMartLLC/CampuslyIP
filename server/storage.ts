// Referenced from blueprint:javascript_auth_all_persistance
import { type User, type InsertUser, type Item, type InsertItem, type ItemWithSeller, type PublicUser, type CartItem, type CartItemWithDetails, type Favorite, type FavoriteWithDetails, users, items, cartItems, favorites } from "@shared/schema";
import { db } from "./db";
import { eq, isNull, and, notInArray } from "drizzle-orm";
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
      .leftJoin(users, eq(items.sellerId, users.id))
      .where(isNull(items.deletedAt));
    
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
    return await db.select().from(items).where(and(eq(items.sellerId, sellerId), isNull(items.deletedAt)));
  }

  async getAllItemsBySeller(sellerId: string): Promise<Item[]> {
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
      .update(items)
      .set({ deletedAt: new Date() })
      .where(eq(items.id, id))
      .returning();
    return result.length > 0;
  }

  async repostItem(id: string): Promise<Item | undefined> {
    const [item] = await db
      .update(items)
      .set({ deletedAt: null, status: 'available' })
      .where(eq(items.id, id))
      .returning();
    return item || undefined;
  }

  async getCartItems(userId: string): Promise<CartItemWithDetails[]> {
    const result = await db
      .select()
      .from(cartItems)
      .leftJoin(items, eq(cartItems.itemId, items.id))
      .leftJoin(users, eq(items.sellerId, users.id))
      .where(eq(cartItems.userId, userId));
    
    return result.map(row => {
      if (!row.items) {
        throw new Error(`Item not found for cart item ${row.cart_items.id}`);
      }
      if (!row.users) {
        throw new Error(`Seller not found for item ${row.items.id}`);
      }
      const publicSeller: PublicUser = row.users;
      const itemWithSeller: ItemWithSeller = {
        ...row.items,
        seller: publicSeller,
      };
      return {
        ...row.cart_items,
        item: itemWithSeller,
      };
    });
  }

  async addToCart(userId: string, itemId: string): Promise<CartItem> {
    // Check if item is already in cart
    const [existing] = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.itemId, itemId)));
    
    if (existing) {
      return existing;
    }

    const [cartItem] = await db
      .insert(cartItems)
      .values({
        userId,
        itemId,
      })
      .returning();
    return cartItem;
  }

  async removeFromCart(userId: string, itemId: string): Promise<boolean> {
    const result = await db
      .delete(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.itemId, itemId)))
      .returning();
    return result.length > 0;
  }

  async clearCart(userId: string): Promise<void> {
    await db
      .delete(cartItems)
      .where(eq(cartItems.userId, userId));
  }

  async getFavorites(userId: string): Promise<FavoriteWithDetails[]> {
    const result = await db
      .select()
      .from(favorites)
      .leftJoin(items, eq(favorites.itemId, items.id))
      .leftJoin(users, eq(items.sellerId, users.id))
      .where(eq(favorites.userId, userId));
    
    const validResults: FavoriteWithDetails[] = [];
    
    for (const row of result) {
      // Skip if item doesn't exist, is deleted, or is sold
      if (!row.items || row.items.deletedAt || row.items.status === 'sold') {
        continue;
      }
      
      // Skip if seller doesn't exist (shouldn't happen with proper foreign keys)
      if (!row.users) {
        continue;
      }
      
      const publicSeller: PublicUser = row.users;
      const itemWithSeller: ItemWithSeller = {
        ...row.items,
        seller: publicSeller,
      };
      
      validResults.push({
        ...row.favorites,
        item: itemWithSeller,
      });
    }
    
    return validResults;
  }

  async addFavorite(userId: string, itemId: string): Promise<Favorite> {
    // Check if item is already favorited
    const [existing] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.itemId, itemId)));
    
    if (existing) {
      return existing;
    }

    const [favorite] = await db
      .insert(favorites)
      .values({
        userId,
        itemId,
      })
      .returning();
    return favorite;
  }

  async removeFavorite(userId: string, itemId: string): Promise<boolean> {
    const result = await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.itemId, itemId)))
      .returning();
    return result.length > 0;
  }

  async isFavorite(userId: string, itemId: string): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.itemId, itemId)));
    return !!favorite;
  }
}

export const storage = new DatabaseStorage();
