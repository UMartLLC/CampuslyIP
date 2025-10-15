import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    // Check if default user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, "default@unimart.edu"));

    if (!existingUser) {
      // Create default test user for development
      await db.insert(users).values({
        email: "default@unimart.edu",
        firstName: "Default",
        lastName: "User",
        profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
      });
      console.log("✓ Default user seeded successfully");
    } else {
      console.log("✓ Default user already exists");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
