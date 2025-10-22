# Student Marketplace (CampusMarket/UniMart)

## Overview

CampusMarket (also referred to as UniMart) is a student-focused marketplace platform that enables buying, selling, and trading of items within campus communities. The platform facilitates safe transactions between students for textbooks, electronics, furniture, clothing, and other items. It features integrated messaging, payment processing, and advertising capabilities.

The application is built as a full-stack TypeScript monorepo with a React frontend and Express backend, designed to be student-friendly with community-focused aesthetics inspired by Etsy, Facebook Marketplace, and Venmo.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type safety
- Vite as the build tool and dev server with HMR support
- Wouter for lightweight client-side routing
- React Query (@tanstack/react-query) for server state management

**UI Component System:**
- Shadcn UI component library with Radix UI primitives
- Tailwind CSS for styling with custom design system
- Custom theme system supporting light/dark modes via ThemeProvider context
- Design inspired by Etsy, Facebook Marketplace, and Venmo aesthetics

**Design System:**
- Primary colors: Deep blue (light mode: `220 85% 25%`) and light blue-gray (dark mode: `220 40% 85%`)
- Typography: Inter (primary) and Poppins (headings) from Google Fonts
- Spacing system using Tailwind units (2, 4, 6, 8)
- Custom CSS variables for theme consistency with HSL color format

**State Management:**
- React Query for async state and API data fetching
- React Hook Form with Zod validation for form handling
- Context API for theme management
- Local component state with React hooks

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- RESTful API design pattern
- Session-based authentication (connect-pg-simple for session storage)
- Multer for file upload handling

**Database Layer:**
- PostgreSQL as the primary database (Neon serverless)
- Drizzle ORM for type-safe database operations
- DatabaseStorage implementation replacing in-memory storage
- Neon serverless PostgreSQL driver (@neondatabase/serverless)
- Schema-first design with automated Drizzle migrations (db:push)

**Database Schema:**
- **Users table**: Authentication and profile data (id, username, email, password, firstName, lastName, profileImageUrl)
- **Items table**: Marketplace listings with seller references, pricing, images, categories, conditions, status tracking, and soft-delete support (deletedAt field)
- **Cart Items table**: Shopping cart persistence (id, userId, itemId, createdAt) with duplicate prevention
- UUID primary keys with PostgreSQL's `gen_random_uuid()`
- Relational integrity via foreign key constraints
- Soft delete implementation for items (deletedAt timestamp instead of hard delete)
- PublicUser type excludes password field for API responses
- ItemWithSeller type joins items with sanitized seller data
- CartItemWithDetails type joins cart items with full item and seller data

**Data Persistence:**
- All items and users stored in PostgreSQL database
- Default seeded user (temp-user-id) for testing
- Seed script available at server/seed.ts

**API Structure:**
- `/api/items` - Item CRUD operations with filtering support (supports ?sellerId query parameter for My Market, ?includeDeleted=true for Items History)
- `/api/items` POST - Authenticated item creation with image upload via multipart/form-data
- `/api/items/:id` DELETE - Soft-delete item (sets deletedAt timestamp)
- `/api/items/:id/repost` POST - Restore deleted item (clears deletedAt, sets status to 'available')
- `/api/cart` GET - Retrieve user's cart items with full item and seller details
- `/api/cart` POST - Add item to cart (prevents duplicates)
- `/api/cart/:itemId` DELETE - Remove specific item from cart
- `/api/cart` DELETE - Clear entire cart
- `/public-objects/:filePath` - Public image/file retrieval from object storage
- All authenticated endpoints include session cookies via TanStack Query default fetcher
- Standardized error handling middleware
- Request/response logging for API endpoints

### File Storage

**Object Storage (Replit/Google Cloud Storage):**
- Google Cloud Storage SDK (@google-cloud/storage)
- Replit sidecar endpoint authentication for GCS
- Public/private path separation for access control
- ObjectStorageService in server/objectStorage.ts for all storage operations
- Image upload with multipart form data
- Streaming file downloads for efficient delivery

