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
![Backend Coverage](https://img.shields.io/badge/backend%20coverage-92%25-brightgreen)
![Frontend Tests](https://img.shields.io/badge/frontend%20tests-smoke%20coverage-blue)

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

## 🧠 Architecture Overview

The application follows a **decoupled full-stack architecture**, with a React frontend communicating with a Django REST API.

### System Flow

```mermaid
flowchart LR
    User --> Frontend[React Frontend (Vercel)]
    Frontend --> API[Django REST API (Render)]
    API --> DB[(PostgreSQL Database)]

    API --> Stripe[Stripe Checkout]
    Stripe --> Webhook[Stripe Webhook Endpoint]
    Webhook --> API

    API --> Email[Email Service (SendGrid / Console)]

Key Architectural Decisions
API-first design
The frontend consumes all data via REST endpoints, allowing future expansion (mobile app, external integrations).
Webhook-driven payments
Payment success is handled via Stripe webhooks, ensuring reliability even if users close the browser.
Separation of concerns
bookings → booking lifecycle
payments → Stripe + payment state
routes_app → route data & discovery
accounts → authentication
Stateless frontend
All critical logic (validation, payments, booking rules) lives in the backend.
Environment-based configuration
Secure handling of Stripe keys, email settings, and deployment environments.


---

# 🔌 2. API Overview

Add this **after Testing or Deployment**:

```markdown
## 🔌 API Overview

The backend exposes a RESTful API used by the React frontend.

### Authentication

| Method | Endpoint | Description |
|------|--------|------------|
| POST | `/api/auth/register/` | Create account |
| POST | `/api/auth/login/` | Login |
| POST | `/api/auth/logout/` | Logout |
| GET | `/api/auth/me/` | Current user |

---

### Routes & Regions

| Method | Endpoint | Description |
|------|--------|------------|
| GET | `/api/routes/` | List routes (filterable) |
| GET | `/api/routes/<slug>/` | Route detail |
| GET | `/api/regions/` | List regions |
| GET | `/api/scheduled-tours/` | Available departures |

---

### Bookings

| Method | Endpoint | Description |
|------|--------|------------|
| POST | `/api/bookings/` | Create booking |
| GET | `/api/my-bookings/` | User bookings |
| PATCH | `/api/my-bookings/<id>/amend/` | Amend booking |
| PATCH | `/api/my-bookings/<id>/cancel/` | Cancel booking |
| PATCH | `/api/my-bookings/<id>/archive/` | Archive booking |

---

### Payments

| Method | Endpoint | Description |
|------|--------|------------|
| POST | `/api/payments/create-checkout-session/` | Create Stripe session |
| GET | `/api/payments/checkout-session/<id>/` | Get session status |
| POST | `/api/payments/webhook/` | Stripe webhook endpoint |

---

### Contact

| Method | Endpoint | Description |
|------|--------|------------|
| POST | `/api/contact/` | Submit contact form |

---

### API Design Notes

- All booking/payment endpoints are **authenticated**
- User data is **scoped to the logged-in user**
- Stripe integration is handled entirely server-side
- Validation ensures:
  - No overbooking
  - No duplicate payments
  - Correct booking state transitions

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

### Coverage Summary

Current coverage snapshot:

- Backend coverage: **92%**
- Frontend coverage: **smoke tests only**

Backend tests focus on:

Booking validation & lifecycle
Stripe payment & webhook handling
Refund logic
Authentication & security
Contact and route endpoints

Frontend tests currently cover lightweight smoke/helper behaviour. Full React component coverage is planned as a future enhancement.

Manual Testing
Register / login
Create booking
Pay via Stripe test mode
Confirm booking updates
Cancel booking → refund flow
Archive bookings
Email notifications received

---

## 🚀 Deployment
Current
Frontend: Vercel
Backend: Render
Database: PostgreSQL
Notes
Environment variables configured per service
Stripe webhook endpoint exposed publicly
CORS + CSRF configured for cross-origin requests

---

## 🧩 Challenges & Solutions

### 💳 Reliable Payment Handling

**Challenge:**  
Ensuring bookings are only marked as paid when Stripe confirms the payment, even if the user closes the browser.

**Solution:**  
Implemented a **webhook-driven payment system**:
- Stripe sends `checkout.session.completed`
- Backend validates event
- Payment marked as `PAID`
- Booking updated to `CONFIRMED`

---

### 🔁 Duplicate Webhook Events

**Challenge:**  
Stripe may send the same webhook event multiple times.

**Solution:**  
Implemented **idempotent handling**:
- If payment is already `PAID`, webhook does nothing
- Prevents duplicate state changes

---

### 🚫 Preventing Duplicate Payments

**Challenge:**  
Users could attempt to pay multiple times for the same booking.

**Solution:**  
Backend validation prevents:
- Creating a new checkout session if already paid
- Ensures single payment per booking

---

### 👥 Booking Capacity Control

**Challenge:**  
Avoid overbooking scheduled tours.

**Solution:**  
- Track `booked_spaces` dynamically
- Validate against `max_group_size`
- Reject bookings exceeding capacity

---

### 🔐 Secure API Access

**Challenge:**  
Ensure users can only access their own bookings.

**Solution:**  
- All booking queries scoped to `request.user`
- Unauthorized access returns `404` or `403`

---

### 📧 Email Reliability in Development vs Production

**Challenge:**  
Email sending behaves differently locally vs deployed.

**Solution:**  
- Console email backend for development
- SendGrid integration for production
- Environment-based configuration

---

### 🌐 Cross-Origin Deployment (Vercel + Render)

**Challenge:**  
Frontend and backend deployed on different domains.

**Solution:**  
- Configured **CORS + CSRF properly**
- Ensured cookies/authentication work across origins

---

## 📌 Future Enhancements

High Impact
Full frontend test coverage
GitHub Actions CI pipeline
Booking calendar UI
Admin analytics dashboard
Features
Weather API integration
Elevation charts for routes
Guide assignment automation
User profile enhancements
Performance
API caching (Redis)
Query optimisation
Pagination scaling

---

## 📬 Contact

* GitHub: https://github.com/yourusername
* LinkedIn: https://linkedin.com/in/your-profile

---

## 📈 Business Context & Value

This project is designed to simulate a **real-world guided tours business platform**, focusing on the key operational challenges such a business would face.

### 🎯 Problem Being Solved

A mountain guiding business needs to:

- Manage multiple routes across different regions
- Offer scheduled tours with limited capacity
- Prevent overbooking
- Handle secure online payments
- Track booking lifecycle (pending → confirmed → cancelled → refunded)
- Communicate clearly with customers via email
- Provide a smooth, modern booking experience

Traditional solutions (manual spreadsheets, email bookings, offline payments) introduce:

- Risk of overbooking
- Lack of real-time availability
- Poor customer experience
- Manual administrative overhead

---

### 💡 Solution Provided

UK Summit Guides delivers a **fully digital booking platform** that:

- Automates booking validation and capacity management
- Integrates secure Stripe payments
- Uses webhook-driven logic for reliable payment confirmation
- Provides a self-service user dashboard
- Sends automated transactional emails
- Offers an intuitive, mobile-friendly interface

---

### 📊 Key Value Areas

#### 🧾 Operational Efficiency

- Eliminates manual booking handling
- Reduces admin workload through automation
- Ensures consistent booking validation

---

#### 💳 Payment Reliability

- Webhook-driven payment system ensures **data integrity**
- Prevents duplicate or incomplete transactions
- Supports refunds and lifecycle tracking

---

#### 👤 Customer Experience

- Clear booking flow from discovery → payment → confirmation
- Account dashboard for managing bookings
- Immediate feedback and email confirmations

---

#### 📈 Scalability

The system is designed to scale with:

- Additional routes and regions
- Larger booking volumes
- Multiple guides and scheduling complexity
- Future integrations (weather APIs, analytics, etc.)

---

### 🧠 Engineering Perspective

This project demonstrates the ability to:

- Translate business requirements into technical systems
- Design reliable backend workflows
- Handle real-world edge cases (payments, concurrency, validation)
- Build a clean, modular architecture

It reflects a shift from **building features → building systems that solve problems**.

---

## 🎤 Talking Points

This project can be summarised as:

- A full-stack booking platform built with React and Django REST
- Designed to simulate a real commercial guided tours business
- Focused on reliable backend workflows and payment handling
- Uses Stripe webhooks for production-grade payment confirmation
- Includes booking lifecycle management, refunds, and email notifications
- Achieves high backend test coverage (~92%) focused on critical logic

Key strengths demonstrated:

- API design and backend architecture
- Payment system integration (Stripe)
- Handling real-world edge cases
- Building scalable, maintainable systems

---

## ⭐ Final Notes

This project demonstrates:

Full-stack architecture (React + Django)
Real-world booking & payment systems
Stripe webhook-driven workflows
Secure API design
High backend test coverage
Production-style deployment

It is designed as a portfolio-grade commercial application, combining:

Software engineering
Product thinking
Data handling
User experience design

---
