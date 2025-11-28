import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, index, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
// Referenced from blueprint:javascript_log_in_with_replit
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for username/password authentication
// Referenced from blueprint:javascript_auth_all_persistance
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").notNull().unique(),
  password: varchar("password").notNull(),
  email: varchar("email"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  condition: text("condition").notNull(), // "new", "like-new", "good", "fair"
  images: text("images").array().default(sql`'{}'::text[]`),
  quantity: integer("quantity").notNull().default(1), // Available stock
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  status: text("status").notNull().default("available"), // "available", "sold", "pending"
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  itemId: varchar("item_id").notNull().references(() => items.id),
  quantity: integer("quantity").notNull().default(1), // Quantity in cart
  createdAt: timestamp("created_at").defaultNow(),
});

export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  itemId: varchar("item_id").notNull().references(() => items.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema for inserting new user (registration)
// Referenced from blueprint:javascript_auth_all_persistance
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
});

export const insertItemSchema = createInsertSchema(items).pick({
  title: true,
  description: true,
  price: true,
  category: true,
  subcategory: true,
  condition: true,
  images: true,
  quantity: true,
}).extend({
  subcategory: z.string().min(1, "Subcategory is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").default(1),
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  itemId: true,
  quantity: true,
}).extend({
  quantity: z.number().int().min(1, "Quantity must be at least 1").default(1),
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  itemId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type PublicUser = Omit<User, 'password'>;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type Item = typeof items.$inferSelect;
export type ItemWithSeller = Item & { seller: PublicUser };
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type CartItemWithDetails = CartItem & { item: ItemWithSeller };
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type FavoriteWithDetails = Favorite & { item: ItemWithSeller };