**Image Handling:**
- Multiple image support per item listing
- Array-based image storage in database
- Public object URLs served via /public-objects/:filePath route

### Payment Integration

**Supported Payment Methods:**
- Stripe integration (@stripe/stripe-js, @stripe/react-stripe-js)
- Apple Pay support
- Venmo integration
- Credit/debit card processing
- Transaction fee structure (2.9% for cards, 0% for Apple Pay/Venmo)

**Payment Flow:**
- Modal-based checkout experience
- Payment method selection UI
- Secure payment processing via Stripe
- Payment completion callbacks

### Authentication & Security

**Authentication Strategy:**
- Session-based authentication with PostgreSQL session store (connect-pg-simple)
- Password hashing using Node.js crypto scrypt with salt
- Passport.js local strategy for username/password authentication
- User profile management with avatar support
- Credential-based login and registration system

**Security Measures:**
- CORS configuration for API security
- Input validation using Zod schemas
- SQL injection protection via Drizzle ORM parameterized queries
- Environment variable management for sensitive credentials
- Password exclusion from API responses (PublicUser type)
- Sanitized seller data in item listings

### Key Features Architecture

**Marketplace Features:**
- Item listing with multi-step form
- Category-based browsing (Electronics, Textbooks, Furniture, etc.)
- Advanced filtering (category, condition, price range, search)
- Sorting options (price, date, relevance)
- Item condition classification (new, like-new, good, fair)
- Status tracking (available, sold, pending)
- Shopping cart functionality with persistent storage
  - Add items to cart from marketplace
  - Cart icon in header with item count badge
  - Full cart page with item management
  - Remove individual items or clear entire cart
  - Duplicate prevention (same item can't be added twice)
  - Order summary with total calculation

**Messaging System:**
- Messaging interface between buyers and sellers
- WhatsApp/iMessage-inspired UI design
- Pinned support conversations
- Message sending with Enter key support
- Built-in calendar for meetup scheduling
- Conversation list with message preview
- Real-time message display in chat area

**Advertising Platform (LocoLoco):**
- Advertisement management dashboard
- Event, roommate, and item promotion
- Tiered advertising (premium/standard)
- Advertisement creation and tracking

**User Account Management:**
- Dashboard with profile settings
- "My Market" - seller's active listings with full management capabilities
  - Shows only non-deleted, available items
  - Always-visible "Sell Item" button for adding new listings
  - Delete functionality with confirmation dialog (soft-deletes items)
  - Empty state with call-to-action when no items listed
- "Items History" - comprehensive view of all items ever posted
  - Categorized by status: Available, Sold, Deleted
  - Shows item counts for each category
  - Deleted items displayed with grayscale images and reduced opacity
  - Repost functionality to restore deleted items back to marketplace
  - Includes all items regardless of deletedAt status
- "My Bids" - bid tracking and notifications
- "My Purchases" - purchase history with sorting
- Report concern form with admin notification
- Password reset functionality via username
- Remember Me checkbox for extended session (30 days)
- ItemCard component displays seller info using firstName/lastName with username fallback

## External Dependencies

**Cloud Services:**
- **Replit Object Storage**: Google Cloud Storage-based file storage via Replit sidecar
- **Neon**: Serverless PostgreSQL database hosting
- **Stripe**: Payment processing and checkout

**Third-Party APIs:**
- Google Cloud Storage SDK for object storage operations
- Stripe SDK for payment processing

**UI Libraries:**
- Radix UI component primitives (dialogs, dropdowns, navigation, etc.)
- Lucide React for icons
- React Icons for social media icons

**Development Tools:**
- Drizzle Kit for database migrations
- ESBuild for server bundling
- Replit development environment integration

**Asset Management:**
- Google Fonts (Inter, Poppins)
- Local asset storage in `/attached_assets`
- Generated images for hero sections and marketing

**Form & Validation:**
- React Hook Form for form state
- Zod for schema validation
- @hookform/resolvers for integration

**Utilities:**
- clsx and tailwind-merge for class name management
- nanoid for unique ID generation
- class-variance-authority for variant-based styling