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

function BookNowPage() {
  const notes = [
    {
      title: "Small group model",
      copy:
        "Bookings are being designed around a premium small-group experience, with a default maximum group size of 3.",
    },
    {
      title: "Availability protection",
      copy:
        "Later this page will connect to live scheduled tours, guide assignment, and protected availability rules.",
    },
    {
      title: "Payments and confirmation",
      copy:
        "Stripe checkout, booking confirmation emails, and account-linked booking management will be added in the backend phase.",
    },
  ];

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
              This page is the premium shell for the future booking flow. It is
              being designed around route-led selection, protected availability,
              small-group guiding, seasonal pricing, and a calm booking experience.
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
                <span className="booking-hero__meta-label">Checkout</span>
                <strong className="booking-hero__meta-value">Stripe Later</strong>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section booking-shell">
        <div className="container booking-layout">
          <div className="booking-main">
            <Reveal variant="left">
              <form className="booking-form-shell">
                <section className="booking-form-section">
                  <div className="booking-form-section__heading">
                    <p className="section-kicker">Step 1</p>
                    <h2 className="section-title">Choose your route and date</h2>
                  </div>

                  <div className="booking-form-grid">
                    <div className="booking-field">
                      <label className="booking-field__label" htmlFor="route">
                        Route
                      </label>
                      <select id="route" className="booking-field__control" defaultValue="">
                        <option value="" disabled>
                          Select a route
                        </option>
                        <option>Helvellyn via Striding Edge</option>
                        <option>Blencathra via Sharp Edge</option>
                        <option>Tryfan North Ridge</option>
                        <option>Scafell Pike Corridor Route</option>
                      </select>
                    </div>

                    <div className="booking-field">
                      <label className="booking-field__label" htmlFor="date">
                        Preferred date
                      </label>
                      <input id="date" className="booking-field__control" type="date" />
                    </div>

                    <div className="booking-field">
                      <label className="booking-field__label" htmlFor="party-size">
                        Party size
                      </label>
                      <select id="party-size" className="booking-field__control" defaultValue="1">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                      </select>
                    </div>

                    <div className="booking-field">
                      <label className="booking-field__label" htmlFor="season">
                        Season
                      </label>
                      <select id="season" className="booking-field__control" defaultValue="">
                        <option value="" disabled>
                          Select season
                        </option>
                        <option>Winter</option>
                        <option>Summer</option>
                      </select>
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
                        className="booking-field__control"
                        type="text"
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="booking-field">
                      <label className="booking-field__label" htmlFor="email">
                        Email address
                      </label>
                      <input
                        id="email"
                        className="booking-field__control"
                        type="email"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="booking-field">
                      <label className="booking-field__label" htmlFor="phone">
                        Phone number
                      </label>
                      <input
                        id="phone"
                        className="booking-field__control"
                        type="tel"
                        placeholder="Your contact number"
                      />
                    </div>

                    <div className="booking-field">
                      <label className="booking-field__label" htmlFor="emergency-contact">
                        Emergency contact
                      </label>
                      <input
                        id="emergency-contact"
                        className="booking-field__control"
                        type="text"
                        placeholder="Emergency contact name"
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
                      className="booking-field__control booking-field__control--textarea"
                      placeholder="Add any route preferences, questions, or extra detail"
                    />
                  </div>

                  <div className="booking-form-actions">
                    <button type="button" className="route-card__link route-card__link--primary">
                      Continue to checkout
                      <FaArrowRight />
                    </button>

                    <button type="button" className="route-card__link">
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
                  <span className="booking-summary-card__route-badge">Winter Classic</span>
                  <h3 className="booking-summary-card__route-title">
                    Helvellyn via Striding Edge
                  </h3>
                </div>

                <div className="booking-summary-card__meta">
                  <div className="booking-summary-card__meta-row">
                    <span>
                      <FaLocationDot />
                      Region
                    </span>
                    <strong>Lake District</strong>
                  </div>

                  <div className="booking-summary-card__meta-row">
                    <span>
                      <FaCalendarDays />
                      Date
                    </span>
                    <strong>Select later</strong>
                  </div>

                  <div className="booking-summary-card__meta-row">
                    <span>
                      <FaUserGroup />
                      Party Size
                    </span>
                    <strong>Up to 3</strong>
                  </div>

                  <div className="booking-summary-card__meta-row">
                    <span>
                      <FaCreditCard />
                      Payment
                    </span>
                    <strong>Stripe later</strong>
                  </div>
                </div>

                <div className="booking-summary-card__price">
                  <span className="booking-summary-card__price-label">Estimated from</span>
                  <strong className="booking-summary-card__price-value">£145 pp</strong>
                </div>

                <p className="booking-summary-card__note">
                  Seasonal pricing, live dates, and final totals will connect in
                  the backend phase.
                </p>
              </div>
            </Reveal>

            <Reveal delay={80} variant="right">
              <div className="booking-support-card">
                <p className="booking-support-card__eyebrow">Need help?</p>
                <h3 className="booking-support-card__title">Talk through the right route first</h3>
                <p className="booking-support-card__copy">
                  Later this area can link to contact support, private enquiries,
                  and service guidance before booking.
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
              <h2 className="section-title">Designed for a calmer, safer booking experience</h2>
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
                    {index === 0 ? <FaUserGroup /> : index === 1 ? <FaShieldHeart /> : <FaCreditCard />}
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