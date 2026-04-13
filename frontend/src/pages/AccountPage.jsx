import { FaArrowRight, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";

function AccountPage() {
  return (
    <>
      <section className="account-hero">
        <div className="account-hero__image" />
        <div className="account-hero__overlay" />

        <div className="container account-hero__content">
          <Reveal variant="up">
            <p className="section-kicker">Account</p>
            <h1 className="page-title account-hero__title">
              Login, create an account, and manage future bookings
            </h1>
            <p className="account-hero__copy">
              This page is the placeholder shell for account access. Later it will
              support login, registration, saved details, booking history, booking
              management, and account-linked confirmations.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section account-shell">
        <div className="container account-layout">
          <Reveal variant="left">
            <div className="account-panel">
              <p className="section-kicker">Returning customers</p>
              <h2 className="section-title">Login to your account</h2>
              <p className="section-copy">
                Later this will connect to Django authentication and let customers
                view, manage, amend, or cancel bookings from one account area.
              </p>

              <div className="account-actions">
                <button type="button" className="route-card__link route-card__link--primary">
                  <FaLock />
                  Login Placeholder
                </button>

                <button type="button" className="route-card__link">
                  <FaEnvelope />
                  Reset Password Later
                </button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80} variant="right">
            <div className="account-panel">
              <p className="section-kicker">New customers</p>
              <h2 className="section-title">Create your account</h2>
              <p className="section-copy">
                Account creation will later support faster checkout, booking history,
                confirmation emails, and access to future booking management tools.
              </p>

              <div className="account-actions">
                <button type="button" className="route-card__link route-card__link--primary">
                  <FaUserPlus />
                  Create Account Placeholder
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section account-benefits">
        <div className="container">
          <Reveal variant="up">
            <div className="services-section-heading">
              <p className="section-kicker">Why accounts matter</p>
              <h2 className="section-title">Designed to support the full booking journey</h2>
            </div>
          </Reveal>

          <div className="account-benefits__grid">
            <Reveal variant="left">
              <article className="account-benefit-card">
                <h3 className="account-benefit-card__title">Manage bookings</h3>
                <p className="account-benefit-card__copy">
                  Customers will later be able to view booking details, track status,
                  and manage future guided days from one account area.
                </p>
              </article>
            </Reveal>

            <Reveal delay={70} variant="up">
              <article className="account-benefit-card">
                <h3 className="account-benefit-card__title">Faster checkout</h3>
                <p className="account-benefit-card__copy">
                  Saved details and account-linked bookings will help create a smoother
                  booking experience once the backend is connected.
                </p>
              </article>
            </Reveal>

            <Reveal delay={140} variant="right">
              <article className="account-benefit-card">
                <h3 className="account-benefit-card__title">Booking history</h3>
                <p className="account-benefit-card__copy">
                  This will later become the customer area for tour history,
                  confirmation emails, and future amendments or cancellations.
                </p>
              </article>
            </Reveal>
          </div>

          <Reveal delay={180} variant="up">
            <div className="account-cta-panel">
              <p className="section-kicker">Explore first</p>
              <h2 className="section-title">
                Browse routes and services before account features are connected
              </h2>

              <div className="account-actions">
                <Link to="/routes" className="route-detail-action route-detail-action--link">
                  Explore Routes
                  <FaArrowRight />
                </Link>

                <Link to="/book-now" className="route-card__link route-card__link--primary">
                  Start Booking
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default AccountPage;