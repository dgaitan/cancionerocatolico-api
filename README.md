# cc-api

REST API for Cancionero Católico. Built with Express 5, TypeScript, Prisma, and PostgreSQL.

---

## Requirements

| Tool | Version | Notes |
|------|---------|-------|
| [Node.js](https://nodejs.org) | 20+ | Use [nvm](https://github.com/nvm-sh/nvm): `nvm use 20` |
| [Bun](https://bun.sh) | 1.0+ | Package manager and script runner |
| [PostgreSQL](https://www.postgresql.org) | 14+ | Local instance required for development |

The API connects to an existing PostgreSQL database (`cc`). Authentication uses email magic links → JWT. No email service is required in development — configure an SMTP server or use [Mailhog](https://github.com/mailhog/MailHog) locally.

---

## Installation

**1. Clone and navigate to the project**

```bash
cd cc-api
```

**2. Switch to the correct Node.js version**

```bash
nvm use 20
```

**3. Install dependencies**

```bash
bun install
```

**4. Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` and set at minimum:

```dotenv
# PostgreSQL — adjust user and socket path to match your local setup
DATABASE_URL=postgresql://YOUR_OS_USER@localhost/cc?host=/tmp

# Generate strong secrets (e.g. openssl rand -hex 32)
JWT_SECRET=replace_with_64_char_random_hex
MAGIC_TOKEN_SECRET=replace_with_64_char_random_hex

# SMTP — use Mailhog defaults for local development
SMTP_HOST=localhost
SMTP_PORT=1025
```

> **Tip:** Run `psql cc -c '\conninfo'` to find your OS username and socket directory if the default connection fails.

**5. Apply the baseline migration and generate the Prisma client**

```bash
bun run db:migrate:prod   # applies all pending migrations
bun run db:generate       # generates the typed Prisma client
```

**6. Start the development server**

```bash
bun run dev
```

The API will be available at `http://localhost:3000`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start with hot reload |
| `bun run build` | Compile TypeScript to `dist/` |
| `bun run start` | Run compiled output |
| `bun run type-check` | TypeScript check without emitting |
| `bun run test` | Run all tests |
| `bun run test:coverage` | Run tests with coverage report |
| `bun run ci` | Type-check + coverage (used in CI) |
| `bun run db:migrate` | Create and apply a new migration (dev) |
| `bun run db:migrate:prod` | Apply pending migrations (production) |
| `bun run db:migrate:status` | Show migration status |
| `bun run db:generate` | Regenerate the Prisma client |
| `bun run db:studio` | Open Prisma Studio (visual DB browser) |

---

## Adding Migrations

Migrations track schema changes over time. The existing database was baselined in `prisma/migrations/0_init/`.

### Making a schema change

**1. Edit `prisma/schema.prisma`** — add a model, field, index, or relation.

Example — adding a `tags` table:

```prisma
model tags {
  id         BigInt   @id @default(autoincrement())
  name       String   @unique @db.VarChar(100)
  created_at DateTime @default(now()) @db.Timestamp(0)
}
```

**2. Create and apply the migration**

```bash
bun run db:migrate
```

Prisma will prompt for a name (use snake_case, e.g. `add_tags_table`). It generates a `.sql` file under `prisma/migrations/` and applies it to your dev database immediately.

**3. Regenerate the Prisma client**

The client is regenerated automatically after `migrate dev`. If you need to do it manually:

```bash
bun run db:generate
```

**4. Commit both files**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add tags table"
```

### Deploying migrations

In CI/CD or on a production server, run:

```bash
bun run db:migrate:prod
```

This applies all pending migrations without prompting. It is safe to run multiple times — already-applied migrations are skipped.

### Checking status

```bash
bun run db:migrate:status
```

Shows which migrations have been applied and which are pending.

---

## Authentication

The API uses email magic links. The flow:

1. `POST /auth/request-link` — send `{ "email": "user@example.com" }`. If the account exists, a magic link is sent to that email.
2. Click the link: `GET /auth/verify?email=user@example.com&token=abc123`
3. On success, the response includes a JWT. Pass it as `Authorization: Bearer <token>` on all protected routes.

---

## Project Structure

```
cc-api/
├── prisma/
│   ├── schema.prisma          # Single source of truth for the DB schema
│   └── migrations/            # Migration history — commit these
├── src/
│   ├── app.ts                 # Express app factory
│   ├── server.ts              # Entry point
│   ├── config/                # Typed env config + Prisma singleton
│   ├── lib/                   # JWT, mailer, logger, response helpers
│   ├── middleware/             # Auth, validation, error handler
│   ├── modules/
│   │   ├── auth/              # Magic link flow
│   │   └── songs/             # Songs endpoints
│   ├── types/                 # Shared TypeScript types
│   └── utils/                 # asyncHandler, pagination
└── tests/
    └── helpers/               # Test app factory, Prisma test client
```
