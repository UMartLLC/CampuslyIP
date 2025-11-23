// Database seeding file - CURRENTLY DISABLED FOR IN-MEMORY STORAGE
// This file is only needed when using PostgreSQL database
// To use with a real database, ensure DATABASE_URL is set

async function seed() {
  try {
    // Check if database is enabled (DATABASE_URL environment variable is set)
    if (!process.env.DATABASE_URL) {
      console.log("⚠ Database is disabled (using in-memory storage). Skipping seed.");
      console.log("✓ Default user is automatically created in MemStorage");
      process.exit(0);
      return;
    }

    // Dynamically import database modules only when DATABASE_URL is available
    const dbModule = await import("./db");
    const schemaModule = await import("@shared/schema");
    const drizzleModule = await import("drizzle-orm");

    // Temporary user ID for unrestricted access (matches server/routes.ts)
    const TEMP_USER_ID = "temp-user-id";

    // At this point, we know DATABASE_URL is set, so db should be initialized
    // The db type is inferred from the import, but TypeScript sees it as potentially null
    // We use a runtime check and type narrowing
    const db = dbModule.db;
    const users = schemaModule.users;
    const eq = drizzleModule.eq;

    if (!db) {
      console.error("✗ Database connection failed");
      process.exit(1);
      return;
    }

    // TypeScript can't narrow the type after dynamic import, but runtime check ensures db is not null
    // Check if temporary default user already exists
    // @ts-ignore
    const [existingUser] = await db.select().from(users).where(eq(users.id, TEMP_USER_ID));

    if (!existingUser) {
      // Create temporary default user for unrestricted access
      // NOTE: Authentication is temporarily disabled
      // @ts-ignore - TypeScript can't narrow the type after dynamic import, but runtime check ensures db is not null
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
