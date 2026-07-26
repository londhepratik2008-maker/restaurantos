# RestaurantOS

Smart Restaurant Management SaaS Platform built for VibeAthon 6.0.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS 4
- **UI Components:** Radix UI primitives with custom styling
- **State:** Zustand
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Backend:** Appwrite Cloud (Auth, Database, Storage)
- **AI:** Google Gemini API
- **Deployment:** Vercel

## Features

- **Dashboard** — Revenue overview, order stats, alerts, and charts
- **Menu Management** — Categories, items, pricing, availability toggle
- **Order Management** — Dine-in/takeaway/delivery with status flow
- **Table Management** — Visual floor plan with status indicators
- **Inventory Tracking** — Stock levels, low-stock alerts, supplier management
- **Staff Management** — Roles, profiles, hire dates
- **Billing & Transactions** — Income/expense tracking, daily summaries
- **Customer Management** — Visit tracking, loyalty points
- **Reports & Analytics** — Revenue charts, sales by category, top items
- **AI Insights** — Demand forecasting, waste reduction, menu optimization
- **Settings** — Restaurant info, subscription plans, notifications, security

## Getting Started

```bash
npm install
cp .env.example .env.local
# Fill in your Appwrite credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | Appwrite API endpoint |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Appwrite project ID |
| `NEXT_PUBLIC_APPWRITE_DATABASE_ID` | Database ID |
| `NEXT_PUBLIC_APPWRITE_STORAGE_ID` | Storage bucket ID |
| `GEMINI_API_KEY` | Google Gemini API key |

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # Reusable UI components (ui/, layout/, features/)
├── config/        # App configuration
├── hooks/         # Custom React hooks
├── lib/           # Utilities, validations, mock data
├── providers/     # Context providers (auth, theme)
├── store/         # Zustand state stores
└── types/         # TypeScript type definitions
```

## License

MIT
