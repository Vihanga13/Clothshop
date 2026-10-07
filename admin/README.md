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

### Web Mode
1. Start the admin web development server:
   ```bash
   npm run dev
   ```
2. Open [http://localhost:3002](http://localhost:3002) in your browser.

### Native Desktop App Mode (Electron Dev)
Launch as a native Windows desktop application window:
```bash
npm run desktop
```
*(Or from root: `npm run admin:desktop`)*

### Standalone Portable Windows .exe (No Terminals Required!)
Build into a real standalone `.exe` that opens with a double click:
```bash
npm run dist
```
*(Or from root: `npm run admin:build-exe`)*

The portable `.exe` will be generated in `admin/dist/Clothshop Admin 1.0.0.exe`. You can place it on your Desktop and run it like any native software!

## Features

- **Overview Dashboard**: Real-time sales revenue, order count, catalog count, low-stock alerts.
- **Orders Management**: Live order table, customer delivery addresses, status changes (Confirmed → Processing → Shipped → Delivered → Cancelled).
- **Products & Stock Controller**: Real-time inventory adjustments with inline `+` / `-` stock buttons, delete garments.
- **Add Product Form**: Create new clothing pieces with immediate database insertion.
