# Clothshop Standalone Admin Portal

A standalone Next.js operations portal for managing the Clothshop e-commerce store.

## Architecture

- **Customer Store**: Runs on `http://localhost:3001` (Next.js 14 + SQLite Prisma database)
- **Admin App**: Runs independently on `http://localhost:3002` (communicates with Core Shop API)

## Getting Started

1. Open a new terminal in the `admin` folder:
   ```bash
   cd admin
   npm install
   ```

2. Start the admin development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3002](http://localhost:3002) in your browser.

## Features

- **Overview Dashboard**: Real-time sales revenue, order count, catalog count, low-stock alerts.
- **Orders Management**: Live order table, customer delivery addresses, status changes (Confirmed → Processing → Shipped → Delivered → Cancelled).
- **Products & Stock Controller**: Real-time inventory adjustments with inline `+` / `-` stock buttons, delete garments.
- **Add Product Form**: Create new clothing pieces with immediate database insertion.
