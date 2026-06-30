# SmartShelfX — AI-Based Inventory Forecast & Auto-Restock Platform

> An enterprise-grade inventory management platform with AI-powered demand forecasting, automated restock alerts, purchase order management, batch tracking, and real-time analytics.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Roles & Permissions](#roles--permissions)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

---

## Overview

SmartShelfX is a full-stack inventory management SaaS application built with **React** (frontend) and **Spring Boot** (backend). It provides real-time inventory tracking, AI-driven demand forecasting, purchase order workflows, expiry monitoring, and business analytics — all wrapped in a clean enterprise UI.

---

## Features

### Authentication
- Role-based login (Admin / Manager / Vendor)
- User registration
- Forgot Password with email reset link (15-min token expiry)
- Password strength indicator on reset
- Google Sign-In support (configurable via env vars)
- Remember Me + Show/Hide password

### Product Management
- Add, edit, view, and delete products
- Auto-generated product IDs
- Auto-calculated sales price (20% margin)
- Issue stock (outflow) and Purchase stock (inflow)
- Reorder level alerts with color-coded status badges
- Stock status: In Stock / Low Stock / Critical

### SKU Management
- Add, update, delete SKUs
- Searchable, paginated SKU list

### Transaction Management
- Full transaction history (issues + purchases)
- Search and filter by type
- Auto-calculated transaction value
- Revenue, cost, profit margin summary cards

### Purchase Order Management
- Create POs with multiple line items
- Auto-fill unit cost from product catalogue
- Status workflow: Draft → Sent → Partially Received → Received → Cancelled
- Receive PO — auto-updates product stock
- PO number auto-generation

### Batch & Expiry Tracking
- Record product batches with manufacture and expiry dates
- Expiry monitoring: Expired / Expiring within 7 days / Within 30 days
- Color-coded expiry badges

### Analytics & Reporting
- **Sales Analysis** — product-wise revenue bar chart and rankings
- **Demand Forecast** — per-product trend, volatility, 7-day forecast
- **Inventory Valuation** — total stock value by product and supplier
- **ABC Analysis** — revenue-based A/B/C product classification

### Import & Export
- Export products and transactions to CSV
- Bulk import products via CSV upload
- Preview with row-level validation before committing

### Notifications
- Live bell icon with unread badge count
- Auto-alerts: Out of Stock, Critical Low Stock, Low Stock
- Mark as read / mark all read
- Auto-refresh every 30 seconds

### Global Search
- `Ctrl+K` shortcut or click search icon
- Searches products, transactions, purchase orders, and pages
- Live debounced results grouped by type

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, react-bootstrap-icons, Chart.js, Axios |
| Backend | Spring Boot 3.3, Spring Security, Spring Data JPA |
| Database | H2 (dev) / MySQL (production) |
| Mail | Spring Mail / Gmail SMTP |
| Build Tools | Maven Wrapper, npm |

---

## Project Structure

```
SmartShelfX-AI-Based-Inventory-Forecast-Auto-Restock/
├── Inventory-Front/               # React frontend
│   ├── src/
│   │   ├── Components/
│   │   │   ├── LoginComponent/    # Auth pages (Login, Register, ForgotPassword, ResetPassword)
│   │   │   ├── ProductComponent/  # Product, Transaction, Analysis pages
│   │   │   ├── SKUComponent/      # SKU pages
│   │   │   ├── PurchaseOrders/    # PO List, Form, Detail
│   │   │   ├── Batches/           # Batch List, Form
│   │   │   ├── Analytics/         # Valuation, ABC Analysis
│   │   │   ├── ImportExport/      # Import/Export page
│   │   │   └── UI/                # AppShell, Sidebar, GlobalSearch, NotificationPanel
│   │   └── Services/              # Axios API service files
│   └── package.json
│
├── Inventory-Management/          # Spring Boot backend
│   └── src/main/java/edu/infosys/inventoryApplication/
│       ├── bean/                  # JPA Entities
│       ├── controller/            # REST Controllers
│       ├── dao/                   # Repositories
│       ├── service/               # Business logic
│       └── config/                # Security config
│
└── README.md
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Java | 17+ |
| Node.js | 18+ |
| npm | 9+ |
| Git | Any |

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/SmartShelfX.git
cd SmartShelfX
```

---

### 2. Start the Backend

```bash
cd Inventory-Management
.\mvnw.cmd spring-boot:run
```

Backend runs on **http://localhost:9898**

> Uses H2 in-memory database by default. Data resets on restart.  
> To use MySQL, set the `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` environment variables.

---

### 3. Start the Frontend

```bash
cd Inventory-Front
npm install
npm start
```

Frontend runs on **http://localhost:3838**

---

### Default Login Credentials

After starting, register a new account at `/Register` or use any account you create.

| Role | Access |
|---|---|
| Admin | Full access — all features |
| Manager | Inventory, transactions, purchase orders |
| Vendor | Profile view only |

---

## Environment Variables

Set these before starting the backend for full functionality.

| Variable | Description | Default |
|---|---|---|
| `DB_URL` | JDBC database URL | `jdbc:h2:mem:inventoryDB` |
| `DB_USERNAME` | Database username | `sa` |
| `DB_PASSWORD` | Database password | *(empty)* |
| `MAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP port | `587` |
| `MAIL_USERNAME` | Email address for sending resets | *(empty — disables email)* |
| `MAIL_PASSWORD` | Email app password | *(empty)* |
| `FRONTEND_URL` | Frontend origin for CORS and reset links | `http://localhost:3838` |
| `GOOGLE_CLIENT_ID` | Google OAuth2 client ID | *(empty — disables Google Sign-In)* |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 client secret | *(empty)* |

### Setting environment variables (Windows PowerShell)

```powershell
$env:MAIL_USERNAME="your@gmail.com"
$env:MAIL_PASSWORD="your-app-password"
$env:DB_URL="jdbc:mysql://localhost:3306/smartshelfx"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="yourpassword"
.\mvnw.cmd spring-boot:run
```

### Gmail App Password Setup

1. Enable 2-Step Verification on your Google account
2. Go to **Google Account → Security → App passwords**
3. Generate a password for "Mail"
4. Use that 16-character password as `MAIL_PASSWORD`

---

## API Endpoints

All endpoints are prefixed with `/inventory/`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/product` | Get all products |
| POST | `/product` | Add product |
| GET | `/product/{id}` | Get product by ID |
| PUT | `/product` | Update product price |
| PUT | `/product/{qty}/{flag}` | Update stock |
| DELETE | `/product/{id}` | Delete product |
| GET | `/transaction` | Get all transactions |
| POST | `/transaction` | Save transaction |
| GET | `/analysis` | Product-wise sales |
| GET | `/analysis/{id}` | Demand by product |
| GET/POST | `/purchase-orders` | List / Create POs |
| POST | `/purchase-orders/{id}/receive` | Receive PO |
| GET | `/batches/expiry/summary` | Expiry summary |
| GET | `/analytics/valuation` | Inventory valuation |
| GET | `/analytics/abc` | ABC analysis |
| GET | `/export/products` | Export products CSV |
| POST | `/import/products/commit` | Import products CSV |
| GET | `/notifications` | Get notifications |
| PATCH | `/notifications/read-all` | Mark all read |
| GET | `/search?q=keyword` | Global search |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |
| GET | `/inventory/login/{user}/{pass}` | Validate login |
| POST | `/inventory/login` | Register user |

---

## Roles & Permissions

| Feature | Admin | Manager | Vendor |
|---|---|---|---|
| Dashboard with KPIs | ✅ | ✅ | ❌ |
| Product List | ✅ | ✅ | ❌ |
| Add / Delete Products | ✅ | ❌ | ❌ |
| Issue / Purchase Stock | ✅ | ✅ | ❌ |
| SKU Management | ✅ | View only | ❌ |
| Transactions | ✅ | ✅ | ❌ |
| Purchase Orders | ✅ | ✅ | ❌ |
| Batch & Expiry | ✅ | ✅ | ❌ |
| Sales Analysis | ✅ | ❌ | ❌ |
| Demand Forecast | ✅ | ❌ | ❌ |
| Inventory Valuation | ✅ | ✅ | ❌ |
| ABC Analysis | ✅ | ✅ | ❌ |
| Import / Export | ✅ | ✅ | ❌ |
| Profile | ✅ | ✅ | ✅ |

---

## Deployment

### Frontend — Vercel

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Root directory: `Inventory-Front`
4. Build command: `npm run build`
5. Output: `build`

### Backend — Railway

1. Import repo at [railway.app](https://railway.app)
2. Root directory: `Inventory-Management`
3. Add MySQL service → copy connection string to `DB_URL`
4. Set all environment variables in Railway dashboard

### After deploying — update API URLs

In `Inventory-Front/src/Services/`, update all service files to point to your Railway backend URL instead of `http://localhost:9898`.

---

## License

MIT License — free to use, modify, and distribute.

---

> Built with ❤️ using React + Spring Boot · SmartShelfX Enterprise v2.0
