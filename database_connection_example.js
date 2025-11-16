// Example: How to connect to your PostgreSQL database from Node.js
// This file shows you how to use the database on another domain/server

// ============================================
// METHOD 1: Using pg (node-postgres) - Simple
// ============================================

// Install: npm install pg
const { Pool } = require('pg');
const crypto = require('crypto');

// Configure your database connection
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'unimart',
  user: 'your_username',
  password: 'your_password',
  
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// ============================================
// PASSWORD HASHING FUNCTIONS (REQUIRED!)
// ============================================

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  const hashToVerify = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === hashToVerify;
}

// ============================================
// EXAMPLE QUERIES
// ============================================

// Register a new user
async function registerUser(username, password, email) {
  const hashedPassword = hashPassword(password);
  
  const query = `
    INSERT INTO users (username, password, email, first_name, last_name)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, username, email, first_name, last_name
  `;
  
  const values = [username, hashedPassword, email, null, null];
  
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

// Login user
async function loginUser(username, password) {
  const query = 'SELECT * FROM users WHERE username = $1';
  
  try {
    const result = await pool.query(query, [username]);
    
    if (result.rows.length === 0) {
      return null; // User not found
    }
    
    const user = result.rows[0];
    const isValid = verifyPassword(password, user.password);
    
    if (!isValid) {
      return null; // Invalid password
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

// Get all items from marketplace
async function getMarketplaceItems() {
  const query = `
    SELECT 
      i.*,
      u.id as seller_id,
      u.username as seller_username,
      u.first_name as seller_first_name,
      u.last_name as seller_last_name
    FROM items i
    JOIN users u ON i.seller_id = u.id
    WHERE i.status = 'available' 
      AND i.deleted_at IS NULL
    ORDER BY i.created_at DESC
  `;
  
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
}

// Create a new item listing
async function createItem(sellerId, itemData) {
  const query = `
    INSERT INTO items (
      title, description, price, category, subcategory, 
      condition, images, seller_id, status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  
  const values = [
    itemData.title,
    itemData.description,
    itemData.price,
    itemData.category,
    itemData.subcategory,
    itemData.condition,
    itemData.images || [],
    sellerId,
    'available'
  ];
  
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
}

// Add item to cart
async function addToCart(userId, itemId) {
  const query = `
    INSERT INTO cart_items (user_id, item_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, item_id) DO NOTHING
    RETURNING *
  `;
  
  try {
    const result = await pool.query(query, [userId, itemId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

// Get user's cart with item details
async function getUserCart(userId) {
  const query = `
    SELECT 
      c.*,
      i.*,
      u.username as seller_username,
      u.first_name as seller_first_name,
      u.last_name as seller_last_name
    FROM cart_items c
    JOIN items i ON c.item_id = i.id
    JOIN users u ON i.seller_id = u.id
    WHERE c.user_id = $1
    ORDER BY c.created_at DESC
  `;
  
  try {
    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

// Add item to favorites
async function addToFavorites(userId, itemId) {
  const query = `
    INSERT INTO favorites (user_id, item_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, item_id) DO NOTHING
    RETURNING *
  `;
  
  try {
    const result = await pool.query(query, [userId, itemId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
}

// ============================================
// EXAMPLE USAGE
// ============================================

async function main() {
  try {
    // Register a user
    console.log('Registering user...');
    const user = await registerUser('johndoe', 'securepass123', 'john@example.com');
    console.log('User registered:', user);
    
    // Login
    console.log('\nLogging in...');
    const loggedInUser = await loginUser('johndoe', 'securepass123');
    console.log('Logged in:', loggedInUser);
    
    // Create an item
    console.log('\nCreating item...');
    const item = await createItem(user.id, {
      title: 'Used Calculus Textbook',
      description: 'Great condition, barely used',
      price: '45.00',
      category: 'Textbooks',
      subcategory: 'Mathematics',
      condition: 'like-new',
      images: ['https://example.com/image.jpg']
    });
    console.log('Item created:', item);
    
    // Get all items
    console.log('\nFetching marketplace items...');
    const items = await getMarketplaceItems();
    console.log(`Found ${items.length} items`);
    
  } catch (error) {
    console.error('Error in main:', error);
  } finally {
    // Close the pool when done
    await pool.end();
  }
}

// Run the example (uncomment to test)
// main();

// ============================================
// EXPORT FOR USE IN YOUR APP
// ============================================

module.exports = {
  pool,
  hashPassword,
  verifyPassword,
  registerUser,
  loginUser,
  getMarketplaceItems,
  createItem,
  addToCart,
  getUserCart,
  addToFavorites,
};
