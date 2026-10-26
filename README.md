# Tool Platform SaaS

A full-stack SaaS starter for a tool platform with:

- user login / registration
- JWT-based auth
- single-device binding (one machine, one code)
- bulk card / code generation
- admin dashboard with statistics
- CSV export support
- React frontend + Express backend

## Stack

- Frontend: React + Vite + TypeScript
- Backend: Express + TypeScript
- Database: SQLite + Prisma
- Auth: JWT + bcryptjs

## Quick start

### 1. Install dependencies

```bash
cd frontend && npm install
cd ../backend && npm install
```

### 2. Setup environment

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

### 3. Initialize Prisma

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run app

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Then open:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Default admin account

- Email: admin@admin.com
- Password: 123456

## Main features

- Register and login
- One-device binding per user
- Generate bulk activation codes
- View generated cards
- Export as CSV
- Admin dashboard with user/device/card statistics
- Role-based access control

## Notes

This is a starter project meant for further extension into a real SaaS product.
