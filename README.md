# Market Lane

A full-stack E-Commerce application with a customer storefront, admin area, and REST API.

## Features

- Browse products, categories, and brands
- Register, sign in, and manage a profile
- Cart, checkout, orders, cancellations, and product ratings
- Admin dashboard for products, categories, brands, orders, and users
- Product and brand image uploads

## Built with

- Frontend: React, Vite, Tailwind CSS, React Query
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JSON Web Tokens (JWT)
- Deployment: Docker, Nginx, and Caddy

## Project structure

```text
backend/    Express API, database models, routes, and controllers
frontend/   React storefront and admin interface
compose.yaml  Production Docker services
```

## Run locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and add your MongoDB connection string and a secure JWT secret.

```bash
cp .env.example .env
```

```env
databaseUrl=mongodb_connection_url
JWT_SECRET_KEY=jwt_key
CORS_ORIGIN=http://localhost:5173
```

### 3. Start the app

```bash
npm run dev
```

The frontend is available at `http://localhost:5173` and the API runs at `http://localhost:3000`.

## Docker deployment

Set the same variables in a `.env` file, then start the services:

```bash
docker compose up --build -d
```

## API overview

All API routes begin with `/api`.

| Area                     | Base route                   |
| ------------------------ | ---------------------------- |
| Health check             | `/api/health`                |
| Users and authentication | `/api/users`                 |
| Products                 | `/api/products`              |
| Categories               | `/api/categories`            |
| Subcategories            | `/api/subcategories`         |
| Brands                   | `/api/brands`                |
| Orders                   | `/api/orders`                |
| Admin dashboard          | `/api/admin/dashboard/stats` |

Protected routes use a Bearer token in the `Authorization` header. Admin-only actions require an administrator account.
