import { FaArrowRight, FaCircleExclamation } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";

function PaymentCancelledPage() {
  return (
    <section className="section payment-result-shell">
      <div className="container">
        <Reveal variant="up">
          <div className="payment-result-card payment-confirmation-card">
            <div className="payment-confirmation-card__header">
              <span className="payment-result-card__icon payment-result-card__icon--warning">
                <FaCircleExclamation />
              </span>

              <div>
                <p className="section-kicker">Payment cancelled</p>
                <h1 className="section-title">
                  Your Stripe checkout was not completed
                </h1>
                <p className="section-copy">
                  No payment was confirmed. Your booking may still be visible in
                  your account, where you can try payment again or cancel it.
                </p>
              </div>
            </div>

            <div className="payment-confirmation-card__next">
              <h2 className="payment-confirmation-card__subtitle">
                What can you do next?
              </h2>

              <div className="payment-confirmation-card__next-grid">
                <div className="payment-confirmation-card__next-item">
                  <FaArrowRight />
                  <div>
                    <strong>Return to your account</strong>
                    <p>
                      Continue payment, amend details, or cancel the booking if
                      you no longer need it.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-result-card__actions">
              <Link
                to="/account"
                className="route-card__link route-card__link--primary"
              >
                Return to account
                <FaArrowRight />
              </Link>

              <Link to="/routes" className="route-card__link">
                Browse routes
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default PaymentCancelledPage;