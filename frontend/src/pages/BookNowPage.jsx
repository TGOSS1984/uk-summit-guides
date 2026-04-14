import { useEffect, useMemo, useState } from "react";
import {
  FaArrowRight,
  FaCalendarDays,
  FaCreditCard,
  FaEnvelope,
  FaLocationDot,
  FaShieldHeart,
  FaUserGroup,
} from "react-icons/fa6";
import Reveal from "../components/ui/Reveal";
import { getRoutes, getScheduledTours } from "../lib/api";

function BookNowPage() {
  const [routes, setRoutes] = useState([]);
  const [scheduledTours, setScheduledTours] = useState([]);
  const [selectedRouteSlug, setSelectedRouteSlug] = useState("");
  const [selectedTourId, setSelectedTourId] = useState("");
  const [partySize, setPartySize] = useState("1");
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [loadingTours, setLoadingTours] = useState(false);
  const [error, setError] = useState("");

  const notes = [
    {
      title: "Small group model",
      copy:
        "Bookings are being designed around a premium small-group experience, with a default maximum group size of 3.",
    },
    {
      title: "Availability protection",
      copy:
        "Later this page will connect to live scheduled tours, guide assignment, and protected availability rules.",
    },
    {
      title: "Payments and confirmation",
      copy:
        "Stripe checkout, booking confirmation emails, and account-linked booking management will be added in the backend phase.",
    },
  ];

  useEffect(() => {
    async function loadRoutes() {
      try {
        setLoadingRoutes(true);
        setError("");
        const routeData = await getRoutes();
        setRoutes(routeData);
      } catch (err) {
        setError("Unable to load routes right now.");
      } finally {
        setLoadingRoutes(false);
      }
    }

    loadRoutes();
  }, []);

  useEffect(() => {
    async function loadTours() {
      if (!selectedRouteSlug) {
        setScheduledTours([]);
        setSelectedTourId("");
        return;
      }

      try {
        setLoadingTours(true);
        setError("");
        const tourData = await getScheduledTours({ route: selectedRouteSlug });
        setScheduledTours(tourData);
        setSelectedTourId("");
      } catch (err) {
        setError("Unable to load scheduled tours right now.");
      } finally {
        setLoadingTours(false);
      }
    }

    loadTours();
  }, [selectedRouteSlug]);

  const selectedRoute = useMemo(() => {
    return routes.find((route) => route.slug === selectedRouteSlug) || null;
  }, [routes, selectedRouteSlug]);

  const selectedTour = useMemo(() => {
    return (
      scheduledTours.find((tour) => String(tour.id) === String(selectedTourId)) ||
      null
    );
  }, [scheduledTours, selectedTourId]);

  const estimatedTotal = useMemo(() => {
    if (!selectedTour) return null;
    return Number(selectedTour.price_pp) * Number(partySize);
  }, [selectedTour, partySize]);

  return (
    <>
      <section className="booking-hero">
        <div className="booking-hero__image" />
        <div className="booking-hero__overlay" />

        <div className="container booking-hero__content">
          <Reveal variant="up">
            <p className="section-kicker">Book Now</p>
            <h1 className="page-title booking-hero__title">
              Start your guided mountain booking
            </h1>
            <p className="booking-hero__copy">
              This page now pulls live route and departure data from Django. The
              next step after this is submitting real bookings with availability
              protection and payment flow.
            </p>
          </Reveal>

          <Reveal delay={80} variant="up">
            <div className="booking-hero__meta">
              <div className="booking-hero__meta-item">
                <span className="booking-hero__meta-label">Booking Style</span>
                <strong className="booking-hero__meta-value">Guided Tours</strong>
              </div>
              <div className="booking-hero__meta-item">
                <span className="booking-hero__meta-label">Group Size</span>
                <strong className="booking-hero__meta-value">Max 3</strong>
              </div>
              <div className="booking-hero__meta-item">
                <span className="booking-hero__meta-label">Checkout</span>
                <strong className="booking-hero__meta-value">Live Data Ready</strong>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section booking-shell">
        <div className="container booking-layout">
          <div className="booking-main">
            <Reveal variant="left">
              <form className="booking-form-shell">
                <section className="booking-form-section">
                  <div className="booking-form-section__heading">
                    <p className="section-kicker">Step 1</p>
                    <h2 className="section-title">Choose your route and departure</h2>
                  </div>

                  {error ? (
                    <div className="booking-note-card">
                      <h3 className="booking-note-card__title">Data unavailable</h3>
                      <p className="booking-note-card__copy">{error}</p>
                    </div>
                  ) : null}

                  <div className="booking-form-grid">
                    <div className="booking-field">
                      <label className="booking-field__label" htmlFor="route">
                        Route
                      </label>
                      <select
                        id="route"
                        className="booking-field__control"
                        value={selectedRouteSlug}
                        onChange={(event) => setSelectedRouteSlug(event.target.value)}
                        disabled={loadingRoutes}
                      >
                        <option value="">
                          {loadingRoutes ? "Loading routes..." : "Select a route"}
                        </option>
                        {routes.map((route) => (
                          <option key={route.id} value={route.slug}>
                            {route.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="booking-field">
                      <label className="booking-field__label" htmlFor="tour-date">
                        Departure
                      </label>
                      <select
                        id="tour-date"
                        className="booking-field__control"
                        value={selectedTourId}
                        onChange={(event) => setSelectedTourId(event.target.value)}
                        disabled={!selectedRouteSlug || loadingTours}
                      >
                        <option value="">
                          {!selectedRouteSlug
                            ? "Select a route first"
                            : loadingTours
                            ? "Loading departures..."
                            : scheduledTours.length === 0
                            ? "No open departures available"
                            : "Select a departure"}
                        </option>
                        {scheduledTours.map((tour) => (
                          <option key={tour.id} value={tour.id}>
                            {tour.date} · {tour.start_time} · £{tour.price_pp} pp
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="booking-field">
                      <label className="booking-field__label" htmlFor="party-size">
                        Party size
                      </label>
                      <select
                        id="party-size"
                        className="booking-field__control"
                        value={partySize}
                        onChange={(event) => setPartySize(event.target.value)}
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </div>

                    <div className="booking-field">
                      <label className="booking-field__label" htmlFor="season">
                        Season
                      </label>
                      <input
                        id="season"
                        className="booking-field__control"
                        type="text"
                        value={selectedTour ? selectedTour.season : ""}
                        placeholder="Auto-filled from departure"
                        readOnly
                      />
                    </div>
                  </div>
                </section>

                <section className="booking-form-section">
                  <div className="booking-form-section__heading">
                    <p className="section-kicker">Step 2</p>
                    <h2 className="section-title">Contact details</h2>
                  </div>

                  <div className="booking-form-grid">
                    <div className="booking-field">
                      <label className="booking-field__label" htmlFor="full-name">
                        Full name
                      </label>
                      <input
                        id="full-name"
                        className="booking-field__control"
                        type="text"
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="booking-field">
                      <label className="booking-field__label" htmlFor="email">
                        Email address
                      </label>
                      <input
                        id="email"
                        className="booking-field__control"
                        type="email"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="booking-field">
                      <label className="booking-field__label" htmlFor="phone">
                        Phone number
                      </label>
                      <input
                        id="phone"
                        className="booking-field__control"
                        type="tel"
                        placeholder="Your contact number"
                      />
                    </div>

                    <div className="booking-field">
                      <label className="booking-field__label" htmlFor="emergency-contact">
                        Emergency contact
                      </label>
                      <input
                        id="emergency-contact"
                        className="booking-field__control"
                        type="text"
                        placeholder="Emergency contact name"
                      />
                    </div>
                  </div>
                </section>

                <section className="booking-form-section">
                  <div className="booking-form-section__heading">
                    <p className="section-kicker">Step 3</p>
                    <h2 className="section-title">Booking notes</h2>
                  </div>

                  <div className="booking-field">
                    <label className="booking-field__label" htmlFor="notes">
                      Notes / additional info
                    </label>
                    <textarea
                      id="notes"
                      className="booking-field__control booking-field__control--textarea"
                      placeholder="Add any route preferences, questions, or extra detail"
                    />
                  </div>

                  <div className="booking-form-actions">
                    <button
                      type="button"
                      className="route-card__link route-card__link--primary"
                      disabled={!selectedRoute || !selectedTour}
                    >
                      Continue to checkout
                      <FaArrowRight />
                    </button>

                    <button type="button" className="route-card__link">
                      Save booking placeholder
                    </button>
                  </div>
                </section>
              </form>
            </Reveal>
          </div>

          <aside className="booking-aside">
            <Reveal variant="right">
              <div className="booking-summary-card">
                <p className="booking-summary-card__eyebrow">Booking Summary</p>
                <h2 className="booking-summary-card__title">Selected guided day</h2>

                <div className="booking-summary-card__route">
                  <span className="booking-summary-card__route-badge">
                    {selectedTour
                      ? selectedTour.season
                      : selectedRoute
                      ? selectedRoute.difficulty
                      : "Select route"}
                  </span>
                  <h3 className="booking-summary-card__route-title">
                    {selectedRoute ? selectedRoute.name : "No route selected"}
                  </h3>
                </div>

                <div className="booking-summary-card__meta">
                  <div className="booking-summary-card__meta-row">
                    <span>
                      <FaLocationDot />
                      Region
                    </span>
                    <strong>
                      {selectedRoute?.region?.name || "Select route"}
                    </strong>
                  </div>

                  <div className="booking-summary-card__meta-row">
                    <span>
                      <FaCalendarDays />
                      Departure
                    </span>
                    <strong>
                      {selectedTour
                        ? `${selectedTour.date} ${selectedTour.start_time}`
                        : "Select departure"}
                    </strong>
                  </div>

                  <div className="booking-summary-card__meta-row">
                    <span>
                      <FaUserGroup />
                      Party Size
                    </span>
                    <strong>{partySize}</strong>
                  </div>

                  <div className="booking-summary-card__meta-row">
                    <span>
                      <FaCreditCard />
                      Price per person
                    </span>
                    <strong>
                      {selectedTour ? `£${selectedTour.price_pp}` : "Select departure"}
                    </strong>
                  </div>

                  <div className="booking-summary-card__meta-row">
                    <span>
                      <FaUserGroup />
                      Spaces remaining
                    </span>
                    <strong>
                      {selectedTour
                        ? selectedTour.spaces_remaining
                        : "—"}
                    </strong>
                  </div>
                </div>

                <div className="booking-summary-card__price">
                  <span className="booking-summary-card__price-label">Estimated total</span>
                  <strong className="booking-summary-card__price-value">
                    {estimatedTotal !== null ? `£${estimatedTotal.toFixed(2)}` : "—"}
                  </strong>
                </div>

                <p className="booking-summary-card__note">
                  This summary is now driven by live route and scheduled tour data.
                  Next we can submit real bookings into Django.
                </p>
              </div>
            </Reveal>

            <Reveal delay={80} variant="right">
              <div className="booking-support-card">
                <p className="booking-support-card__eyebrow">Need help?</p>
                <h3 className="booking-support-card__title">
                  Talk through the right route first
                </h3>
                <p className="booking-support-card__copy">
                  Later this area can link to contact support, private enquiries,
                  and route advice before booking.
                </p>

                <button type="button" className="route-detail-action">
                  <FaEnvelope />
                  Contact support
                </button>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="section booking-notes">
        <div className="container">
          <Reveal variant="up">
            <div className="services-section-heading">
              <p className="section-kicker">Booking principles</p>
              <h2 className="section-title">
                Designed for a calmer, safer booking experience
              </h2>
            </div>
          </Reveal>

          <div className="booking-notes__grid">
            {notes.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 70}
                variant={index % 2 === 0 ? "left" : "right"}
              >
                <article className="booking-note-card">
                  <span className="booking-note-card__icon">
                    {index === 0 ? (
                      <FaUserGroup />
                    ) : index === 1 ? (
                      <FaShieldHeart />
                    ) : (
                      <FaCreditCard />
                    )}
                  </span>
                  <h3 className="booking-note-card__title">{item.title}</h3>
                  <p className="booking-note-card__copy">{item.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default BookNowPage;