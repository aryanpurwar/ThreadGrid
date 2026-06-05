# ThreadGrid

ThreadGrid is a full-stack MERN e-commerce app for premium sneakers and aesthetic clothing for Indian customers. It uses a MongoDB product catalog for changing limited-edition drops, Express APIs, React + Redux frontend state, INR pricing, and Stripe Checkout for secure payments.

## Tech Stack

- MongoDB + Mongoose
- Express.js + Node.js
- React + Vite
- Redux Toolkit
- Stripe Checkout
- JWT authentication

## Project Structure

```text
threadgrid/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── app/
│   │   ├── App.jsx
│   │   └── main.jsx
└── README.md
```

## Getting Started

Install dependencies:

```bash
npm install
npm run install:all
```

Create backend environment:

```bash
cp backend/.env.example backend/.env
```

Update `backend/.env` with your MongoDB URI, JWT secret and Stripe test keys.

For admin registration, set a private invite code in `backend/.env`:

```env
ADMIN_INVITE_CODE=your_secure_invite_code
```

Do not commit real secrets or invite codes to GitHub.

Create frontend environment:

```bash
cp frontend/.env.example frontend/.env
```

Seed the product catalog:

```bash
npm run seed --prefix backend
```

Run the full app:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend API: `http://localhost:5000/api`

## Stripe Setup

1. Add `STRIPE_SECRET_KEY` to `backend/.env`.
2. In local development, forward webhooks with the Stripe CLI:

```bash
stripe listen --forward-to localhost:5000/api/orders/webhook
```

3. Copy the generated webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

Checkout sessions are created on the backend so the Stripe secret key never reaches the browser.

## Key Features

- Home page with premium editorial visuals.
- Two category routes: sneakers and clothes.
- Product detail pages with size selection, gallery, quantity controls and stock-aware cart.
- Persistent cart with INR subtotal, Indian shipping threshold, GST estimate and Stripe checkout.
- JWT customer/admin registration/login.
- Role selection before account access.
- Admin dashboard for product creation, pricing, stock and product status updates.
- MongoDB schemas for users, products and orders.
- Webhook-based payment confirmation and inventory reduction.
- Admin-protected product creation and update endpoints.

## API Routes

### Users

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/profile`

### Products

- `GET /api/products`
- `GET /api/products?category=sneakers`
- `GET /api/products?category=clothes`
- `GET /api/products/slug/:slug`
- `POST /api/products` admin only
- `PUT /api/products/:id` admin only

### Orders

- `POST /api/orders/checkout`
- `GET /api/orders/my-orders`
- `POST /api/orders/webhook`

## Security Notes

- Passwords are hashed with bcrypt.
- JWT protects account and admin routes.
- Helmet sets secure HTTP headers.
- Stripe Checkout handles card data directly.
- Webhook signature verification protects payment confirmation.
- MongoDB indexes support fast catalog updates and limited-drop filtering.
