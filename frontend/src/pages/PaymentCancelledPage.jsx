import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";

function PaymentCancelledPage() {
  return (
    <section className="section payment-result-shell">
      <div className="container">
        <Reveal variant="up">
          <div className="payment-result-card">
            <p className="section-kicker">Payment cancelled</p>
            <h1 className="section-title">Your Stripe checkout was not completed</h1>
            <p className="section-copy">
              No payment was confirmed. Your booking is still on the platform, and
              you can return to your account to try payment again later.
            </p>

            <div className="payment-result-card__actions">
              <Link to="/account" className="route-card__link route-card__link--primary">
                Return to account
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default PaymentCancelledPage;