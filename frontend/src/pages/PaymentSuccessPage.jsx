import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaCalendarDays,
  FaCircleCheck,
  FaEnvelope,
  FaLocationDot,
  FaReceipt,
} from "react-icons/fa6";
import { Link, useSearchParams } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import { getCheckoutSession } from "../lib/api";

function formatCurrency(amountTotal, currency = "gbp") {
  if (amountTotal === null || amountTotal === undefined) return "Confirmed";

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountTotal / 100);
}

function formatPaymentStatus(status) {
  if (!status) return "Confirmed";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSession() {
      if (!sessionId) {
        setError("Missing Stripe session ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await getCheckoutSession(sessionId);
        setSessionData(data);
      } catch (err) {
        setError(err?.data?.detail || "Unable to load payment details.");
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [sessionId]);

  return (
    <section className="section payment-result-shell">
      <div className="container">
        <Reveal variant="up">
          <div className="payment-result-card payment-result-card--success payment-confirmation-card">
            <div className="payment-confirmation-card__header">
              <span className="payment-result-card__icon">
                <FaCircleCheck />
              </span>

              <div>
                <p className="section-kicker">Payment received</p>
                <h1 className="section-title">
                  Your booking is confirmed
                </h1>
                <p className="section-copy">
                  Thanks for booking with UK Summit Guides. Your payment has
                  completed and your booking details are shown below.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="payment-confirmation-card__state">
                <h2 className="payment-confirmation-card__subtitle">
                  Loading payment details…
                </h2>
                <p className="section-copy">
                  We are checking your Stripe checkout session.
                </p>
              </div>
            ) : error ? (
              <div className="payment-confirmation-card__state">
                <h2 className="payment-confirmation-card__subtitle">
                  Payment completed, but details could not be loaded
                </h2>
                <p className="section-copy">{error}</p>
                <p className="section-copy">
                  You can still return to your account to view your latest
                  booking status.
                </p>
              </div>
            ) : (
              <>
                <div className="payment-confirmation-card__reference">
                  <span>Booking reference</span>
                  <strong>{sessionData.booking_reference}</strong>
                </div>

                <div className="payment-result-card__meta payment-confirmation-card__meta">
                  <div className="payment-result-card__meta-row">
                    <span>
                      <FaLocationDot />
                      Route
                    </span>
                    <strong>{sessionData.route_name}</strong>
                  </div>

                  <div className="payment-result-card__meta-row">
                    <span>Region</span>
                    <strong>{sessionData.route_region}</strong>
                  </div>

                  <div className="payment-result-card__meta-row">
                    <span>
                      <FaCalendarDays />
                      Departure
                    </span>
                    <strong>
                      {sessionData.tour_date} {sessionData.tour_time}
                    </strong>
                  </div>

                  <div className="payment-result-card__meta-row">
                    <span>
                      <FaReceipt />
                      Amount paid
                    </span>
                    <strong>
                      {formatCurrency(
                        sessionData.amount_total,
                        sessionData.currency
                      )}
                    </strong>
                  </div>

                  <div className="payment-result-card__meta-row">
                    <span>Payment status</span>
                    <strong>
                      {formatPaymentStatus(sessionData.payment_status)}
                    </strong>
                  </div>
                </div>

                <div className="payment-confirmation-card__next">
                  <h2 className="payment-confirmation-card__subtitle">
                    What happens next?
                  </h2>

                  <div className="payment-confirmation-card__next-grid">
                    <div className="payment-confirmation-card__next-item">
                      <FaEnvelope />
                      <div>
                        <strong>Confirmation email</strong>
                        <p>
                          A confirmation email should arrive shortly with your
                          booking details.
                        </p>
                      </div>
                    </div>

                    <div className="payment-confirmation-card__next-item">
                      <FaCalendarDays />
                      <div>
                        <strong>Manage from account</strong>
                        <p>
                          You can view, amend, cancel, or archive eligible
                          bookings from your account page.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="payment-result-card__actions">
              <Link
                to="/account"
                className="route-card__link route-card__link--primary"
              >
                View account
                <FaArrowRight />
              </Link>

              <Link to="/routes" className="route-card__link">
                Explore more routes
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default PaymentSuccessPage;