#  RentNest Backend API

RentNest is a Rental Property Management REST API built with **Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL, and Stripe**. It allows landlords to list rental properties, tenants to request rentals and make online payments, and admins to manage the entire platform.

---

## 🌐 Live API

Live API Link: [RentNest Live API](https://restnestbackend-nine.vercel.app/)

---

##  Features

###  Authentication
- User Registration
- User Login
- JWT Authentication
- Role Based Authorization
- Profile Management

###  User Roles
- Admin
- Landlord
- Tenant

###  Property Management
- Create Property
- Update Property
- Delete Property
- Get Single Property
- Get All Properties
- Search
- Filter
- Sort
- Pagination

###  Category Management
- Create Category
- Update Category
- Delete Category
- Get Categories

###  Rental Request
- Create Rental Request
- Approve / Reject Rental Request
- Get Rental Requests
- Get Single Rental Request

###  Payment (Stripe)
- Stripe Checkout Session
- Stripe Webhook
- Payment History
- Get Single Payment

###  Review
- Create Review
- Update Review
- Delete Review
- Get Reviews

###  Admin
- Get All Users
- Ban / Unban User
- Get All Properties
- Get All Rental Requests

---

#  Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Stripe
- Zod
- Bcrypt
- Cookie Parser
- CORS

---

#  Project Structure

```
src
│
├── config
├── lib
├── middlewares
├── modules
│   ├── admin
│   ├── auth
│   ├── category
│   ├── payment
│   ├── property
│   ├── Rental_Request
│   ├── review
│   └── user
│
├── utils
├── app.ts
└── server.ts
```

---

#  Environment Variables

Create a `.env` file.

```env
PORT=5000

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=

BCRYPT_SALT_ROUNDS=

APP_URL=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRODUCT_PRICE_ID=
```

---

#  Installation

Clone the repository

```bash
git clone [https://github.com/sanjid-khan/rentnest-backend.git](https://github.com/sanjid-khan/rentnest-backend.git)
```

Go to project

```bash
cd rentnest-backend
```

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run Migration

```bash
npx prisma migrate dev
```

Start Development Server

```bash
npm run dev
```

---

#  Build

```bash
npm run build
```

---

#  Production

```bash
npm start
```

---

#  API Modules

| Module | Description |
|---------|-------------|
| Authentication | Login & Registration |
| User | Profile Management |
| Category | Property Categories |
| Property | CRUD Property |
| Rental Request | Rental Workflow |
| Payment | Stripe Integration |
| Review | Property Reviews |
| Admin | Dashboard APIs |

---

#  Authentication

Protected routes require:

```
Authorization: Bearer <Access Token>
```

---

#  Stripe Integration

Features

- Checkout Session
- Subscription Mode
- Webhook
- Payment History
- Payment Status Tracking

---

#  License

This project is developed for educational purposes.

---

#  Author

**Sanjid Khan**

GitHub:
GitHub Profile: https://github.com/sanjid-khan