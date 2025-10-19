# CipherTalk — Puzzle-Gated, End-to-End Encrypted Chat

An ultra-secure, privacy-centric chat platform where users must solve logic-based puzzles (like chess problems) to gain access, with true end-to-end encryption and device-bound identity keys.

## Features

- **End-to-End Encryption (E2EE)**: Messages readable only by sender and receiver
- **Zero Passwords**: WebAuthn/FIDO2 passkey-based login
- **Single-Device Trust**: Only one device per user can stay logged in
- **Puzzle-Gated Access**: Solve chess puzzles to unlock chat sessions
- **Ephemeral Sessions**: Chats and keys self-destruct after timer or logout
- **Metadata Minimization**: No IP tracking, minimal timestamps, privacy-first

## Tech Stack

- **Framework**: Next.js 15 (App Router, Strict TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Puzzle Engine**: chess.js for move verification
- **UI**: Tailwind CSS + shadcn/ui components

## Setup

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database instance

### Environment Configuration

Create a `.env` file in the project root:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/ciphertalk?schema=public"
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed curated chess puzzles
npm run prisma:seed
```

### Development

```bash
# Start development server
npm run dev

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
clue-less/
├── app/
│   ├── (auth)/login/          # WebAuthn authentication
│   ├── (gate)/gate/           # Chess puzzle gate
│   ├── (chat)/chat/           # Encrypted chat interface
│   └── api/
│       ├── auth/webauthn/     # Auth endpoints
│       ├── puzzle/            # Puzzle creation/verification
│       └── messages/          # Message send/list
├── lib/
│   ├── domain/                # Type definitions
│   ├── api/                   # API client utilities
│   ├── crypto/                # Unlock tokens, E2EE logic
│   ├── puzzle/                # Chess.js verification
│   └── storage/
│       ├── adapters/prisma/   # Prisma store implementations
│       └── *.ts               # Storage interfaces
└── prisma/
    ├── schema.prisma          # Database schema
    └── seed.ts                # Puzzle seed data
```

## Security Architecture

- **Server stores only ciphertext**: No plaintext message access
- **Device-bound sessions**: Hardware-backed attestation
- **Forward secrecy**: Per-message ephemeral keys
- **Single-use unlock tokens**: 15-minute TTL, device-bound
- **Puzzle verification**: Chess.js validates move sequences server-side

## Database Schema

Key models:
- `User`: Unique handle, single device binding
- `UserDevice`: WebAuthn credential, one per user
- `Session`: Short-lived (1 hour TTL)
- `UnlockToken`: 15-minute puzzle unlock gate
- `Message`: Ciphertext-only storage with E2EE headers
- `Puzzle`: Curated chess problems (FEN + target)

## API Routes

### Auth
- `POST /api/auth/webauthn/start` — Initiate WebAuthn challenge
- `POST /api/auth/webauthn/finish` — Complete auth, enforce single-device

### Puzzle Gate
- `POST /api/puzzle/create` — Fetch random puzzle by difficulty
- `POST /api/puzzle/verify` — Verify moves, mint unlock token

### Messaging
- `POST /api/messages/send` — Store ciphertext envelope
- `POST /api/messages/list` — Retrieve ciphertext by thread

## Roadmap

- [ ] Full WebAuthn implementation (currently placeholder)
- [ ] Double Ratchet encryption client-side
- [ ] Ephemeral message burn-on-read
- [ ] Voice notes and file encryption
- [ ] Adaptive puzzle difficulty based on trust score
- [ ] Screenshot watermarking
- [ ] Native mobile apps (FLAG_SECURE)

## License

MIT
