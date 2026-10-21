# ZASAS — Haute Couture & Pret
### *Authentic Luxury Fashion E-Commerce Platform (MERN, Tailored for the Pakistani Market)*

[![Tests](https://img.shields.io/badge/tests-20%20passing-emerald.svg)](https://github.com)
[![Vite](https://img.shields.io/badge/client-React%2018%20%2B%20Vite%206-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/styling-Tailwind%20v4-38B2AC.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/backend-Express%204%20%2B%20Mongoose-000000.svg)](https://expressjs.com/)
[![Currency](https://img.shields.io/badge/currency-PKR%20(%E2%82%A8)-9A7955.svg)](#)

---

## 🌟 Overview

**ZASAS** is a full-stack, enterprise-grade luxury e-commerce web application inspired by high-end subcontinental fashion houses and editorial design principles. Built specifically for the Pakistani market, it addresses regional commerce nuances including **PKR currency formatting**, **Cash on Delivery (COD)** logistics with delivery verification workflows, **Pakistani online payment gateways (Safepay / 1Bill / Wallets)**, and provincial shipping rules.

---

## ✨ Key Features

### 💎 Storefront & Editorial Shopping Experience
- **Editorial Brand Storytelling:** High-fashion luxury aesthetic with bespoke typography, subtle animations, and curated campaign banners.
- **Dynamic Category & Catalog Browsing:** Filter across Pakistani market collections:
  - **Women's Pret & Couture:** Pure raw silk kalidars, luxury Swiss voile lawns, organza festive sets.
  - **Men's Eastern & Pret:** Handcrafted kurta shalwars, banarsi jamawar waistcoats, Egyptian Giza cottons, prince coats.
  - **Kids' Festive Atelier:** Miniature angrakha shararas for girls, royal kurta brocade waistcoat sets for boys.
  - **Horology & Luxury Watches:** 42mm sapphire ceramic chronographs for men, mother-of-pearl rose gold diamond watches for women.
  - **Artisanal Footwear & Shoes:** Charsadda Kaptaan Peshawari chappals, Kasur velvet dabka khussas, hand-braided Kolhapuris.
  - **Haute Parfumerie & Oud:** Aged Royal Cambodi Oud, Taif Rose & Ambergris, Mysore Sandalwood unisex extraits.
- **Product Detail Experience:**
  - High-resolution multi-angle image gallery with fluid transitions.
  - Variant matrix (dynamic stock and pricing per size & colorway).
  - Luxury specifications: artisanal details, fabric & care instructions, and sizing charts.
  - Related recommendations and curated pairings.
- **Cart & Wishlist Architecture:**
  - Slide-out Cart Drawer with real-time stock sync and guest-to-patron cart persistence.
  - Dedicated Shopping Bag page with promo code / coupon engine.
  - Private Patron Wishlist with one-click transfer to shopping bag.
- **Localized Pakistani Checkout:**
  - Cash on Delivery (COD) across Karachi, Lahore, Islamabad, and nationwide destinations.
  - Nationwide shipping fee calculation with complimentary delivery over Rs. 10,000 threshold.
  - Delivery verification protocols and courier handling.
- **Complete Patron Dashboard & Account Portal (`/account`):**
  - **Executive Patron Dashboard:** Gold Patron status badge, active dispatch alert with live parcel tracking, total order count, and wishlist tally.
  - **Recent Orders Dossier:** Instant inspection of recent acquisitions with status history and tracking notes.
  - **Address Book Manager:** Manage multiple nationwide delivery addresses with instant default toggle.
  - **Order Archive & Detail:** Full audit trail for past dispatches, cancel option for pending orders, and invoice breakdown.
  - **VIP Concierge Integration:** One-click WhatsApp concierge chat (`+92 300 8272727`) and appointment booking.
- **Brand Pages & Legal Framework:**
  - Atelier Legacy & Origin Story (`/about`).
  - Flagship Concierge, Direct WhatsApp VIP hotline, and appointment inquiries (`/contact`).
  - Shipping & COD Policy (`/shipping-policy`).
  - 7-Day Exchange & Returns Policy (`/returns-policy`).
  - Privacy Policy (`/privacy-policy`) & Terms of Service (`/terms`).
  - Custom Luxury 404 Experience (`/404`).

---

### 🏛️ Atelier Administration Suite (`/admin`)
- **Executive Dashboard:** Live metrics for gross revenue (PKR), active orders by status, product count, and registered patrons.
- **Catalog Management:** Complete CRUD for products with multi-image URLs, SKU management, size/color variant stock matrix, and merchandising flags.
- **Category Taxonomy:** Category creation, image banners, taglines, order priorities, and featured flags.
- **Fulfillment & Logistics Hub:** Filter orders by status (*Pending, Confirmed, Processing, Dispatched, Delivered, Cancelled*), quick status updating, audit history notes, and printable packing slips.
- **Promotions & Coupon Engine:** Create percentage or fixed-amount vouchers with minimum order amounts, discount caps, usage limits, and expiration dates.
- **Customer Registry:** Complete directory of registered patrons and address records.
- **System Settings:** Operational inspection of shipping thresholds and Pakistani gateway configuration.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS v4, Redux Toolkit, React Router v7, React Hook Form, Zod, Lucide React, Motion |
| **Backend** | Node.js (ES Modules), Express.js, MongoDB, Mongoose |
| **Authentication** | JWT (HttpOnly Secure Cookies), BcryptJS, Role-Based Access Control (`customer` / `admin`) |
| **Payments** | Cash on Delivery (COD) Native + Pakistani Gateway Adapter (Safepay, 1Bill, JazzCash, EasyPaisa) |
| **Testing** | Vitest, Testing Library (React & DOM), Supertest |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ or v20+
- **MongoDB** running locally on port 27017 or a MongoDB Atlas URI

### 2. Installation
Install dependencies across root, server, and client:
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 3. Seed Database
Populate MongoDB with categories, products with stock variants, promotional coupons, an administrator account, and a sample customer account:
```bash
npm run seed
```

#### Default Credentials:
| Account Role | Email | Password |
|---|---|---|
| **Atelier Administrator** | `admin@zasas.com` | `Admin@Zasas2026` |
| **Patron / Customer** | `customer@zasas.com` | `Customer@123` |

### 4. Run Development Servers
Start both the Express backend API (Port 5000) and the Vite frontend (Port 5173) concurrently:
```bash
npm run dev
```

Open your browser at:
- **Storefront:** [http://localhost:5173](http://localhost:5173)
- **Admin Hub:** [http://localhost:5173/admin](http://localhost:5173/admin)
- **Backend API:** [http://localhost:5000/api/v1](http://localhost:5000/api/v1)

### 5. Running Tests
Run the comprehensive test suite (Unit & Integration tests for client and server):
```bash
npm test
```

Or run individual suites:
```bash
npm run test:server   # Server API tests (13 tests)
npm run test:client   # Client Vitest tests (7 tests)
```

### 6. Production Build
Compile client assets for production:
```bash
npm run client:build
```

---

## 📦 Directory Structure

```
zasas-portfolio/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Cart drawer, Navbar, Footer, ProductCards, Modals
│   │   ├── layouts/            # RootLayout, AccountLayout, AdminLayout
│   │   ├── pages/              # Home, Shop, ProductDetail, CartPage, Checkout, etc.
│   │   │   ├── account/        # Profile, Orders, OrderDetail, Addresses
│   │   │   ├── admin/          # Dashboard, Products, ProductForm, Categories, Orders, Coupons, Settings
│   │   │   ├── auth/           # Login, Register, ForgotPassword, ResetPassword
│   │   │   └── policies/       # Shipping, Returns, Privacy, Terms
│   │   ├── services/           # Axios API client with guest session interceptor
│   │   ├── store/              # Redux slices (auth, cart, ui)
│   │   ├── test/               # Vitest suite
│   │   └── utils/              # Currency formatting (PKR), regional constants
│   └── package.json
├── server/                     # Express.js REST API
│   ├── src/
│   │   ├── config/             # MongoDB connection and environment configuration
│   │   ├── controllers/        # Auth, Products, Categories, Cart, Orders, Admin, Coupons
│   │   ├── middleware/         # Auth, Admin RBAC, Rate limiter, Error handler, Validation
│   │   ├── models/             # User, Product, Category, Order, Cart, Coupon, PaymentAttempt
│   │   ├── routes/             # REST endpoints
│   │   ├── services/           # Inventory stock reservation & Pakistani Payment Adapter
│   │   ├── validators/         # Zod request validators
│   │   └── seed.js             # High-fashion catalog seeder
│   ├── test/                   # API test suite (Supertest + Vitest)
│   └── package.json
├── package.json                # Root concurrent scripts
└── README.md
```

---

## 🇵🇰 Pakistani Market Specifications

- **Currency Standard:** All pricing is recorded and displayed in Pakistani Rupees (PKR / ₨).
- **Courier Logistics Integration:** Pre-configured for TCS, Leopards Courier, Trax, and Call Courier dispatches with tracking number audit trails.
- **Provincial Coverage:** Comprehensive coverage across Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Islamabad Capital Territory, Gilgit-Baltistan, and Azad Jammu and Kashmir.
- **National Verification:** Built-in safeguards and WhatsApp VIP concierge support for phone number verification on Cash on Delivery orders.

---

© 2026 ZASAS Haute Couture & Pret (Private) Limited. All rights reserved.
