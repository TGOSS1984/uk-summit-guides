import { useEffect, useMemo, useState } from "react";
import {
  FaArrowRight,
  FaBoxArchive,
  FaCalendarDays,
  FaLocationDot,
  FaPenToSquare,
  FaReceipt,
  FaRightFromBracket,
  FaUserGroup,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import {
  amendBooking,
  archiveBooking,
  cancelBooking,
  createCheckoutSession,
  getCurrentUser,
  getMyBookings,
  loginUser,
  logoutUser,
  refundBooking,
  registerUser,
} from "../lib/api";

function formatPaymentStatus(status) {
  switch (status) {
    case "paid":
      return "Paid";
    case "pending":
      return "Pending";
    case "refund_pending":
      return "Refund pending";
    case "refunded":
      return "Refunded";
    default:
      return status || "Unknown";
  }
}

function formatStatus(status) {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getPaymentTone(paymentStatus) {
  return `status-badge status-badge--${paymentStatus}`;
}

function buildAmendForm(booking) {
  return {
    party_size: String(booking.party_size),
    contact_name: booking.contact_name || "",
    contact_email: booking.contact_email || "",
    contact_phone: booking.contact_phone || "",
    emergency_contact: booking.emergency_contact || "",
    notes: booking.notes || "",
  };
}

function AccountPage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const [cancellingId, setCancellingId] = useState(null);
  const [payingId, setPayingId] = useState(null);
  const [refundingId, setRefundingId] = useState(null);
  const [archivingId, setArchivingId] = useState(null);

  const [amendingId, setAmendingId] = useState(null);
  const [savingAmendId, setSavingAmendId] = useState(null);
  const [amendForm, setAmendForm] = useState({
    party_size: "1",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    emergency_contact: "",
    notes: "",
  });

  const [authMode, setAuthMode] = useState("login");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    passwordConfirm: "",
  });

  async function loadBookings() {
    try {
      setBookingsLoading(true);
      setError("");
      const data = await getMyBookings();
      setBookings(data);
    } catch {
      setError("Unable to load bookings right now.");
    } finally {
      setBookingsLoading(false);
    }
  }

  useEffect(() => {
    async function bootAccount() {
      try {
        setLoading(true);
        setError("");
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    bootAccount();
  }, []);

  useEffect(() => {
    if (user) {
      loadBookings();
    } else {
      setBookings([]);
    }
  }, [user]);

  const visibleBookings = useMemo(() => {
    return bookings.filter((booking) => !booking.is_archived);
  }, [bookings]);

  function handleLoginChange(event) {
    const { name, value } = event.target;
    setLoginForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleRegisterChange(event) {
    const { name, value } = event.target;
    setRegisterForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleAmendFieldChange(event) {
    const { name, value } = event.target;
    setAmendForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openAmendForm(booking) {
    setActionError("");
    setActionSuccess("");
    setAmendingId(booking.id);
    setAmendForm(buildAmendForm(booking));
  }

  function closeAmendForm() {
    setAmendingId(null);
    setSavingAmendId(null);
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setActionError("");
    setActionSuccess("");

    try {
      setAuthSubmitting(true);

      const loggedInUser = await loginUser({
        username: loginForm.username,
        password: loginForm.password,
      });

      setUser(loggedInUser);
      setActionSuccess("Logged in successfully.");
      setLoginForm({
        username: "",
        password: "",
      });

      window.dispatchEvent(new Event("auth-changed"));
    } catch (err) {
      setActionError(err?.data?.detail || "Unable to log in right now.");
    } finally {
      setAuthSubmitting(false);
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    setActionError("");
    setActionSuccess("");

    try {
      setAuthSubmitting(true);

      const registeredUser = await registerUser({
        username: registerForm.username,
        email: registerForm.email,
        first_name: registerForm.firstName,
        last_name: registerForm.lastName,
        password: registerForm.password,
        password_confirm: registerForm.passwordConfirm,
      });

      setUser(registeredUser);
      setActionSuccess("Account created successfully.");
      setRegisterForm({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        passwordConfirm: "",
      });

      window.dispatchEvent(new Event("auth-changed"));
    } catch (err) {
      const data = err?.data || {};
      const firstError =
        data.detail ||
        data.username?.[0] ||
        data.email?.[0] ||
        data.password?.[0] ||
        data.password_confirm?.[0] ||
        data.non_field_errors?.[0] ||
        JSON.stringify(data) ||
        "Unable to create account right now.";

      setActionError(firstError);
    } finally {
      setAuthSubmitting(false);
    }
  }

  async function handleLogout() {
    setActionError("");
    setActionSuccess("");

    try {
      await logoutUser();
      setUser(null);
      setBookings([]);
      setActionSuccess("Logged out successfully.");
      window.dispatchEvent(new Event("auth-changed"));
    } catch {
      setActionError("Unable to log out right now.");
    }
  }

  async function handleCancelBooking(bookingId) {
    setActionError("");
    setActionSuccess("");

    try {
      setCancellingId(bookingId);
      await cancelBooking(bookingId);
      setActionSuccess("Booking cancelled successfully.");
      await loadBookings();
    } catch (err) {
      setActionError(err?.data?.detail || "Unable to cancel booking right now.");
    } finally {
      setCancellingId(null);
    }
  }

  async function handlePayNow(bookingId) {
    setActionError("");
    setActionSuccess("");

    try {
      setPayingId(bookingId);
      const response = await createCheckoutSession(bookingId);

      if (!response?.checkout_url) {
        setActionError("Stripe checkout URL was not returned.");
        return;
      }

      window.location.href = response.checkout_url;
    } catch (err) {
      const apiError =
        err?.data?.detail ||
        err?.data?.error?.message ||
        "Unable to start payment right now.";

      setActionError(apiError);
    } finally {
      setPayingId(null);
    }
  }

  async function handleRefundBooking(bookingId) {
    setActionError("");
    setActionSuccess("");

    try {
      setRefundingId(bookingId);
      await refundBooking(bookingId);
      setActionSuccess("Refund processed successfully.");
      await loadBookings();
    } catch (err) {
      setActionError(err?.data?.detail || "Unable to process refund right now.");
    } finally {
      setRefundingId(null);
    }
  }

  async function handleArchiveBooking(bookingId) {
    setActionError("");
    setActionSuccess("");

    try {
      setArchivingId(bookingId);
      await archiveBooking(bookingId);
      setActionSuccess("Booking archived from your account view.");
      await loadBookings();
    } catch (err) {
      setActionError(err?.data?.detail || "Unable to archive booking right now.");
    } finally {
      setArchivingId(null);
    }
  }

  async function handleAmendSubmit(event, booking) {
    event.preventDefault();
    setActionError("");
    setActionSuccess("");

    try {
      setSavingAmendId(booking.id);

      const payload = {
        contact_name: amendForm.contact_name,
        contact_email: amendForm.contact_email,
        contact_phone: amendForm.contact_phone,
        emergency_contact: amendForm.emergency_contact,
        notes: amendForm.notes,
      };

      const canChangePartySize =
        booking.payment_status !== "paid" &&
        booking.payment_status !== "refund_pending" &&
        booking.payment_status !== "refunded";

      if (canChangePartySize) {
        payload.party_size = Number(amendForm.party_size);
      }

      await amendBooking(booking.id, payload);
      setActionSuccess("Booking amended successfully.");
      closeAmendForm();
      await loadBookings();
    } catch (err) {
      const data = err?.data || {};
      const firstError =
        data.detail ||
        data.party_size?.[0] ||
        data.contact_name?.[0] ||
        data.contact_email?.[0] ||
        data.contact_phone?.[0] ||
        data.non_field_errors?.[0] ||
        "Unable to amend booking right now.";

      setActionError(firstError);
    } finally {
      setSavingAmendId(null);
    }
  }

  return (
    <>
      <section className="account-hero">
        <div className="account-hero__image" />
        <div className="account-hero__overlay" />

        <div className="container account-hero__content">
          <Reveal variant="up">
            <p className="section-kicker">Account</p>
            <h1 className="page-title account-hero__title">
              {user
                ? "Manage your bookings and account access"
                : "Login or create your account"}
            </h1>
            <p className="account-hero__copy">
              {user
                ? "Your bookings now sit behind session-based authentication. This is the foundation for customer-specific booking management."
                : "Create an account or log in to view your bookings, manage future guided tours, and continue through the booking flow."}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section account-shell">
        <div className="container">
          {actionError ? (
            <Reveal variant="up">
              <div className="account-panel">
                <h3 className="account-benefit-card__title">Action error</h3>
                <p className="account-benefit-card__copy">{actionError}</p>
              </div>
            </Reveal>
          ) : null}

          {actionSuccess ? (
            <Reveal variant="up">
              <div className="account-panel account-panel--success">
                <h3 className="account-benefit-card__title">Success</h3>
                <p className="account-benefit-card__copy">{actionSuccess}</p>
              </div>
            </Reveal>
          ) : null}

          {loading ? (
            <Reveal variant="up">
              <div className="account-panel">
                <h3 className="account-benefit-card__title">Loading account…</h3>
                <p className="account-benefit-card__copy">
                  Checking current session status.
                </p>
              </div>
            </Reveal>
          ) : !user ? (
            <div className="account-auth-grid">
              <Reveal variant="left">
                <div className="account-panel">
                  <div className="account-auth-toggle">
                    <button
                      type="button"
                      className={
                        authMode === "login"
                          ? "account-auth-toggle__button is-active"
                          : "account-auth-toggle__button"
                      }
                      onClick={() => setAuthMode("login")}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      className={
                        authMode === "register"
                          ? "account-auth-toggle__button is-active"
                          : "account-auth-toggle__button"
                      }
                      onClick={() => setAuthMode("register")}
                    >
                      Create account
                    </button>
                  </div>

                  {authMode === "login" ? (
                    <form className="account-auth-form" onSubmit={handleLoginSubmit}>
                      <div className="booking-field">
                        <label className="booking-field__label" htmlFor="login-username">
                          Username
                        </label>
                        <input
                          id="login-username"
                          name="username"
                          className="booking-field__control"
                          type="text"
                          value={loginForm.username}
                          onChange={handleLoginChange}
                          disabled={authSubmitting}
                        />
                      </div>

                      <div className="booking-field">
                        <label className="booking-field__label" htmlFor="login-password">
                          Password
                        </label>
                        <input
                          id="login-password"
                          name="password"
                          className="booking-field__control"
                          type="password"
                          value={loginForm.password}
                          onChange={handleLoginChange}
                          disabled={authSubmitting}
                        />
                      </div>

                      <button
                        type="submit"
                        className="route-card__link route-card__link--primary"
                        disabled={authSubmitting}
                      >
                        {authSubmitting ? "Logging in..." : "Login"}
                      </button>
                    </form>
                  ) : (
                    <form className="account-auth-form" onSubmit={handleRegisterSubmit}>
                      <div className="booking-field">
                        <label className="booking-field__label" htmlFor="register-username">
                          Username
                        </label>
                        <input
                          id="register-username"
                          name="username"
                          className="booking-field__control"
                          type="text"
                          value={registerForm.username}
                          onChange={handleRegisterChange}
                          disabled={authSubmitting}
                        />
                      </div>

                      <div className="booking-field">
                        <label className="booking-field__label" htmlFor="register-email">
                          Email
                        </label>
                        <input
                          id="register-email"
                          name="email"
                          className="booking-field__control"
                          type="email"
                          value={registerForm.email}
                          onChange={handleRegisterChange}
                          disabled={authSubmitting}
                        />
                      </div>

                      <div className="booking-field">
                        <label className="booking-field__label" htmlFor="register-first-name">
                          First name
                        </label>
                        <input
                          id="register-first-name"
                          name="firstName"
                          className="booking-field__control"
                          type="text"
                          value={registerForm.firstName}
                          onChange={handleRegisterChange}
                          disabled={authSubmitting}
                        />
                      </div>

                      <div className="booking-field">
                        <label className="booking-field__label" htmlFor="register-last-name">
                          Last name
                        </label>
                        <input
                          id="register-last-name"
                          name="lastName"
                          className="booking-field__control"
                          type="text"
                          value={registerForm.lastName}
                          onChange={handleRegisterChange}
                          disabled={authSubmitting}
                        />
                      </div>

                      <div className="booking-field">
                        <label className="booking-field__label" htmlFor="register-password">
                          Password
                        </label>
                        <input
                          id="register-password"
                          name="password"
                          className="booking-field__control"
                          type="password"
                          value={registerForm.password}
                          onChange={handleRegisterChange}
                          disabled={authSubmitting}
                        />
                      </div>

                      <div className="booking-field">
                        <label className="booking-field__label" htmlFor="register-password-confirm">
                          Confirm password
                        </label>
                        <input
                          id="register-password-confirm"
                          name="passwordConfirm"
                          className="booking-field__control"
                          type="password"
                          value={registerForm.passwordConfirm}
                          onChange={handleRegisterChange}
                          disabled={authSubmitting}
                        />
                      </div>

                      <button
                        type="submit"
                        className="route-card__link route-card__link--primary"
                        disabled={authSubmitting}
                      >
                        {authSubmitting ? "Creating account..." : "Create account"}
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>

              <Reveal delay={80} variant="right">
                <div className="account-panel">
                  <h3 className="account-benefit-card__title">Why create an account?</h3>
                  <p className="account-benefit-card__copy">
                    Account access now controls booking creation, booking visibility,
                    and future cancellation or amendment tools.
                  </p>

                  <div className="account-benefits__grid account-benefits__grid--single">
                    <article className="account-benefit-card">
                      <h3 className="account-benefit-card__title">View your bookings</h3>
                      <p className="account-benefit-card__copy">
                        Only signed-in users will see their own bookings.
                      </p>
                    </article>

                    <article className="account-benefit-card">
                      <h3 className="account-benefit-card__title">Create bookings securely</h3>
                      <p className="account-benefit-card__copy">
                        Booking creation is now tied to the customer session.
                      </p>
                    </article>
                  </div>
                </div>
              </Reveal>
            </div>
          ) : (
            <>
              <Reveal variant="up">
                <div className="account-panel">
                  <div className="account-user-bar">
                    <div>
                      <p className="account-booking-card__eyebrow">Signed in as</p>
                      <h3 className="account-benefit-card__title">
                        {user.first_name || user.last_name
                          ? `${user.first_name} ${user.last_name}`.trim()
                          : user.username}
                      </h3>
                      <p className="account-benefit-card__copy">{user.email || user.username}</p>
                    </div>

                    <button
                      type="button"
                      className="route-detail-action"
                      onClick={handleLogout}
                    >
                      <FaRightFromBracket />
                      Logout
                    </button>
                  </div>
                </div>
              </Reveal>

              <Reveal variant="up">
                <div className="services-section-heading">
                  <p className="section-kicker">Booking overview</p>
                  <h2 className="section-title">Your live bookings</h2>
                </div>
              </Reveal>

              {bookingsLoading ? (
                <Reveal variant="up">
                  <div className="account-panel">
                    <h3 className="account-benefit-card__title">Loading bookings…</h3>
                    <p className="account-benefit-card__copy">
                      Pulling your booking records from Django.
                    </p>
                  </div>
                </Reveal>
              ) : error ? (
                <Reveal variant="up">
                  <div className="account-panel">
                    <h3 className="account-benefit-card__title">Booking data unavailable</h3>
                    <p className="account-benefit-card__copy">{error}</p>
                  </div>
                </Reveal>
              ) : visibleBookings.length === 0 ? (
                <Reveal variant="up">
                  <div className="account-panel">
                    <h3 className="account-benefit-card__title">No visible bookings</h3>
                    <p className="account-benefit-card__copy">
                      Create a booking from the Book Now page or unarchive records later if you add that feature.
                    </p>

                    <div className="account-actions">
                      <Link to="/book-now" className="route-card__link route-card__link--primary">
                        Start Booking
                        <FaArrowRight />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ) : (
                <div className="account-bookings-grid">
                  {visibleBookings.map((booking, index) => {
                    const canPay =
                      ["pending", "confirmed", "amended"].includes(booking.status) &&
                      booking.payment_status !== "paid" &&
                      booking.payment_status !== "refunded";

                    const canRefund =
                      booking.status === "cancelled" &&
                      booking.payment_status === "paid";

                    const canArchive =
                      booking.status === "cancelled" ||
                      booking.payment_status === "refunded";

                    const canAmend =
                      !booking.is_archived &&
                      booking.status !== "cancelled";

                    const canChangePartySize =
                      booking.payment_status !== "paid" &&
                      booking.payment_status !== "refund_pending" &&
                      booking.payment_status !== "refunded";

                    return (
                      <Reveal
                        key={booking.id}
                        delay={index * 60}
                        variant={index % 2 === 0 ? "left" : "right"}
                      >
                        <article className="account-booking-card">
                          <div className="account-booking-card__top">
                            <div>
                              <p className="account-booking-card__eyebrow">Booking reference</p>
                              <h3 className="account-booking-card__title">
                                {booking.booking_reference}
                              </h3>
                            </div>

                            <span
                              className={`account-booking-card__status account-booking-card__status--${booking.status}`}
                            >
                              {formatStatus(booking.status)}
                            </span>
                          </div>

                          <div className="account-booking-card__route">
                            <p className="account-booking-card__route-name">
                              {booking.scheduled_tour.route.name}
                            </p>
                            <p className="account-booking-card__route-region">
                              {booking.scheduled_tour.route.region.name}
                            </p>
                          </div>

                          <div className="account-booking-card__meta">
                            <div className="account-booking-card__meta-row">
                              <span>
                                <FaCalendarDays />
                                Departure
                              </span>
                              <strong>
                                {booking.scheduled_tour.date} {booking.scheduled_tour.start_time}
                              </strong>
                            </div>

                            <div className="account-booking-card__meta-row">
                              <span>
                                <FaUserGroup />
                                Party size
                              </span>
                              <strong>{booking.party_size}</strong>
                            </div>

                            <div className="account-booking-card__meta-row">
                              <span>
                                <FaLocationDot />
                                Contact
                              </span>
                              <strong>{booking.contact_name}</strong>
                            </div>

                            <div className="account-booking-card__meta-row">
                              <span>
                                <FaReceipt />
                                Total
                              </span>
                              <strong>£{booking.total_price}</strong>
                            </div>

                            <div className="account-booking-card__meta-row">
                              <span>
                                <FaReceipt />
                                Payment
                              </span>
                              <strong className={getPaymentTone(booking.payment_status)}>
                                {formatPaymentStatus(booking.payment_status)}
                              </strong>
                            </div>
                          </div>

                          <div className="account-booking-card__footer">
                            <span className="account-booking-card__created">
                              Created: {new Date(booking.created_at).toLocaleString()}
                            </span>

                            <div className="account-booking-card__actions">
                              {canAmend ? (
                                <button
                                  type="button"
                                  className="account-booking-card__amend"
                                  onClick={() => openAmendForm(booking)}
                                  disabled={savingAmendId === booking.id}
                                >
                                  <FaPenToSquare />
                                  Amend
                                </button>
                              ) : null}

                              {canPay ? (
                                <button
                                  type="button"
                                  className="account-booking-card__pay"
                                  onClick={() => handlePayNow(booking.id)}
                                  disabled={payingId === booking.id}
                                >
                                  {payingId === booking.id ? "Opening Stripe..." : "Pay now"}
                                </button>
                              ) : null}

                              {["pending", "confirmed", "amended"].includes(booking.status) ? (
                                <button
                                  type="button"
                                  className="account-booking-card__cancel"
                                  onClick={() => handleCancelBooking(booking.id)}
                                  disabled={cancellingId === booking.id || payingId === booking.id}
                                >
                                  {cancellingId === booking.id ? "Cancelling..." : "Cancel booking"}
                                </button>
                              ) : null}

                              {canRefund ? (
                                <button
                                  type="button"
                                  className="account-booking-card__refund"
                                  onClick={() => handleRefundBooking(booking.id)}
                                  disabled={refundingId === booking.id}
                                >
                                  {refundingId === booking.id ? "Refunding..." : "Refund payment"}
                                </button>
                              ) : null}

                              {canArchive ? (
                                <button
                                  type="button"
                                  className="account-booking-card__archive"
                                  onClick={() => handleArchiveBooking(booking.id)}
                                  disabled={archivingId === booking.id}
                                >
                                  {archivingId === booking.id ? (
                                    "Archiving..."
                                  ) : (
                                    <>
                                      <FaBoxArchive />
                                      Archive
                                    </>
                                  )}
                                </button>
                              ) : null}
                            </div>
                          </div>

                          {amendingId === booking.id ? (
                            <form
                              className="account-amend-form"
                              onSubmit={(event) => handleAmendSubmit(event, booking)}
                            >
                              <div className="account-amend-form__grid">
                                <div className="booking-field">
                                  <label className="booking-field__label" htmlFor={`amend-name-${booking.id}`}>
                                    Contact name
                                  </label>
                                  <input
                                    id={`amend-name-${booking.id}`}
                                    name="contact_name"
                                    className="booking-field__control"
                                    type="text"
                                    value={amendForm.contact_name}
                                    onChange={handleAmendFieldChange}
                                    disabled={savingAmendId === booking.id}
                                  />
                                </div>

                                <div className="booking-field">
                                  <label className="booking-field__label" htmlFor={`amend-email-${booking.id}`}>
                                    Contact email
                                  </label>
                                  <input
                                    id={`amend-email-${booking.id}`}
                                    name="contact_email"
                                    className="booking-field__control"
                                    type="email"
                                    value={amendForm.contact_email}
                                    onChange={handleAmendFieldChange}
                                    disabled={savingAmendId === booking.id}
                                  />
                                </div>

                                <div className="booking-field">
                                  <label className="booking-field__label" htmlFor={`amend-phone-${booking.id}`}>
                                    Contact phone
                                  </label>
                                  <input
                                    id={`amend-phone-${booking.id}`}
                                    name="contact_phone"
                                    className="booking-field__control"
                                    type="text"
                                    value={amendForm.contact_phone}
                                    onChange={handleAmendFieldChange}
                                    disabled={savingAmendId === booking.id}
                                  />
                                </div>

                                <div className="booking-field">
                                  <label className="booking-field__label" htmlFor={`amend-emergency-${booking.id}`}>
                                    Emergency contact
                                  </label>
                                  <input
                                    id={`amend-emergency-${booking.id}`}
                                    name="emergency_contact"
                                    className="booking-field__control"
                                    type="text"
                                    value={amendForm.emergency_contact}
                                    onChange={handleAmendFieldChange}
                                    disabled={savingAmendId === booking.id}
                                  />
                                </div>

                                <div className="booking-field">
                                  <label className="booking-field__label" htmlFor={`amend-party-size-${booking.id}`}>
                                    Party size
                                  </label>
                                  <select
                                    id={`amend-party-size-${booking.id}`}
                                    name="party_size"
                                    className="booking-field__control"
                                    value={amendForm.party_size}
                                    onChange={handleAmendFieldChange}
                                    disabled={!canChangePartySize || savingAmendId === booking.id}
                                  >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                  </select>
                                </div>

                                <div className="booking-field booking-field--full">
                                  <label className="booking-field__label" htmlFor={`amend-notes-${booking.id}`}>
                                    Notes
                                  </label>
                                  <textarea
                                    id={`amend-notes-${booking.id}`}
                                    name="notes"
                                    className="booking-field__control booking-field__control--textarea"
                                    value={amendForm.notes}
                                    onChange={handleAmendFieldChange}
                                    disabled={savingAmendId === booking.id}
                                  />
                                </div>
                              </div>

                              {!canChangePartySize ? (
                                <p className="account-amend-form__note">
                                  Party size cannot be changed after payment or refund processing.
                                </p>
                              ) : null}

                              <div className="account-amend-form__actions">
                                <button
                                  type="submit"
                                  className="route-card__link route-card__link--primary"
                                  disabled={savingAmendId === booking.id}
                                >
                                  {savingAmendId === booking.id ? "Saving..." : "Save changes"}
                                </button>

                                <button
                                  type="button"
                                  className="route-card__link"
                                  onClick={closeAmendForm}
                                  disabled={savingAmendId === booking.id}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : null}
                        </article>
                      </Reveal>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default AccountPage;