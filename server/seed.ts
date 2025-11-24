// Database seeding file
// When database is enabled (db.ts configured): seeds the database with default user
// When database is disabled (using MemStorage): exits gracefully

async function seed() {
  try {
    // Dynamically import database module to check if it's configured
    const { db } = await import("./db");

    // Check if database connection is available
    // db will be null if database code in db.ts is commented out (using in-memory storage)
    if (!db) {
      console.log("⚠ Database is disabled (using in-memory storage). Skipping seed.");
      console.log("✓ Default user is automatically created in MemStorage");
      console.log("ℹ To enable database seeding, uncomment the database configuration in server/db.ts");
      process.exit(0);
      return;
    }

    // Database is enabled - proceed with seeding
    const { users } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");

    // Temporary user ID for unrestricted access (matches server/routes.ts)
    const TEMP_USER_ID = "temp-user-id";

    // Type assertion: db is checked for null above. When DATABASE_URL is set and db.ts
    // is properly configured (uncommented), db will be a valid Drizzle database instance.
    const database = db as any;

    // Check if temporary default user already exists
    const [existingUser] = await database
      .select()
      .from(users)
      .where(eq(users.id, TEMP_USER_ID));

    if (!existingUser) {
      // Create temporary default user for unrestricted access
      await database.insert(users).values({
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
