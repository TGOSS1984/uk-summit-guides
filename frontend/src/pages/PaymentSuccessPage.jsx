import { useEffect, useState } from "react";
import { FaArrowRight, FaCircleCheck } from "react-icons/fa6";
import { Link, useSearchParams } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import { getCheckoutSession } from "../lib/api";

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
          <div className="payment-result-card payment-result-card--success">
            <span className="payment-result-card__icon">
              <FaCircleCheck />
            </span>

            <p className="section-kicker">Payment success</p>
            <h1 className="section-title">Your Stripe checkout has completed</h1>

            {loading ? (
              <p className="section-copy">Loading payment details…</p>
            ) : error ? (
              <p className="section-copy">{error}</p>
            ) : (
              <>
                <p className="section-copy">
                  Booking reference <strong>{sessionData.booking_reference}</strong>
                </p>

                <div className="payment-result-card__meta">
                  <div className="payment-result-card__meta-row">
                    <span>Route</span>
                    <strong>{sessionData.route_name}</strong>
                  </div>
                  <div className="payment-result-card__meta-row">
                    <span>Region</span>
                    <strong>{sessionData.route_region}</strong>
                  </div>
                  <div className="payment-result-card__meta-row">
                    <span>Departure</span>
                    <strong>
                      {sessionData.tour_date} {sessionData.tour_time}
                    </strong>
                  </div>
                  <div className="payment-result-card__meta-row">
                    <span>Payment status</span>
                    <strong>{sessionData.payment_status}</strong>
                  </div>
                </div>
              </>
            )}

            <div className="payment-result-card__actions">
              <Link to="/account" className="route-card__link route-card__link--primary">
                Back to account
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default PaymentSuccessPage;