import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaCalendarDays,
  FaLocationDot,
  FaReceipt,
  FaUserGroup,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import { cancelBooking, getMyBookings } from "../lib/api";

function formatStatus(status) {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function AccountPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  async function loadBookings() {
    try {
      setLoading(true);
      setError("");
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      setError("Unable to load bookings right now.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

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

  return (
    <>
      <section className="account-hero">
        <div className="account-hero__image" />
        <div className="account-hero__overlay" />

        <div className="container account-hero__content">
          <Reveal variant="up">
            <p className="section-kicker">Account</p>
            <h1 className="page-title account-hero__title">
              View created bookings and prepare for future account features
            </h1>
            <p className="account-hero__copy">
              This page is now connected to your Django booking data. It can also
              cancel eligible bookings, giving you a proper booking lifecycle.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section account-shell">
        <div className="container">
          <Reveal variant="up">
            <div className="services-section-heading">
              <p className="section-kicker">Booking overview</p>
              <h2 className="section-title">Live bookings from the platform</h2>
            </div>
          </Reveal>

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
                <h3 className="account-benefit-card__title">Loading bookings…</h3>
                <p className="account-benefit-card__copy">
                  Pulling live booking records from Django.
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
              {bookings.map((booking, index) => (
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
                    </div>

                    <div className="account-booking-card__footer">
                      <span className="account-booking-card__created">
                        Created: {new Date(booking.created_at).toLocaleString()}
                      </span>

                      {["pending", "confirmed"].includes(booking.status) ? (
                        <button
                          type="button"
                          className="account-booking-card__cancel"
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancellingId === booking.id}
                        >
                          {cancellingId === booking.id ? "Cancelling..." : "Cancel booking"}
                        </button>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section account-benefits">
        <div className="container">
          <Reveal variant="up">
            <div className="services-section-heading">
              <p className="section-kicker">What comes next</p>
              <h2 className="section-title">This page is now ready for the next account features</h2>
            </div>
          </Reveal>

          <div className="account-benefits__grid">
            <Reveal variant="left">
              <article className="account-benefit-card">
                <h3 className="account-benefit-card__title">Authenticated access</h3>
                <p className="account-benefit-card__copy">
                  Next we can restrict this page so each customer only sees their own bookings.
                </p>
              </article>
            </Reveal>

            <Reveal delay={70} variant="up">
              <article className="account-benefit-card">
                <h3 className="account-benefit-card__title">Amendment flows</h3>
                <p className="account-benefit-card__copy">
                  After cancellation, the next lifecycle feature is controlled amendment of dates or party size.
                </p>
              </article>
            </Reveal>

            <Reveal delay={140} variant="right">
              <article className="account-benefit-card">
                <h3 className="account-benefit-card__title">Payment linkage</h3>
                <p className="account-benefit-card__copy">
                  This page can also become the customer view for payment status and confirmations.
                </p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

export default AccountPage;