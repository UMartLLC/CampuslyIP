import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

// Temporary user ID for unrestricted access (matches server/routes.ts)
const TEMP_USER_ID = "temp-user-id";

async function seed() {
  try {
    // Check if temporary default user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, TEMP_USER_ID));

    if (!existingUser) {
      // Create temporary default user for unrestricted access
      // NOTE: Authentication is temporarily disabled
      await db.insert(users).values({
        id: TEMP_USER_ID,
        username: "temp-user",
        password: "temp-password-not-used",
        email: "temp@unimart.local",
        firstName: "Anonymous",
        lastName: "User",
        profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous",
      });
      console.log("✓ Temporary default user seeded successfully");
    } else {
      console.log("✓ Temporary default user already exists");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
