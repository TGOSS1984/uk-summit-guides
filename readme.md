# 🏔️ UK Summit Guides

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react\&logoColor=white)]()
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite\&logoColor=white)]()
[![Django](https://img.shields.io/badge/Backend-Django-092E20?logo=django\&logoColor=white)]()
[![Django REST](https://img.shields.io/badge/API-Django%20REST-ff1709?logo=django\&logoColor=white)]()
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-316192?logo=postgresql\&logoColor=white)]()
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe\&logoColor=white)]()
[![Leaflet](https://img.shields.io/badge/Maps-Leaflet-199900?logo=leaflet\&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JS-ES6-F7DF1E?logo=javascript\&logoColor=black)]()
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python\&logoColor=white)]()
[![CSS](https://img.shields.io/badge/Styling-CSS3-1572B6?logo=css3\&logoColor=white)]()

---

## 📚 Table of Contents

* [📸 Preview](#-preview)
* [🌐 Live Project](#-live-project)
* [📖 Overview](#-overview)
* [🚀 Key Features](#-key-features)
* [🏗️ Tech Stack](#️-tech-stack)
* [📂 Project Structure](#-project-structure)
* [⚙️ Setup & Installation](#️-setup--installation)
* [💳 Stripe Webhook](#-stripe-webhook-local-testing)
* [🧪 Testing](#-testing)
* [🚀 Deployment](#-deployment-planned)
* [📌 Future Enhancements](#-future-enhancements)
* [📬 Contact](#-contact)
* [⭐ Final Notes](#-final-notes)

---

## 📸 Preview

### 🏠 Homepage

![Homepage Placeholder](docs/images/homepage.png)

### 🗺️ Routes Page

![Routes Placeholder](docs/images/routes.png)

### 📍 Route Detail + GPX Map

![Route Detail Placeholder](docs/images/route-detail.png)

### 💳 Booking Flow

![Booking Placeholder](docs/images/booking.png)

---

## 🌐 Live Project

* 🔗 Frontend: **[https://uk-summit-guides.vercel.app](https://uk-summit-guides.vercel.app)**
* 🔗 Backend API: **[https://uk-summit-guides-api.onrender.com/api](https://uk-summit-guides-api.onrender.com/api)**

---

## 📖 Overview

**UK Summit Guides** is a full-stack booking platform for guided mountain tours across the UK.

It combines:

* Structured route discovery
* GPX-powered interactive maps
* Real-time booking availability
* Secure Stripe payments
* Account-based booking management

The project is designed to reflect a **production-ready commercial system**, with a strong focus on UX, scalability, and clean architecture.

---

## 🚀 Key Features

### 🗺️ Route Discovery

* Filter by **region**, **difficulty**, and **search**
* Pagination for scalable datasets
* Dynamic route cards powered by Django API

### 📍 Interactive GPX Maps

* Full route visualisation using **Leaflet**
* Zoomable map with route overlay
* Start/end markers from GPX files

### 👤 User Accounts

* Register / Login / Logout
* Authenticated booking management
* Personal booking dashboard

### 📅 Booking System

* Real-time availability checks
* Capacity-based validation
* Amend & cancel bookings
* Archive old bookings

### 💳 Payments (Stripe)

* Secure checkout session
* Webhook-driven payment confirmation
* Refund handling
* Payment status tracking

### 📧 Email System

* Booking confirmation emails
* Payment confirmation emails
* Cancellation + refund emails
* Contact form acknowledgement
* Admin notification emails

### 🎨 UI / UX

* Fully responsive design
* Dark theme with **winter/summer toggle**
* Modern glassmorphism styling
* Clean, premium layout

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* React Router
* Leaflet (maps + GPX)
* Custom CSS (design system)

### Backend

* Django
* Django REST Framework
* Django ORM
* Stripe API

### Data & Features

* GPX route files
* Booking + scheduling logic
* Payment lifecycle handling

---

## 📂 Project Structure

```bash
uk-summit-guides/
│
├── backend/
│   ├── accounts/
│   ├── bookings/
│   ├── contact/
│   ├── payments/
│   ├── routes_app/
│   ├── core/
│   ├── config/
│   └── manage.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   │   ├── images/
│   │   └── gpx/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Clone repo

```bash
git clone https://github.com/yourusername/uk-summit-guides.git
cd uk-summit-guides
```

---

### 2. Backend setup

```bash
cd backend

python -m venv .venv
.venv\Scripts\activate   # Windows

pip install -r requirements.txt
```

Create `.env` file:

```env
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=True

STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-public
STRIPE_WEBHOOK_SECRET=your-webhook-secret

FRONTEND_BASE_URL=http://localhost:5175

EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=hello@uksummitguides.com
CONTACT_NOTIFICATION_EMAIL=admin@example.com
```

Run migrations:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

---

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

---

## 💳 Stripe Webhook (Local Testing)

```bash
stripe listen --forward-to localhost:8000/api/payments/webhook/
```

Copy the webhook secret into your `.env`.

---

## 🧪 Testing

This project includes backend and frontend tests to demonstrate core application reliability across the main booking, payment, authentication, route, and contact workflows.

### Backend Tests

Backend tests are written with Django's built-in test runner and Django REST Framework's `APITestCase`.

Covered backend areas include:

- User registration, login, logout, and authenticated `/me/` endpoint
- Route list, route filtering, region data, and route detail endpoints
- Contact form validation and message creation
- Auth-protected booking creation
- Booking visibility scoped to the authenticated user
- Booking capacity validation
- Booking amendment rules
- Booking cancellation and archive rules
- Stripe checkout session creation
- Prevention of duplicate payment attempts
- Stripe webhook handling for successful payments
- Refund webhook handling for successful and failed refunds

Run backend tests:

```bash
cd backend
python manage.py test routes_app accounts contact bookings
```

Run backend coverage:

cd backend
coverage run manage.py test routes_app accounts contact bookings
coverage report
coverage html

The HTML coverage report is generated at:

backend/htmlcov/index.html
Frontend Tests

Frontend tests use Vitest with React Testing Library.

Covered frontend areas include:

Auth token storage helpers
Payment status formatting helpers

Run frontend tests:

cd frontend
npm run test:run

Run frontend coverage:

cd frontend
npm run test:coverage

The frontend coverage report is generated at:

frontend/coverage/index.html
Manual End-to-End Testing

The deployed production flow has also been manually tested:

Register or log in
Select a route and scheduled departure
Create a booking
Pay through Stripe Checkout in test mode
Return to the payment success page
Confirm booking status updates to paid
Cancel a paid booking
Confirm refund pending/refund state is reflected
Archive cancelled bookings from the account view
Confirm transactional email is received

Stripe test card used:

4242 4242 4242 4242
Any future expiry date
Any CVC
Any postcode

---

### 6. Run everything

From `backend/`:

```bash
coverage run manage.py test routes_app accounts contact bookings
coverage report

From frontend/:

npm run test:run
```

---

## 🚀 Deployment (Planned)

* Backend: Render / Railway / Heroku
* Frontend: Vercel / Netlify
* Database: PostgreSQL
* Static/media: Cloudinary / CDN

---

## 📌 Future Enhancements

* Email provider (SendGrid / AWS SES)
* Advanced booking calendar UI
* GPX elevation charts
* Weather integration
* Guide assignment automation
* Admin dashboard analytics
* Caching & performance optimisation

---

## 📬 Contact

* GitHub: https://github.com/yourusername
* LinkedIn: https://linkedin.com/in/your-profile

---

## ⭐ Final Notes

This project demonstrates:

* Full-stack architecture (React + Django)
* Real-world business logic (bookings, payments)
* API-driven frontend
* Secure payment integration
* Scalable and maintainable code structure

It is designed as a **portfolio-grade commercial application** combining development and product thinking.

---
