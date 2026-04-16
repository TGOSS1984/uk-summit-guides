import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaCalendarDays,
  FaLocationDot,
  FaReceipt,
  FaRightFromBracket,
  FaUserGroup,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import {
  cancelBooking,
  createCheckoutSession,
  getCurrentUser,
  getMyBookings,
  loginUser,
  logoutUser,
  registerUser,
} from "../lib/api";

function formatStatus(status) {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
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
      const apiError = err?.data?.detail;
      setActionError(apiError || "Unable to cancel booking right now.");
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
              ) : bookings.length === 0 ? (
                <Reveal variant="up">
                  <div className="account-panel">
                    <h3 className="account-benefit-card__title">No bookings yet</h3>
                    <p className="account-benefit-card__copy">
                      Create your first booking from the Book Now page and it will appear here.
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
                  {bookings.map((booking, index) => {
                    const canPay =
                      ["pending", "confirmed"].includes(booking.status) &&
                      booking.payment_status !== "paid";

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
                              <strong>{formatStatus(booking.payment_status)}</strong>
                            </div>
                          </div>

                          <div className="account-booking-card__footer">
                            <span className="account-booking-card__created">
                              Created: {new Date(booking.created_at).toLocaleString()}
                            </span>

                            <div className="account-booking-card__actions">
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

                              {["pending", "confirmed"].includes(booking.status) ? (
                                <button
                                  type="button"
                                  className="account-booking-card__cancel"
                                  onClick={() => handleCancelBooking(booking.id)}
                                  disabled={cancellingId === booking.id || payingId === booking.id}
                                >
                                  {cancellingId === booking.id ? "Cancelling..." : "Cancel booking"}
                                </button>
                              ) : null}
                            </div>
                          </div>
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