// Category and subcategory configuration for the marketplace
export const CATEGORY_CONFIG = {
  "Electronics": {
    subcategories: ["Laptops", "Phones", "Tablets", "Electronics Accessories", "Other Electronics"]
  },
  "Furniture": {
    subcategories: ["Desks", "Chairs", "Lamps & Lighting", "Storage", "Other Furniture"]
  },
  "Bed & Bath": {
    subcategories: ["Sheets", "Pillows", "Pillow Covers", "Toiletries", "Cleaning, Plunger, and Brushes", "Other Bed & Bath"]
  },
  "Clothing": {
    subcategories: ["Dress and Formal Wear", "T-shirts", "Long Sleeve Shirts", "Polos", "Pants", "Shorts", "Hoodies, Sweaters, and Sweatshirts",
      "Shoes", "Gym", "Clothing Accessories", "Other Clothing"]
  },
  "School Supplies": {
    subcategories: ["Notebooks", "Pens & Pencils", "Binders", "Calculators", "Art Supplies", "Other Supplies"]
  },
  "Books": {
    subcategories: ["Physical Books", "E-books", "Math & Engineering", "Biology & Chemistry", "Psychology",
      "Humanities", "Business", "Arts", "Fiction", "Non-Fiction", "Other Subjects"]
  },
  "Sports & Recreation": {
    subcategories: ["Exercise Equipment", "Bikes", "Outdoor Gear", "Sports Gear", "Other Recreation"]
  },
  "Other": {
    subcategories: ["Home Goods", "Hangers & Hooks", "Photography & Cameras", "Stuffed Animals", "Miscellaneous"]
  }
} as const;

export type CategoryKey = keyof typeof CATEGORY_CONFIG;
export type SubcategoryKey<T extends CategoryKey> = typeof CATEGORY_CONFIG[T]['subcategories'][number];

// Helper function to get subcategories for a category
export function getSubcategories(category: string): readonly string[] {
  return CATEGORY_CONFIG[category as CategoryKey]?.subcategories || [];
}

// Get all main categories
export function getAllCategories(): string[] {
  return Object.keys(CATEGORY_CONFIG);
}
