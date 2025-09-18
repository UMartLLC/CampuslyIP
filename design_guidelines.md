# Student Marketplace Design Guidelines

## Design Approach
**Reference-Based Approach** - Drawing inspiration from **Etsy** and **Facebook Marketplace** for their student-friendly, community-focused aesthetics combined with **Venmo's** approachable payment interface.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Light mode: 220 85% 25% (deep blue)
- Dark mode: 220 40% 85% (light blue-gray)

**Background Colors:**
- Light mode: 45 20% 96% (warm off-white)
- Dark mode: 220 15% 12% (dark blue-gray)

**Accent Colors:**
- Success/trust: 150 60% 45% (muted green for transactions)
- Subtle highlights: 200 25% 88% (very light blue)

### Typography
- **Primary Font:** Inter (Google Fonts)
- **Secondary Font:** Poppins for headings (Google Fonts)
- **Hierarchy:** Large headings (2xl-3xl), body text (base), small labels (sm)

### Layout System
**Tailwind Spacing:** Primary units of 2, 4, 6, and 8 (p-4, m-6, gap-8, etc.)
- Consistent 4-unit padding for cards
- 6-unit margins between sections
- 8-unit spacing for major layout divisions

## Component Library

### Navigation
- Clean header with logo, search bar, and user actions
- Sticky navigation with subtle shadow
- Mobile-responsive hamburger menu

### Item Cards
- Clean rectangular cards with rounded corners
- Image aspect ratio 4:3 for consistency
- Price prominently displayed
- Seller avatar and quick info
- Subtle hover elevation effects

### Forms & Inputs
- Rounded input fields with subtle borders
- Clear labels and helpful placeholder text
- Upload areas with drag-and-drop styling
- Multi-step form progression for item listing

### Payment Integration
- Stripe Elements with consistent styling
- Payment method icons (Apple Pay, card, etc.)
- Clear transaction summaries
- Trust indicators and security badges

## Key Pages Design

### Welcome Page
- **Hero Section:** Large background image of diverse students with laptops/books
- Overlay with value proposition: "Buy, Sell, Connect - Your Campus Marketplace"
- **Features Section:** 3-column grid highlighting safety, ease of use, and community
- **Call-to-Action:** Prominent "Start Browsing" button

### Items Listing
- **Filter Sidebar:** Categories, price range, condition, location
- **Grid Layout:** 3-4 items per row on desktop, responsive stacking
- **Search Bar:** Prominent with autocomplete suggestions
- **Sort Options:** Price, date, popularity, distance

### Add Item Page
- **Progressive Form:** Step-by-step item creation
- **Image Upload:** Large drag-and-drop area with preview gallery
- **Category Selection:** Visual category picker with icons
- **Pricing Helper:** Suggested price ranges based on similar items

## Images
- **Hero Image:** Students collaborating in a modern campus setting with books, laptops, and casual items
- **Category Icons:** Simple line icons for Electronics, Books, Clothing, Furniture, etc.
- **Trust Badges:** Payment security, student verification, safe transaction icons
- **Placeholder Images:** Consistent gray placeholders for items without photos

## Interaction Patterns
- **Loading States:** Subtle skeleton screens for content loading
- **Empty States:** Friendly illustrations encouraging users to add items or expand search
- **Success States:** Clear confirmation messages for purchases and listings
- **Error Handling:** Helpful error messages with suggested actions

This design creates a trustworthy, student-focused marketplace that feels both modern and approachable while maintaining the professionalism needed for financial transactions.