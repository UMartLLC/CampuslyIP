# Database Setup Guide - UniMart

This guide will help you set up the UniMart database on your own PostgreSQL server.

## Prerequisites

- PostgreSQL 12 or higher installed
- Access to create databases
- Basic knowledge of SQL and command line

## Step 1: Create Your Database

```bash
# Connect to PostgreSQL as admin
psql -U postgres

# Create a new database
CREATE DATABASE unimart;

# Connect to your new database
\c unimart
```

## Step 2: Run the Schema File

```bash
# From your terminal (outside psql)
psql -U postgres -d unimart -f database_schema.sql

# OR from inside psql
\i database_schema.sql
```

This will create all the tables, indexes, and constraints.

## Step 3: Verify Installation

```sql
-- Check that all tables were created
\dt

-- You should see:
-- sessions
-- users
-- items
-- cart_items
-- favorites

-- Check a specific table structure
\d users
```

## Step 4: Configure Your Application

Update your application's database connection settings:

```javascript
// Example connection string
DATABASE_URL=postgresql://username:password@localhost:5432/unimart

// Or individual settings
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unimart
DB_USER=your_username
DB_PASSWORD=your_password
```

## Security Notes

### 🔐 Password Hashing (CRITICAL)

**NEVER store plain text passwords!** This app uses `scrypt` for password hashing. Here's how it works:

```javascript
// When registering a new user:
const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

// When verifying login:
function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  const hashToVerify = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === hashToVerify;
}

// Store in database like this:
INSERT INTO users (username, password, email) 
VALUES ('john', hashPassword('user_password'), 'john@example.com');
```

### 💳 Payment Security

**DO NOT store credit card numbers in this database!**

Instead:
1. Use a payment processor like Stripe, PayPal, or Square
2. Store only transaction IDs and amounts
3. Let the payment processor handle sensitive card data

Example transactions table (if you need it):
```sql
CREATE TABLE transactions (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
    user_id VARCHAR REFERENCES users(id),
    item_id VARCHAR REFERENCES items(id),
    amount DECIMAL(10, 2),
    stripe_payment_id VARCHAR,  -- Reference to Stripe, NOT card number
    status VARCHAR,  -- 'pending', 'completed', 'failed'
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Step 5: Database Backup

### Create a backup:
```bash
pg_dump -U postgres unimart > unimart_backup.sql
```

### Restore from backup:
```bash
psql -U postgres unimart < unimart_backup.sql
```

## Step 6: Moving to Another Server

### Export data from Replit:
```bash
# If you have pg_dump access
pg_dump $DATABASE_URL > export.sql
```

### Import to your server:
```bash
# First create the schema
psql -U postgres -d unimart -f database_schema.sql

# Then import the data
psql -U postgres -d unimart -f export.sql
```

## Common Issues

### Issue: "relation already exists"
**Solution:** Tables already exist. Drop and recreate:
```sql
DROP TABLE IF EXISTS favorites, cart_items, items, users, sessions CASCADE;
```
Then run the schema file again.

### Issue: "extension pgcrypto does not exist"
**Solution:** Install the extension:
```sql
CREATE EXTENSION pgcrypto;
```

### Issue: Foreign key constraint errors
**Solution:** Ensure you import data in the correct order:
1. users
2. items
3. cart_items, favorites

## Production Checklist

- [ ] Database has strong password
- [ ] PostgreSQL allows only necessary connections (firewall rules)
- [ ] SSL/TLS enabled for database connections
- [ ] Regular automated backups configured
- [ ] Passwords are hashed (never plain text)
- [ ] Credit cards are NOT stored (use payment processor)
- [ ] Database user has minimal required permissions
- [ ] Connection pooling configured
- [ ] Monitoring and logging enabled

## Maintenance

### Clean up old sessions:
```sql
DELETE FROM sessions WHERE expire < NOW();
```

### Find inactive users:
```sql
SELECT * FROM users WHERE created_at < NOW() - INTERVAL '90 days';
```

### Check database size:
```sql
SELECT pg_size_pretty(pg_database_size('unimart'));
```

## Need Help?

- PostgreSQL Docs: https://www.postgresql.org/docs/
- Payment Security: https://stripe.com/docs/security
- Password Hashing: https://nodejs.org/api/crypto.html#crypto_crypto_scrypt_password_salt_keylen_options_callback
