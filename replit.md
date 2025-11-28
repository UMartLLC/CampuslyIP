# Student Marketplace (CampusMarket/UniMart)

## Overview

CampusMarket (UniMart) is a student-focused marketplace platform designed for buying, selling, and trading items within university communities. It facilitates secure transactions for items like textbooks, electronics, furniture, and clothing, featuring integrated messaging, payment processing, and advertising capabilities. The platform aims to provide a student-friendly experience with community-focused aesthetics inspired by popular marketplace and payment applications. It is built as a full-stack TypeScript monorepo with a React frontend and Express backend. Key features include quantity management for items, clickable item cards linking to detail pages, and a favorites system.

## User Preferences

Preferred communication style: Simple, everyday language.
Privacy settings: Seller names remain anonymous ("Anonymous Seller") in marketplace listings and shopping cart until transaction completion.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript
- Vite for building and development
- Wouter for routing
- React Query for server state management

**UI Component System:**
- Shadcn UI with Radix UI primitives
- Tailwind CSS for styling with a custom design system
- ThemeProvider context for light/dark modes
- Design inspiration from Etsy, Facebook Marketplace, and Venmo

**Design System:**
- Primary colors: Deep blue (light mode) and light blue-gray (dark mode)
- Typography: Inter (primary) and Poppins (headings)
- Tailwind-based spacing system
- Custom CSS variables for theme consistency

**State Management:**
- React Query for async state and API data
- React Hook Form with Zod for form handling
- Context API for theme management
- Local component state with React hooks

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- RESTful API design
- Session-based authentication with `connect-pg-simple`
- Multer for file uploads

**Database Layer:**
- PostgreSQL (Neon serverless)
- Drizzle ORM for type-safe operations
- DatabaseStorage implementation
- Schema-first design with automated Drizzle migrations
- UUID primary keys and foreign key constraints
- Soft delete mechanism for items (`deletedAt` field)

**Database Schema:**
- **Users**: Authentication and profile data.
- **Items**: Marketplace listings including seller references, pricing, images, categories, conditions, and status.
- **Cart Items**: Persistent shopping cart data.
- **Favorites**: User's liked items.
- Types like `PublicUser`, `ItemWithSeller`, `CartItemWithDetails`, `FavoriteWithDetails` for structured API responses.

**API Structure:**
- Comprehensive CRUD operations for `/api/items`, `/api/cart`, and `/api/favorites`.
- `/public-objects/:filePath` for public image retrieval.
- Authenticated endpoints use session cookies.
- Standardized error handling and request/response logging.

### File Storage

**Object Storage (Replit/Google Cloud Storage):**
- Google Cloud Storage SDK via Replit sidecar.
- Public/private path separation.
- `ObjectStorageService` for all storage operations.
- Multipart form data for image uploads.

**Image Handling:**
- Multiple images per item listing (up to 5).
- Image carousel display.
- Image reordering, addition, and removal during listing creation/editing.

### Payment Integration

**Supported Payment Methods:**
- Stripe, Apple Pay, Venmo, credit/debit cards.
- Transaction fee structure (2.9% for cards, 0% for Apple Pay/Venmo).

**Payment Flow:**
- Modal-based checkout.
- Payment method selection UI.
- Secure processing via Stripe.

### Authentication & Security

**Authentication Strategy:**
- Session-based authentication with PostgreSQL session store.
- Password hashing using Node.js crypto scrypt.
- Passport.js local strategy.
- Credential-based login and registration.

**Security Measures:**
- CORS configuration.
- Zod schema validation.
- SQL injection protection via Drizzle ORM.
- Environment variable management.
- Password exclusion from API responses.

### Key Features Architecture

**Marketplace Features:**
- Multi-step item listing form.
- Multi-level category/subcategory system with accordion-style filtering UI, item counts, and empty state handling.
- Site-wide search functionality.
- Sorting options (price, date, relevance).
- Item condition classification and status tracking.
- Favorites/Like functionality with optimistic UI updates.
- Image management with carousel navigation and editing capabilities.
- Anonymous seller display.
- Shopping cart with persistent storage, item management, duplicate prevention, and order summary.

**Messaging System:**
- Buyer-seller messaging interface (WhatsApp/iMessage-inspired).
- Pinned support conversations.
- Meetup scheduling with calendar.

**Advertising Platform (LocoLoco):**
- Dashboard for advertisement management.
- Promotion of events, roommates, and items.
- Tiered advertising options.

**User Account Management:**
- Dashboard with profile settings.
- Comprehensive user dropdown menu for account sections (Dashboard, My Market, Items History, Favorites, My Bids, My Purchases, My LocoLoco, Report a Concern, Legal).
- "My Market" for active listings with management tools (soft-delete, repost).
- "Items History" for all posted items, including deleted ones.
- "Favorites" display.
- Password reset functionality.

## External Dependencies

**Cloud Services:**
- **Replit Object Storage**: Google Cloud Storage via Replit sidecar.
- **Neon**: Serverless PostgreSQL database.
- **Stripe**: Payment processing.

**Third-Party APIs:**
- Google Cloud Storage SDK.
- Stripe SDK.

**UI Libraries:**
- Radix UI.
- Lucide React (icons).
- React Icons.

**Development Tools:**
- Drizzle Kit (migrations).
- ESBuild (server bundling).

**Asset Management:**
- Google Fonts (Inter, Poppins).

**Form & Validation:**
- React Hook Form.
- Zod.
- @hookform/resolvers.

**Utilities:**
- clsx and tailwind-merge.
- nanoid.
- class-variance-authority.