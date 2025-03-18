# @db Package

## Overview

The `@db` package provides database access and management for the Arbitrum Connect application. It uses Prisma ORM to interact with a PostgreSQL database, handling data models for users, transactions, chains, and user favorites.

## Features

- **Prisma ORM Integration**: Type-safe database queries with Prisma Client
- **PostgreSQL Database**: Robust relational database backend
- **Data Models**:
  - Users: Store user information and relationships
  - Transactions: Track bridge transactions between chains
  - Chains: Manage blockchain network configurations
  - User Favorites: Track user-favorite chains
- **Database Seeding**: Pre-populate the database with default chain configurations

## Models

### User

Represents application users with their Ethereum addresses and related data.

### Transaction

Tracks bridge transactions between chains, including status and amounts.

### Chain

Stores blockchain network configurations with:

- Basic information (name, chainId, type)
- JSON-structured data (nativeCurrency, rpcUrls, blockExplorers)
- Bridge configuration (ethBridge)
- Optional user association for custom chains

### UserFavoriteChain

Tracks which chains users have marked as favorites.

## Database Setup

1. Ensure PostgreSQL is installed and running
2. Set the `DATABASE_URL` environment variable to your PostgreSQL connection string
3. Run migrations to set up the database schema:
   ```
   pnpm prisma migrate dev
   ```

## Seeding Default Chains

The package includes a seeding mechanism to populate the database with default chain configurations:

- Arbitrum One (L2)
- Ethereum Mainnet (L1)
- Sepolia Testnet (L1)
- Arbitrum Sepolia (L2)

Run the seed command to populate these chains:

```
pnpm db:seed
```

## Database Studio

To access the database studio, run:

```
pnpm db:studio
```

This will open a browser window with the database studio interface.

## Database Migrations

To create a new migration, run:

```
npx prisma migrate dev
```

To apply migrations to the database, run:

```
npx prisma migrate deploy
```

To generate Prisma client, run:

```
npx prisma generate
```

To push the schema to the database, run:

```
npx prisma db push
```
