-- UniMart Database Schema
-- PostgreSQL 16+
-- This schema can be used on any PostgreSQL database

-- Enable UUID generation (required for auto-generating IDs)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- SESSIONS TABLE
-- Stores user session data for authentication
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);

-- Index for faster session cleanup/expiry checks
CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

-- ============================================
-- USERS TABLE
-- Stores user account information
-- IMPORTANT: Passwords MUST be hashed before storing!
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
    username VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,  -- Store ONLY hashed passwords (use scrypt, bcrypt, or argon2)
    email VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster username lookups during login
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ============================================
-- ITEMS TABLE
-- Stores marketplace item listings
-- ============================================
CREATE TABLE IF NOT EXISTS items (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    condition TEXT NOT NULL,  -- "new", "like-new", "good", "fair"
    images TEXT[] DEFAULT '{}',  -- Array of image URLs/paths
    seller_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'available',  -- "available", "sold", "pending"
    created_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP  -- NULL means not deleted (soft delete)
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_items_seller ON items(seller_id);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_deleted ON items(deleted_at) WHERE deleted_at IS NULL;

-- ============================================
-- CART_ITEMS TABLE
-- Stores items in users' shopping carts
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id VARCHAR NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, item_id)  -- Prevent duplicate items in cart
);

-- Indexes for faster cart lookups
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_item ON cart_items(item_id);

-- ============================================
-- FAVORITES TABLE
-- Stores users' favorited/liked items
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id VARCHAR NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, item_id)  -- Prevent duplicate favorites
);

-- Indexes for faster favorites lookups
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_item ON favorites(item_id);

-- ============================================
-- OPTIONAL: Sample Data (Comment out if not needed)
-- ============================================

-- Create a test user (password is 'testpass123' hashed with scrypt)
-- NOTE: In production, use proper password hashing!
-- INSERT INTO users (username, email, first_name, last_name, password) 
-- VALUES (
--     'testuser',
--     'test@example.com',
--     'Test',
--     'User',
--     'hashed_password_here'  -- Replace with actual hashed password
-- );
