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
import { createBooking, getRoutes, getScheduledTours } from "../lib/api";

function BookNowPage() {
  const [routes, setRoutes] = useState([]);
  const [scheduledTours, setScheduledTours] = useState([]);
  const [selectedRouteSlug, setSelectedRouteSlug] = useState("");
  const [selectedTourId, setSelectedTourId] = useState("");
  const [partySize, setPartySize] = useState("1");
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [loadingTours, setLoadingTours] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const [formData, setFormData] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    emergencyContact: "",
    notes: "",
  });

  const notes = [
    {
      title: "Small group model",
      copy:
        "Bookings are being designed around a premium small-group experience, with a default maximum group size of 3.",
    },
    {
      title: "Availability protection",
      copy:
        "The booking endpoint now validates capacity server-side, so overbooking is blocked even if the frontend changes.",
    },
    {
      title: "Payments and confirmation",
      copy:
        "Stripe checkout, booking confirmation emails, and account-linked booking management come next after this booking creation flow.",
    },
  ];

  useEffect(() => {
    async function loadRoutes() {
      try {
        setLoadingRoutes(true);
        setPageError("");
        const routeData = await getRoutes();
        setRoutes(routeData);
      } catch (err) {
        setPageError("Unable to load routes right now.");
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
        setPageError("");
        const tourData = await getScheduledTours({ route: selectedRouteSlug });
        setScheduledTours(tourData);
        setSelectedTourId("");
      } catch (err) {
        setPageError("Unable to load scheduled tours right now.");
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

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitError("");
    setSubmitSuccess(null);

    if (!selectedTour) {
      setSubmitError("Please select a route and departure before continuing.");
      return;
    }

    if (!formData.contactName || !formData.contactEmail || !formData.contactPhone) {
      setSubmitError("Please complete the required contact fields.");
      return;
    }

    try {
      setSubmitting(true);

      const booking = await createBooking({
        scheduled_tour_id: selectedTour.id,
        party_size: Number(partySize),
        contact_name: formData.contactName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        emergency_contact: formData.emergencyContact,
        notes: formData.notes,
      });

      setSubmitSuccess(booking);
      setSubmitError("");

      setFormData({
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        emergencyContact: "",
        notes: "",
      });
    } catch (err) {
      const apiErrors = err?.data;

      if (err?.status === 401) {
        setSubmitError("Please log in or create an account before booking.");
      } else if (apiErrors?.party_size?.[0]) {
        setSubmitError(apiErrors.party_size[0]);
      } else if (apiErrors?.scheduled_tour_id?.[0]) {
        setSubmitError(apiErrors.scheduled_tour_id[0]);
      } else if (apiErrors?.contact_email?.[0]) {
        setSubmitError(apiErrors.contact_email[0]);
      } else if (apiErrors?.contact_name?.[0]) {
        setSubmitError(apiErrors.contact_name[0]);
      } else if (apiErrors?.contact_phone?.[0]) {
        setSubmitError(apiErrors.contact_phone[0]);
      } else if (apiErrors?.detail) {
        setSubmitError(apiErrors.detail);
      } else {
        setSubmitError("Unable to create booking right now.");
      }
    } finally {
      setSubmitting(false);
    }
  }

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
              This page now pulls live route and departure data from Django and can
              create real booking records once the customer is logged in.
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
                <span className="booking-hero__meta-label">Status</span>
                <strong className="booking-hero__meta-value">Auth Enabled</strong>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section booking-shell">
        <div className="container booking-layout">
          <div className="booking-main">
            <Reveal variant="left">
              <form className="booking-form-shell" onSubmit={handleSubmit}>
                <section className="booking-form-section">
                  <div className="booking-form-section__heading">
                    <p className="section-kicker">Step 1</p>
                    <h2 className="section-title">Choose your route and departure</h2>
                  </div>

                  {pageError ? (
                    <div className="booking-note-card">
                      <h3 className="booking-note-card__title">Data unavailable</h3>
                      <p className="booking-note-card__copy">{pageError}</p>
                    </div>
                  ) : null}

                  {submitError ? (
                    <div className="booking-note-card">
                      <h3 className="booking-note-card__title">Booking error</h3>
                      <p className="booking-note-card__copy">{submitError}</p>
                    </div>
                  ) : null}

                  {submitSuccess ? (
                    <div className="booking-note-card booking-note-card--success">
                      <h3 className="booking-note-card__title">Booking created</h3>
                      <p className="booking-note-card__copy">
                        Reference: <strong>{submitSuccess.booking_reference}</strong>
                        <br />
                        Total: <strong>£{submitSuccess.total_price}</strong>
                      </p>
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
                        disabled={loadingRoutes || submitting}
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
                        disabled={!selectedRouteSlug || loadingTours || submitting}
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
                        disabled={submitting}
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
                        name="contactName"
                        className="booking-field__control"
                        type="text"
                        placeholder="Your full name"
                        value={formData.contactName}
                        onChange={handleFieldChange}
                        disabled={submitting}
                      />
                    </div>

                    <div className="booking-field">
                      <label className="booking-field__label" htmlFor="email">
                        Email address
                      </label>
                      <input
                        id="email"
                        name="contactEmail"
                        className="booking-field__control"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.contactEmail}
                        onChange={handleFieldChange}
                        disabled={submitting}
                      />
                    </div>

                    <div className="booking-field">
                      <label className="booking-field__label" htmlFor="phone">
                        Phone number
                      </label>
                      <input
                        id="phone"
                        name="contactPhone"
                        className="booking-field__control"
                        type="tel"
                        placeholder="Your contact number"
                        value={formData.contactPhone}
                        onChange={handleFieldChange}
                        disabled={submitting}
                      />
                    </div>

                    <div className="booking-field">
                      <label className="booking-field__label" htmlFor="emergency-contact">
                        Emergency contact
                      </label>
                      <input
                        id="emergency-contact"
                        name="emergencyContact"
                        className="booking-field__control"
                        type="text"
                        placeholder="Emergency contact name"
                        value={formData.emergencyContact}
                        onChange={handleFieldChange}
                        disabled={submitting}
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
                      name="notes"
                      className="booking-field__control booking-field__control--textarea"
                      placeholder="Add any route preferences, questions, or extra detail"
                      value={formData.notes}
                      onChange={handleFieldChange}
                      disabled={submitting}
                    />
                  </div>

                  <div className="booking-form-actions">
                    <button
                      type="submit"
                      className="route-card__link route-card__link--primary"
                      disabled={!selectedRoute || !selectedTour || submitting}
                    >
                      {submitting ? "Creating booking..." : "Create booking"}
                      <FaArrowRight />
                    </button>

                    <button type="button" className="route-card__link" disabled={submitting}>
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
                      {selectedTour ? selectedTour.spaces_remaining : "—"}
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
                  Booking now requires an authenticated customer session.
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