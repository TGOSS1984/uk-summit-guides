import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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

function formatDateLabel(dateValue) {
  if (!dateValue) return "";
  const date = new Date(`${dateValue}T00:00:00`);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(date);
}

function formatMonthLabel(dateValue) {
  if (!dateValue) return "Available dates";
  const date = new Date(`${dateValue}T00:00:00`);
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getMonthKey(dateValue) {
  if (!dateValue) return "";
  const date = new Date(`${dateValue}T00:00:00`);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getCalendarDays(monthKey) {
  if (!monthKey) return [];

  const [year, month] = monthKey.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const startOffset = (firstDay.getDay() + 6) % 7;
  const days = [];

  for (let index = 0; index < startOffset; index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const date = new Date(year, month - 1, day);
    days.push(date.toISOString().slice(0, 10));
  }

  return days;
}

function BookNowPage() {
  const [searchParams] = useSearchParams();
  const routeFromUrl = searchParams.get("route") || "";
  const [routes, setRoutes] = useState([]);
  const [scheduledTours, setScheduledTours] = useState([]);
  const [selectedRouteSlug, setSelectedRouteSlug] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
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
        "Bookings are designed around a premium small-group experience, with a default maximum group size of 3.",
    },
    {
      title: "Availability protection",
      copy:
        "Capacity is validated server-side, so overbooking is blocked even if frontend data changes.",
    },
    {
      title: "Payments and confirmation",
      copy:
        "Bookings connect into Stripe Checkout, email confirmation, and account-based booking management.",
    },
  ];

  useEffect(() => {
    async function loadRoutes() {
      try {
        setLoadingRoutes(true);
        setPageError("");
        const routeData = await getRoutes();
        setRoutes(routeData);
      } catch {
        setPageError("Unable to load routes right now.");
      } finally {
        setLoadingRoutes(false);
      }
    }

    loadRoutes();
  }, []);

  useEffect(() => {
    if (!routeFromUrl || routes.length === 0) return;

    const matchingRoute = routes.find((route) => route.slug === routeFromUrl);

    if (matchingRoute) {
      setSelectedRouteSlug(matchingRoute.slug);
    }
  }, [routeFromUrl, routes]);

  useEffect(() => {
    async function loadTours() {
      if (!selectedRouteSlug) {
        setScheduledTours([]);
        setSelectedDate("");
        setSelectedMonth("");
        setSelectedTourId("");
        return;
      }

      try {
        setLoadingTours(true);
        setPageError("");
        const tourData = await getScheduledTours({ route: selectedRouteSlug });
        setScheduledTours(tourData);
        setSelectedDate("");
        setSelectedMonth("");
        setSelectedTourId("");
      } catch {
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

  const availableDates = useMemo(() => {
    const map = new Map();

    scheduledTours.forEach((tour) => {
      if (!map.has(tour.date)) {
        map.set(tour.date, {
          date: tour.date,
          tours: [],
          totalSpaces: 0,
        });
      }

      const item = map.get(tour.date);
      item.tours.push(tour);
      item.totalSpaces += Number(tour.spaces_remaining || 0);
    });

    return Array.from(map.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }, [scheduledTours]);

  const shouldUseCalendarView = availableDates.length > 10;

  const monthOptions = useMemo(() => {
    const uniqueMonths = new Map();

    availableDates.forEach((item) => {
      const monthKey = getMonthKey(item.date);

      if (!uniqueMonths.has(monthKey)) {
        uniqueMonths.set(monthKey, formatMonthLabel(item.date));
      }
    });

    return Array.from(uniqueMonths.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [availableDates]);

  const selectedMonthKey = selectedMonth || monthOptions[0]?.value || "";

  const calendarDays = useMemo(() => {
    return getCalendarDays(selectedMonthKey);
  }, [selectedMonthKey]);

  const datesByValue = useMemo(() => {
    const map = new Map();

    availableDates.forEach((item) => {
      map.set(item.date, item);
    });

    return map;
  }, [availableDates]);

  const toursForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return scheduledTours.filter((tour) => tour.date === selectedDate);
  }, [scheduledTours, selectedDate]);

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

  function handleRouteChange(event) {
    setSelectedRouteSlug(event.target.value);
    setSubmitSuccess(null);
    setSubmitError("");
  }

  function handleDateSelect(dateValue) {
    setSelectedDate(dateValue);
    setSelectedTourId("");
    setSubmitSuccess(null);
    setSubmitError("");
  }

  function handleTourSelect(tourId) {
    setSelectedTourId(String(tourId));
    setSubmitSuccess(null);
    setSubmitError("");
  }

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
      setSubmitError("Please select a route, date, and departure time before continuing.");
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
              Choose a route, select an available departure date, then complete
              your booking details before moving into payment.
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
                <strong className="booking-hero__meta-value">Live Availability</strong>
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

                  <div className="booking-field">
                    <label className="booking-field__label" htmlFor="route">
                      Route
                    </label>
                    <select
                      id="route"
                      className="booking-field__control"
                      value={selectedRouteSlug}
                      onChange={handleRouteChange}
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

                  <div className="booking-calendar-panel">
                    <div className="booking-calendar-panel__header">
                      <div>
                        <p className="section-kicker">Available dates</p>
                        <h3 className="booking-calendar-panel__title">
                          {selectedRoute
                            ? shouldUseCalendarView
                              ? formatMonthLabel(`${selectedMonthKey}-01`)
                              : formatMonthLabel(availableDates[0]?.date)
                            : "Select a route first"}
                        </h3>
                      </div>

                      <span className="booking-calendar-panel__count">
                        {availableDates.length} date{availableDates.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    {!selectedRouteSlug ? (
                      <p className="booking-calendar-panel__empty">
                        Choose a route above to view available departure dates.
                      </p>
                    ) : loadingTours ? (
                      <p className="booking-calendar-panel__empty">
                        Loading available departures…
                      </p>
                    ) : availableDates.length === 0 ? (
                      <p className="booking-calendar-panel__empty">
                        No open departures are currently available for this route.
                      </p>
                    ) : shouldUseCalendarView ? (
                      <>
                        <div className="booking-calendar-toolbar">
                          <label className="booking-field__label" htmlFor="booking-month">
                            Month
                          </label>
                          <select
                            id="booking-month"
                            className="booking-field__control"
                            value={selectedMonthKey}
                            onChange={(event) => setSelectedMonth(event.target.value)}
                            disabled={submitting}
                          >
                            {monthOptions.map((month) => (
                              <option key={month.value} value={month.value}>
                                {month.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="booking-calendar-grid">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                            <div key={day} className="booking-calendar-grid__weekday">
                              {day}
                            </div>
                          ))}

                          {calendarDays.map((dateValue, index) => {
                            if (!dateValue) {
                              return (
                                <div
                                  key={`blank-${index}`}
                                  className="booking-calendar-day booking-calendar-day--blank"
                                />
                              );
                            }

                            const item = datesByValue.get(dateValue);
                            const isAvailable = Boolean(item);
                            const isSelected = selectedDate === dateValue;
                            const isFull = item ? item.totalSpaces <= 0 : true;
                            const dayNumber = Number(dateValue.slice(-2));

                            return (
                              <button
                                key={dateValue}
                                type="button"
                                className={
                                  isSelected
                                    ? "booking-calendar-day is-selected"
                                    : isAvailable
                                    ? "booking-calendar-day is-available"
                                    : "booking-calendar-day"
                                }
                                onClick={() => item && handleDateSelect(dateValue)}
                                disabled={!item || isFull || submitting}
                              >
                                <span className="booking-calendar-day__number">
                                  {dayNumber}
                                </span>

                                {item ? (
                                  <span className="booking-calendar-day__meta">
                                    {item.totalSpaces} left
                                  </span>
                                ) : (
                                  <span className="booking-calendar-day__meta">—</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="booking-date-grid">
                        {availableDates.map((item) => {
                          const isSelected = item.date === selectedDate;
                          const isFull = item.totalSpaces <= 0;

                          return (
                            <button
                              key={item.date}
                              type="button"
                              className={
                                isSelected
                                  ? "booking-date-card is-selected"
                                  : "booking-date-card"
                              }
                              onClick={() => handleDateSelect(item.date)}
                              disabled={isFull || submitting}
                            >
                              <span className="booking-date-card__date">
                                {formatDateLabel(item.date)}
                              </span>
                              <span className="booking-date-card__spaces">
                                {item.totalSpaces} space{item.totalSpaces === 1 ? "" : "s"} left
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {selectedDate ? (
                    <div className="booking-time-panel">
                      <div className="booking-time-panel__header">
                        <p className="section-kicker">Departure time</p>
                        <h3 className="booking-time-panel__title">
                          {formatDateLabel(selectedDate)}
                        </h3>
                      </div>

                      <div className="booking-time-grid">
                        {toursForSelectedDate.map((tour) => {
                          const isSelected = String(tour.id) === String(selectedTourId);
                          const isFull = Number(tour.spaces_remaining || 0) <= 0;

                          return (
                            <button
                              key={tour.id}
                              type="button"
                              className={
                                isSelected
                                  ? "booking-time-card is-selected"
                                  : "booking-time-card"
                              }
                              onClick={() => handleTourSelect(tour.id)}
                              disabled={isFull || submitting}
                            >
                              <span className="booking-time-card__time">
                                {tour.start_time}
                              </span>
                              <span className="booking-time-card__meta">
                                £{tour.price_pp} pp · {tour.spaces_remaining} left
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  <div className="booking-form-grid">
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
                    <strong>{selectedRoute?.region?.name || "Select route"}</strong>
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
                    <strong>{selectedTour ? selectedTour.spaces_remaining : "—"}</strong>
                  </div>
                </div>

                <div className="booking-summary-card__price">
                  <span className="booking-summary-card__price-label">
                    Estimated total
                  </span>
                  <strong className="booking-summary-card__price-value">
                    {estimatedTotal !== null ? `£${estimatedTotal.toFixed(2)}` : "—"}
                  </strong>
                </div>

                <p className="booking-summary-card__note">
                  Booking requires an authenticated customer session.
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
                  Contact support before booking for private enquiries, route advice,
                  or guidance on conditions.
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