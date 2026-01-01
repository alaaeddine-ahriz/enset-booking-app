# ENSET Room Booking App

Application de gestion des réservations de salles pour l'ENSET - Built with Next.js 16 and SQLite.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/alaaeddine-ahriz/enset-booking-app.git
cd enset-booking-app

# Install dependencies
pnpm install

# Build better-sqlite3 native module
cd node_modules/.pnpm/better-sqlite3@*/node_modules/better-sqlite3
npm run build-release
cd -

# Seed the database with sample data
npx tsx lib/db/seed.ts

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── rooms/
│   │   ├── reservations/
│   │   └── user/
│   ├── components/       # Reusable UI components
│   ├── rooms/            # Rooms pages
│   ├── requests/         # Admin requests page
│   ├── reserve/          # Reservation form
│   └── profile/          # User profile
├── lib/
│   ├── db/               # Database (SQLite)
│   ├── repositories/     # Data access layer
│   ├── services/         # Business logic
│   └── types.ts          # TypeScript types
└── data/                 # SQLite database file (auto-created)
```

## 🔌 API Endpoints

| Endpoint                 | Methods            | Description                 |
| ------------------------ | ------------------ | --------------------------- |
| `/api/rooms`             | GET                | List rooms (with filters)   |
| `/api/rooms/[id]`        | GET                | Room details + availability |
| `/api/reservations`      | GET, POST          | List/Create reservations    |
| `/api/reservations/[id]` | GET, PATCH, DELETE | Manage reservation          |
| `/api/user/me`           | GET                | Current user + stats        |

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite (better-sqlite3)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript

## 🔄 Switching Database Provider

The app uses a Repository Pattern. To switch from SQLite to another provider:

1. Create new repository implementations in `lib/repositories/`
2. Update `lib/services/index.ts`:

```typescript
import { SupabaseRoomRepository } from "../repositories/supabase";

function createRepositories() {
  return {
    rooms: new SupabaseRoomRepository(),
    // ...
  };
}
```

## 📝 Available Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
npx tsx lib/db/seed.ts  # Re-seed database
```

## 👥 Default Users

After seeding, these accounts are available:

- **Souad Amitou** (Teacher) - Default logged-in user
- **Prof. Ahmed**, **Prof. Fatima**, **Prof. Hassan** (Teachers)
- **Admin User** (Administrator)

---

Made for ENSET 🎓
