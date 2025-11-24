# Local Development Setup Guide

This guide will help you run the UniMart marketplace project on your local machine with VS Code.

## Prerequisites

Before you begin, make sure you have these installed on your local machine:

- **Node.js 20+** (download from [nodejs.org](https://nodejs.org))
- **npm** (comes with Node.js)
- **Git** (download from [git-scm.com](https://git-scm.com))
- **VS Code** (download from [code.visualstudio.com](https://code.visualstudio.com))
- **PostgreSQL** (optional - only if you want database persistence instead of in-memory storage)

## Step 1: Clone the Project

### Option A: Clone from Replit to GitHub
1. In your Replit workspace, open the **Git pane** (left sidebar)
2. Click "Initialize Git repository" if not already initialized
3. Connect to GitHub and push your code
4. Clone the GitHub repository to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

### Option B: Download as ZIP
1. Download your Replit project as a ZIP file
2. Extract it to a folder on your local machine
3. Open the folder in VS Code

## Step 2: Remove Replit-Specific Dependencies

Once the project is on your local machine, you need to remove Replit-specific packages:

### 2.1 Edit `package.json`
Remove these lines from the `dependencies` section:
```json
"@replit/vite-plugin-cartographer": "^0.3.0",
"@replit/vite-plugin-runtime-error-modal": "^0.0.3",
```

### 2.2 Edit `vite.config.ts`
Change the imports at the top:
```typescript
// BEFORE (Replit version):
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],

// AFTER (Local version):
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
  ],
```

## Step 3: Install Dependencies

Open a terminal in VS Code and run:
```bash
npm install
```

This will install all the required packages on your local machine.

## Step 4: Configure Environment (Optional)

The project runs with **in-memory storage** by default (no database setup needed). If you want to use PostgreSQL for data persistence:

### 4.1 Set up PostgreSQL Database
1. Install PostgreSQL on your local machine
2. Create a new database:
   ```bash
   createdb unimart_dev
   ```

### 4.2 Create `.env` file
Create a `.env` file in the project root:
```env
# Database (optional - leave blank for in-memory storage)
DATABASE_URL=postgresql://username:password@localhost:5432/unimart_dev

# Session Secret (required)
SESSION_SECRET=your-super-secret-key-change-this-in-production

# Stripe (optional - only if using payment features)
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Object Storage (currently disabled - uses in-memory storage)
# Leave these blank unless you set up your own cloud storage
```

### 4.3 Enable Database (Optional)
If you want to use PostgreSQL instead of in-memory storage:

1. Edit `server/db.ts` - uncomment the database configuration
2. Run database migrations:
   ```bash
   npm run db:push
   ```
3. Seed the database:
   ```bash
   npx tsx server/seed.ts
   ```

## Step 5: Run the Development Server

Start the application:
```bash
npm run dev
```

The app will be available at: **http://localhost:5000**

## Step 6: Open in VS Code

1. Open the project folder in VS Code
2. Install recommended extensions:
   - **ESLint** - For code linting
   - **TypeScript and JavaScript Language Features** - Built-in
   - **Tailwind CSS IntelliSense** - For CSS class autocomplete

## Project Structure

```
├── client/              # Frontend React application
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Page components
│       └── lib/         # Utilities and helpers
├── server/              # Backend Express application
│   ├── routes.ts        # API endpoints
│   ├── storage.ts       # Data persistence layer
│   └── db.ts            # Database configuration (optional)
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schema and types
└── attached_assets/     # Static assets (images, etc.)
```

## Available Scripts

- `npm run dev` - Start development server (frontend + backend)
- `npm run db:push` - Sync database schema (if using PostgreSQL)
- `npx tsx server/seed.ts` - Seed database with initial data

## Features Currently Working Locally

✅ Full marketplace functionality
✅ Shopping cart
✅ User favorites
✅ Multi-image upload (saved to local filesystem)
✅ Category/subcategory filtering
✅ Search functionality
✅ In-memory storage (no database needed)

## Features That Need Additional Setup

⚠️ **Payment Processing (Stripe)** - Requires Stripe API keys in `.env`
⚠️ **Cloud Object Storage** - Currently disabled, uses local storage
⚠️ **PostgreSQL Database** - Optional, requires manual setup

## Troubleshooting

### Port 5000 already in use
If you see an error about port 5000 being in use:
1. Change the port in `server/index.ts` (look for `PORT` variable)
2. Or kill the process using port 5000:
   ```bash
   # On macOS/Linux
   lsof -ti:5000 | xargs kill -9
   
   # On Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

### TypeScript errors in VS Code
1. Restart the TypeScript server: Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
2. Type "TypeScript: Restart TS Server" and press Enter

### Module not found errors
Make sure you ran `npm install` after cloning the project.

## Next Steps

Once everything is running:
1. Create an account in the app
2. Add items to the marketplace
3. Test the shopping cart and favorites features
4. Explore the codebase in VS Code

## Need Help?

- Check the main `README.md` for project documentation
- Review `replit.md` for architecture details
- All packages are standard npm packages - no Replit-specific dependencies once you follow this guide

---

**Note:** This project was originally developed on Replit but is fully compatible with local development after removing the Replit-specific Vite plugins as described above.
