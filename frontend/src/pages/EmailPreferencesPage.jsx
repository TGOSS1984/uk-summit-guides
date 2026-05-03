import { useState } from "react";
import { FaArrowRight, FaEnvelopeOpenText } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";

function Toggle({ label, description, checked, onChange, disabled }) {
  return (
    <div className={`toggle-row ${disabled ? "toggle-row--disabled" : ""}`}>
      <div className="toggle-row__content">
        <div className="toggle-row__label">{label}</div>
        <div className="toggle-row__description">{description}</div>
      </div>

      <button
        className={`toggle ${checked ? "toggle--active" : ""}`}
        onClick={() => !disabled && onChange(!checked)}
        aria-pressed={checked}
        disabled={disabled}
      >
        <span className="toggle__thumb" />
      </button>
    </div>
  );
}

function EmailPreferencesPage() {
  const [prefs, setPrefs] = useState({
    confirmations: true,
    reminders: true,
    recommendations: true,
    seasonal: true,
    promotions: false,
  });

  const [frequency, setFrequency] = useState("monthly");

  return (
    <>
      <section className="support-hero">
        <div className="support-hero__image" />
        <div className="support-hero__overlay" />

        <div className="container support-hero__content">
          <Reveal variant="up">
            <p className="section-kicker">Account</p>
            <h1 className="page-title support-hero__title">
              Email preferences
            </h1>
            <p className="support-hero__copy">
              Control how and when you hear from us. We keep communication
              minimal, relevant, and aligned to your interests.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section support-shell">
        <div className="container support-layout">
          <div className="support-main">

            {/* Communication */}
            <Reveal variant="up">
              <section className="support-card">
                <p className="section-kicker">Communication</p>
                <h2 className="support-card__title">
                  What you receive
                </h2>

                <div className="toggle-group">
                  <Toggle
                    label="Booking confirmations"
                    description="Essential booking and payment updates."
                    checked={prefs.confirmations}
                    disabled
                  />
                  <Toggle
                    label="Trip reminders"
                    description="Pre-trip reminders and preparation guidance."
                    checked={prefs.reminders}
                    onChange={(v) =>
                      setPrefs({ ...prefs, reminders: v })
                    }
                  />
                  <Toggle
                    label="Route recommendations"
                    description="Suggested routes based on your interests."
                    checked={prefs.recommendations}
                    onChange={(v) =>
                      setPrefs({ ...prefs, recommendations: v })
                    }
                  />
                  <Toggle
                    label="Seasonal updates"
                    description="Winter conditions and summer highlights."
                    checked={prefs.seasonal}
                    onChange={(v) =>
                      setPrefs({ ...prefs, seasonal: v })
                    }
                  />
                  <Toggle
                    label="Offers and promotions"
                    description="Occasional offers and early access bookings."
                    checked={prefs.promotions}
                    onChange={(v) =>
                      setPrefs({ ...prefs, promotions: v })
                    }
                  />
                </div>
              </section>
            </Reveal>

            {/* Frequency */}
            <Reveal delay={80} variant="up">
              <section className="support-card">
                <p className="section-kicker">Frequency</p>
                <h2 className="support-card__title">
                  How often
                </h2>

                <div className="radio-group">
                  {[
                    { id: "important", label: "Only important updates" },
                    { id: "monthly", label: "Monthly highlights" },
                    { id: "occasional", label: "Occasional updates" },
                  ].map((item) => (
                    <label key={item.id} className="radio-option">
                      <input
                        type="radio"
                        name="frequency"
                        value={item.id}
                        checked={frequency === item.id}
                        onChange={() => setFrequency(item.id)}
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </section>
            </Reveal>

            {/* Save */}
            <Reveal delay={120} variant="up">
              <section className="support-card">
                <button className="route-card__link route-card__link--primary">
                  Save preferences <FaArrowRight />
                </button>

                <button className="unsubscribe-link">
                  Unsubscribe from all emails
                </button>
              </section>
            </Reveal>

          </div>

          <aside className="support-aside">
            <Reveal delay={100} variant="right">
              <div className="support-card support-card--sticky">
                <p className="section-kicker">Communication</p>
                <h2 className="support-card__title">
                  Thoughtful, not frequent.
                </h2>
                <p className="support-card__copy">
                  We focus on relevant updates tied to routes, conditions,
                  and seasonal changes — not inbox noise.
                </p>

                <Link
                  to="/routes"
                  className="route-card__link route-card__link--primary"
                >
                  Explore routes <FaArrowRight />
                </Link>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}

export default EmailPreferencesPage;