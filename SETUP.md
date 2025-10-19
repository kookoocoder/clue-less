# Quick Setup Guide

## Prerequisites

- PostgreSQL database running (local or remote)
- Node.js 18+ installed

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ciphertalk?schema=public"
```

**Example for local Postgres:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ciphertalk?schema=public"
```

### 3. Initialize Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Seed chess puzzles
npm run prisma:seed
```

### 4. Verify Setup

```bash
# Run tests
npm test

# Open Prisma Studio to view data
npm run prisma:studio
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Available Routes

- `/` — Landing page
- `/(auth)/login` — WebAuthn authentication
- `/(gate)/gate` — Chess puzzle gate
- `/(chat)/chat` — Encrypted chat (requires unlock token)

## Database Schema

The schema includes:
- **User** — Unique handle, single device
- **UserDevice** — WebAuthn credentials (one per user)
- **Session** — Short-lived (1 hour)
- **UnlockToken** — Puzzle unlock tokens (15 min TTL)
- **Message** — Ciphertext-only storage
- **Thread** — Chat threads
- **Puzzle** — Curated chess problems

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

## Common Issues

### Port 5432 already in use
If PostgreSQL isn't running on the default port, update `DATABASE_URL` with the correct port.

### Prisma Client not generated
Run `npm run prisma:generate` after any schema changes.

### Migration conflicts
Reset database (⚠️ deletes all data):
```bash
npx prisma migrate reset
```

## Next Steps

1. Set up a PostgreSQL instance (Neon, Supabase, or local)
2. Configure `.env` with your `DATABASE_URL`
3. Run migrations and seed
4. Start building!

---

For detailed architecture, see [README.md](./README.md)

