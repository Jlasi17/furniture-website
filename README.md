# JP Homes — Furniture E-Commerce Website

A full-stack, premium furniture e-commerce platform built with **Next.js**, **Node.js/Express**, and **MongoDB**.

---

## 🌐 Live Features

### 👥 Customer Experience
- **Browse & Shop** — Explore furniture across categories (Living Room, Bedroom, Dining, etc.)
- **Product Detail** — View images, dimensions, material, color, and stock status
- **Shopping Cart** — Add items, adjust quantities, remove products; cart persists across sessions (localStorage)
- **Authentication** — Register and log in as a customer; JWT-based auth

### 🔐 Admin Dashboard
- **Completely separate UI** — No customer navbar/footer; only the admin sidebar
- **Product Management** — Add new products (with image upload), view all, delete
- **Dashboard Stats** — Total products, out-of-stock count, recent activity
- Protected routes — only users with `isAdmin: true` can access `/admin/*`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS v3, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Image Upload | Multer (local storage → `/backend/uploads/`) |
| State Management | React Context (AuthContext, CartContext) |
| Styling | Tailwind CSS v3 with custom Rosewood/JP Homes color theme |

---

## 📁 Project Structure

```
furniture-website/
├── backend/
│   ├── controllers/        # authController, productController
│   ├── middleware/         # authMiddleware, uploadMiddleware
│   ├── models/             # User.js, Product.js (Mongoose schemas)
│   ├── routes/             # authRoutes.js, productRoutes.js
│   ├── uploads/            # Uploaded product images (gitignored)
│   ├── data/               # Seed data (users, products)
│   ├── seeder.js           # DB seeder script
│   └── server.js           # Express app entry point
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # Home page (hero, categories, featured)
│   │   ├── shop/page.tsx       # Shop page with search & filters
│   │   ├── product/[id]/       # Product detail with Add to Cart
│   │   ├── cart/page.tsx       # Cart page with order summary
│   │   ├── login/page.tsx      # Login page
│   │   ├── register/page.tsx   # Register page
│   │   └── admin/
│   │       ├── layout.tsx          # Admin layout (sidebar only)
│   │       ├── dashboard/page.tsx  # Stats overview
│   │       └── products/
│   │           ├── page.tsx        # Product list + delete
│   │           └── new/page.tsx    # Add new product + image upload
│   ├── components/
│   │   ├── Navbar.tsx          # Customer navbar with live cart badge
│   │   ├── Footer.tsx          # Customer footer
│   │   ├── ProductCard.tsx     # Product card with quick Add to Cart
│   │   ├── AdminSidebar.tsx    # Admin sidebar navigation
│   │   └── ConditionalLayout.tsx  # Renders Navbar/Footer only for customer routes
│   ├── context/
│   │   ├── AuthContext.tsx     # Global auth state
│   │   └── CartContext.tsx     # Global cart state with localStorage
│   └── lib/
│       ├── api.ts              # Axios instance with JWT interceptor
│       └── utils.ts            # cn() utility (clsx + tailwind-merge)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- MongoDB running locally (`mongodb://localhost:27017`)

### 1. Clone the Repository
```bash
git clone https://github.com/Jlasi17/furniture-website.git
cd furniture-website
```

### 2. Backend Setup
```bash
cd backend
npm install
# Seed the database with admin user + sample products
node seeder.js
# Start dev server
npm run dev
```
Backend runs on **http://localhost:8000**

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:3000**

---

## 🔑 Default Credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@rosewood.com` | `password123` |
| **Customer** | `john@example.com` | `password123` |

Admin → redirected to `/admin/dashboard`  
Customer → redirected to `/` (home)

---

## 🎨 Design

- Color theme: **Deep Rosewood** (`#3B1F14`) + **Gold Accent** (`#B5913A`)
- Typography: **Playfair Display** (serif, headings) + **Inter** (body)
- Responsive design: mobile-first with animated mobile menu
- Micro-animations via Framer Motion

---

## 📜 Environment Variables

Create a `.env` file in the project root (or `backend/` depending on your setup):

```env
MONGODB_URI=mongodb://localhost:27017/furniture_store
JWT_SECRET=your_jwt_secret_here
PORT=8000
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📌 Notes

- Cart data is stored in `localStorage` — no backend required for cart state
- Product images are stored locally in `backend/uploads/` (not committed to git)
- Admin routes are fully protected: unauthenticated or non-admin users are redirected to `/login`