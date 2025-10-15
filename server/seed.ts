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
      // Create default user
      await db.insert(users).values({
        id: "temp-user-id",
        username: "defaultuser",
        email: "default@unimart.edu",
        name: "Default User",
        password: "placeholder", // In production, this would be hashed
        avatar: null,
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
