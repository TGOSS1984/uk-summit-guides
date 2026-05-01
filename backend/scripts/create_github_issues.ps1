$repo = "TGOSS1984/uk-summit-guides"

$issues = @(
  @{
    title="Build responsive homepage with seasonal mountain theme"
    labels="frontend,ux,complete"
    body="Create the main landing page with premium UK mountain tour styling, responsive layout, winter/summer visual direction, and clear navigation into routes and booking."
  },
  @{
    title="Create routes listing page with API data"
    labels="frontend,backend,feature,complete"
    body="Display route data from the Django REST API with cards, route metadata, region, difficulty, distance, duration, and active route filtering."
  },
  @{
    title="Add route filtering by region, difficulty and search"
    labels="frontend,backend,ux,complete"
    body="Allow users to filter routes using region, difficulty, and route name search. Ensure frontend query params map cleanly to Django API filters."
  },
  @{
    title="Create route detail page with booking entry point"
    labels="frontend,feature,ux,complete"
    body="Build a detailed route page showing route summary, region, difficulty, metrics, guide information, available departures, and call-to-action into booking."
  },
  @{
    title="Add GPX/Leaflet route map support"
    labels="frontend,feature,ux,complete"
    body="Render route maps using Leaflet and GPX data, including route overlays, start/end markers, and responsive map layout."
  },
  @{
    title="Create Django route and region models"
    labels="backend,feature,complete"
    body="Model UK mountain regions and routes with route metadata such as distance, duration, elevation, difficulty, images, GPX path, and active status."
  },
  @{
    title="Create scheduled tours model and availability data"
    labels="backend,feature,complete"
    body="Create scheduled departures for routes with date, season, guide, price per person, max group size, status, booked spaces, and spaces remaining."
  },
  @{
    title="Seed production route and scheduled tour data"
    labels="backend,deployment,complete"
    body="Create and load production fixtures for regions, guides, routes, and scheduled tours so deployed API returns live data on Render."
  },
  @{
    title="Create user registration and login flow"
    labels="backend,frontend,feature,complete"
    body="Implement account creation, login, logout, current user lookup, and frontend account state handling."
  },
  @{
    title="Add token/session authenticated booking flow"
    labels="backend,frontend,feature,complete"
    body="Require authenticated customers to create bookings and ensure account page only shows bookings belonging to the signed-in user."
  },
  @{
    title="Create booking form with live departure selection"
    labels="frontend,feature,ux,complete"
    body="Build booking form where users select route, departure, party size, contact details, emergency contact, and notes."
  },
  @{
    title="Create backend booking API"
    labels="backend,feature,complete"
    body="Create booking API endpoints for create, list my bookings, amend, cancel, and archive."
  },
  @{
    title="Add booking capacity validation"
    labels="backend,feature,testing,complete"
    body="Prevent booking party sizes that exceed spaces remaining for a scheduled tour."
  },
  @{
    title="Add amend booking flow"
    labels="frontend,backend,feature,complete"
    body="Allow customers to amend eligible booking contact details, notes, emergency contact, and party size where permitted."
  },
  @{
    title="Add cancel booking flow"
    labels="frontend,backend,feature,complete"
    body="Allow customers to cancel eligible bookings and update account status accordingly."
  },
  @{
    title="Add archive cancelled bookings flow"
    labels="frontend,backend,ux,complete"
    body="Allow cancelled or refunded bookings to be hidden from the main account booking list using an archived timestamp."
  },
  @{
    title="Integrate Stripe Checkout"
    labels="payments,backend,frontend,feature,complete"
    body="Create Stripe Checkout sessions for unpaid bookings and redirect customers to Stripe-hosted payment."
  },
  @{
    title="Configure deployed Stripe webhook endpoint"
    labels="payments,deployment,complete"
    body="Create Stripe Dashboard webhook destination for the deployed Render API and use the Dashboard whsec secret, not the local Stripe CLI secret."
  },
  @{
    title="Handle Stripe checkout.session.completed webhook"
    labels="payments,backend,complete"
    body="Update Payment to paid and Booking to confirmed after successful Stripe Checkout completion using webhook-driven state changes."
  },
  @{
    title="Add payment success page"
    labels="frontend,payments,ux,complete"
    body="Create polished success redirect page showing booking reference, route, region, departure, amount paid, payment status, and next steps."
  },
  @{
    title="Add payment cancelled page"
    labels="frontend,payments,ux,complete"
    body="Create safe cancellation redirect page explaining that payment was not completed and customer can return to account to retry."
  },
  @{
    title="Prevent duplicate pay-now action after paid status"
    labels="frontend,backend,payments,complete"
    body="Ensure paid bookings do not show Pay Now in account and backend prevents creating checkout sessions for already paid bookings."
  },
  @{
    title="Add refund and refund status handling"
    labels="payments,backend,feature,complete"
    body="Handle refund pending and refunded states, including Stripe refund IDs and refund webhook updates."
  },
  @{
    title="Send payment confirmation email to customer"
    labels="email,payments,backend,complete"
    body="Send customer email after successful payment confirmation with route, date, time, amount, status, and booking reference."
  },
  @{
    title="Send payment notification email to admin"
    labels="email,backend,complete"
    body="Send internal admin notification email when a booking payment is completed."
  },
  @{
    title="Configure SendGrid sender and deployed email settings"
    labels="email,deployment,complete"
    body="Configure production email environment variables and verified sender so deployed Render backend can send transactional emails."
  },
  @{
    title="Create contact form API and email notification"
    labels="backend,frontend,email,feature,complete"
    body="Allow users to send contact messages, save them in Django, and trigger admin/customer email handling."
  },
  @{
    title="Add premium booking status timeline"
    labels="frontend,ux,complete"
    body="Add visual booking progress timeline to account booking cards using booking status and payment status."
  },
  @{
    title="Improve Django admin booking operations"
    labels="backend,feature,complete"
    body="Improve Booking admin with route, date, payment status, filters, search, status badges, and list optimisation."
  },
  @{
    title="Improve Django admin payment operations"
    labels="backend,payments,complete"
    body="Improve Payment admin with booking reference, customer, status badges, Stripe IDs, filters, and search."
  },
  @{
    title="Add admin KPI summary cards"
    labels="backend,feature,complete"
    body="Add admin booking dashboard cards showing bookings in current view, paid revenue, and total booking value."
  },
  @{
    title="Add backend test suite for accounts routes contact bookings and payments"
    labels="testing,backend,complete"
    body="Create backend tests covering authentication, route APIs, contact API, booking flow, capacity validation, payment lifecycle, webhook handling, refunds, cancellation, and archive."
  },
  @{
    title="Achieve strong backend coverage"
    labels="testing,backend,complete"
    body="Reach 92 percent backend test coverage across production-critical Django logic."
  },
  @{
    title="Add frontend smoke and helper tests"
    labels="testing,frontend,complete"
    body="Add Vitest tests for frontend helpers and account/payment behaviour."
  },
  @{
    title="Add payment result page frontend tests"
    labels="testing,frontend,payments,complete"
    body="Test payment success page loading, missing session ID, failed checkout session lookup, and payment cancelled guidance."
  },
  @{
    title="Add GitHub Actions CI workflow"
    labels="testing,deployment,complete"
    body="Run backend tests, frontend tests, and frontend build automatically on pushes and pull requests."
  },
  @{
    title="Deploy Django backend to Render"
    labels="deployment,backend,complete"
    body="Deploy Django REST backend to Render with environment variables, migrations, static collection, fixtures, Stripe, email, and production API URL."
  },
  @{
    title="Deploy React frontend to Vercel"
    labels="deployment,frontend,complete"
    body="Deploy Vite React frontend to Vercel with production API environment variables and Stripe publishable key."
  },
  @{
    title="Update README with architecture testing deployment and coverage"
    labels="documentation,complete"
    body="Document overview, live links, tech stack, project structure, setup, Stripe webhook, testing, coverage, deployment, and future enhancements."
  },
  @{
    title="Add screenshots to README"
    labels="documentation,ux,planned"
    body="Add final screenshots for homepage, routes page, route detail map, booking flow, account page, payment success, and admin KPI dashboard."
  },
  @{
    title="Add project board and issue roadmap links to README"
    labels="documentation,planned"
    body="Add links to GitHub Project board and selected roadmap issues so portfolio reviewers can inspect planning and development workflow."
  },
  @{
    title="Create portfolio case study for UK Summit Guides"
    labels="documentation,planned"
    body="Write a concise portfolio case study covering problem, users, architecture, payment lifecycle, testing, deployment, and future improvements."
  },
  @{
    title="Add calendar-based booking UI"
    labels="frontend,ux,feature,planned"
    body="Replace basic departure selection with a more visual calendar/date-picker showing available dates and spaces remaining."
  },
  @{
    title="Add route elevation charts"
    labels="frontend,feature,planned"
    body="Use GPX elevation data to display route elevation profiles on route detail pages."
  },
  @{
    title="Add weather integration for route pages"
    labels="frontend,backend,feature,planned"
    body="Show mountain weather summary or forecast guidance on route detail pages using an external weather API."
  },
  @{
    title="Add advanced admin analytics dashboard"
    labels="backend,frontend,feature,planned"
    body="Create richer business analytics for bookings, revenue, cancellations, route popularity, and seasonal performance."
  },
  @{
    title="Increase frontend component test coverage"
    labels="testing,frontend,planned"
    body="Add Vitest and React Testing Library coverage for route filters, booking form, account booking cards, timeline, and error states."
  },
  @{
    title="Add stricter atomic overbooking protection"
    labels="backend,testing,planned"
    body="Use database transactions/select_for_update where suitable to reduce race-condition risk during simultaneous booking creation."
  }
)

foreach ($issue in $issues) {
  gh issue create `
    --repo $repo `
    --title $issue.title `
    --body $issue.body `
    --label $issue.labels
}