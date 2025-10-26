// Category and subcategory configuration for the marketplace
export const CATEGORY_CONFIG = {
  "Electronics": {
    subcategories: ["Laptops", "Phones", "Tablets", "Accessories", "Other Electronics"]
  },
  "Textbooks": {
    subcategories: ["Physical Books", "Ebooks", "Math & Science", "Humanities", "Business", "Engineering", "Other Subjects"]
  },
  "Furniture": {
    subcategories: ["Desks", "Chairs", "Beds", "Storage", "Lighting", "Other Furniture"]
  },
  "Clothing": {
    subcategories: ["T-shirts", "Hoodies", "Pants", "Shorts", "Shoes", "Accessories", "Other Clothing"]
  },
  "School Supplies": {
    subcategories: ["Notebooks", "Pens & Pencils", "Binders", "Calculators", "Art Supplies", "Other Supplies"]
  },
  "Sports & Recreation": {
    subcategories: ["Exercise Equipment", "Bikes", "Outdoor Gear", "Sports Gear", "Other Recreation"]
  },
  "Other": {
    subcategories: ["Home Goods", "Electronics Accessories", "Misc Items"]
  }
} as const;

export type CategoryKey = keyof typeof CATEGORY_CONFIG;
export type SubcategoryKey<T extends CategoryKey> = typeof CATEGORY_CONFIG[T]['subcategories'][number];

// Helper function to get subcategories for a category
export function getSubcategories(category: string): string[] {
  return CATEGORY_CONFIG[category as CategoryKey]?.subcategories || [];
}

// Get all main categories
export function getAllCategories(): string[] {
  return Object.keys(CATEGORY_CONFIG);
}
