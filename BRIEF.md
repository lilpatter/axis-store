# AXIS — Premium E‑commerce Storefront

> Reference this spec with `@BRIEF.md` in every prompt. Single source of truth for the project.

---

## TECH STACK

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand (cart, filters, search)
- **Deployment**: Vercel
- **Package Manager**: pnpm

---

## DESIGN PHILOSOPHY

Apple-inspired monochrome aesthetic. Clean, minimal, intentional. Every element earns its place.

### Design Rules

- **Colors**: Pure white (#FFFFFF), off-white (#F5F5F7), near-black (#1D1D1F), mid-grey (#6E6E73), accent-black (#000000)
- **Typography**: "SF Pro Display" via system font stack or "DM Sans" (Google Fonts) for headings; "DM Sans" for body. Never Inter, Roboto, or Arial.
- **Spacing**: Generous whitespace. Large padding. Breathable layouts.
- **Borders**: Hairline (1px) grey borders only.
- **Shadows**: Extremely subtle — 0 2px 8px rgba(0,0,0,0.06) max.
- **Hover**: Scale(1.01) + subtle shadow lift on product cards. Smooth 200ms ease.
- **Buttons**: CTA = solid black, white text; secondary = outlined. Rounded-full pill style on CTAs.
- **Images**: Use aspect-ratio containers to avoid layout shift.
- **Motion**: Fade-up on page load with staggered delays. No flashy animations.

---

## SITE ARCHITECTURE

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/shop` | All products (filters + search) |
| `/shop/[category]` | Category page |
| `/product/[slug]` | Product detail |
| `/cart` | Cart |
| `/search?q=` | Search results |
| `/about` | About (placeholder) |
| `/account` | Account (placeholder) |
| `/404` | Custom not found |

---

## COMPONENTS

### Global
- **Navbar**: Fixed top. Logo left. Nav center (Shop, Categories, About). Icons right: Search, Cart (badge), Account. Hamburger on mobile.
- **Footer**: 4 columns. Logo+tagline | Shop | Help | Social. Border-top hairline.
- **Search Modal**: Full-screen overlay, autofocus, live results, Escape to close.

### Homepage
- **Hero**: Full-width, heading, tagline, CTAs, off-white + geometric grid.
- **Featured Categories**: Horizontal scroll (mobile) / 4-col grid (desktop).
- **Featured Products**: "New Arrivals" 4-product grid with quick-add.
- **Banner**: Full-width editorial CTA.
- **Trending**: Second 4-product grid.

### Product Card
Props: `id`, `name`, `price`, `category`, `image`, `badge`. Hover zoom, quick-add icon.

### Product Detail
Image + thumbnails | Breadcrumb, name, price, description, variants, quantity, Add to Bag, tabs (Description | Details | Shipping), Related Products grid.

### Shop / Category
Sidebar filters (category, price, sort) | Product grid | Active filter pills | Result count.

### Cart
Line items (image, name, variant, price, qty, remove) | Summary (subtotal, shipping, total, Checkout) | Empty state.

---

## DATA & TYPES

- **Products**: `/lib/data/products.ts` — 24+ products across Clothing, Shoes, Jewellery, Accessories, Tech Accessories, Home.
- **Types**: `/types/index.ts` — Product, CartItem, Category, SearchResult.

---

## FEATURES

- **Search**: Fuse.js fuzzy search. 300ms debounce. Top 8 in overlay. Enter → `/search?q=`.
- **Cart**: Zustand + `persist` to localStorage.

---

## SECURITY

1. `.env.local` + `.env.example` for secrets
2. CSP headers in `next.config.ts`
3. Input sanitization (DOMPurify or escaping)
4. `middleware.ts` with rate-limit TODO
5. Error boundaries
6. `/app/api/` placeholder for future auth, Stripe, webhooks

---

## FOLDER STRUCTURE

```
src/
  app/
  components/
  lib/
  store/
  types/
public/
```

---

## FUTURE TODOS

- Replace static data with Shopify Storefront API or CMS
- Stripe Checkout via /api/checkout
- NextAuth.js for auth
- Algolia/Typesense for production search
- Inventory webhooks
- Vercel Analytics + PostHog
- A/B testing via Vercel Edge Config
