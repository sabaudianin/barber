# Barber Booking System

Production-ready full-stack appointment booking system for a barbershop.

The application allows customers to book appointments online and administrators to manage availability, breaks, and working hours.

This project demonstrates real-world full-stack architecture including frontend, backend API, database design, scheduling logic, and cloud deployment.

---

## Live Demo

**App:** https://barber-gamma-snowy.vercel.app/
**Admin:** `/admin` (Basic Auth protected)

---

## Features

### Customer

- choose barber
- choose service (duration-based)
- calendar with visual availability indicators
- real-time free time slots
- booking form with validation
- automatic conflict prevention

### Admin

- protected admin panel (Basic Auth)
- manage barber time-offs (breaks / vacations)
- availability updates instantly
- prevents bookings during blocked hours

---

## Tech Stack

### Frontend

- Next.js (App Router)
- React
- TypeScript
- TailwindCSS
- React Day Picker
- TanStack Query (server state management)
- React Hook Form + Zod (forms & validation)

### Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL

### Infrastructure

- Docker Compose (local development)
- Neon Postgres (serverless production database)
- Vercel (hosting & deployment)
- Prisma migrations + seed

## 🏗 Architecture

-Client (Next.js)

-API Routes

-Prisma ORM

-PostgreSQL (Neon
