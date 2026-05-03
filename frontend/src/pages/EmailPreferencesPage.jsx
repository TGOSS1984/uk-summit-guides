import { useState } from "react";
import {
  FaArrowRight,
  FaEnvelopeOpenText,
  FaLocationDot,
  FaMountain,
  FaSnowflake,
} from "react-icons/fa6";
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
        type="button"
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

function PreferenceChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      className={active ? "preference-chip is-active" : "preference-chip"}
      onClick={onClick}
    >
      {label}
    </button>
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

  const [interests, setInterests] = useState({
    regions: ["Scotland", "Lake District"],
    difficulty: ["Intermediate"],
    seasons: ["Winter"],
  });

  function toggleInterest(group, value) {
    setInterests((current) => {
      const selected = current[group];
      const nextSelected = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];

      return {
        ...current,
        [group]: nextSelected,
      };
    });
  }

  const interestGroups = [
    {
      key: "regions",
      icon: <FaLocationDot />,
      title: "Preferred regions",
      copy: "Shape future route suggestions around the areas you care about most.",
      options: ["Scotland", "Lake District", "Snowdonia", "Peak District"],
    },
    {
      key: "difficulty",
      icon: <FaMountain />,
      title: "Route difficulty",
      copy: "Help us tailor recommendations to your current confidence and goals.",
      options: ["Beginner", "Intermediate", "Advanced"],
    },
    {
      key: "seasons",
      icon: <FaSnowflake />,
      title: "Seasonal interest",
      copy: "Choose whether you prefer winter objectives, summer routes, or both.",
      options: ["Winter", "Summer"],
    },
  ];

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
              minimal, relevant, and aligned to your route interests.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section support-shell">
        <div className="container support-layout">
          <div className="support-main">
            <Reveal variant="up">
              <section className="support-card">
                <p className="section-kicker">Communication</p>
                <h2 className="support-card__title">What you receive</h2>

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
                    onChange={(value) =>
                      setPrefs({ ...prefs, reminders: value })
                    }
                  />
                  <Toggle
                    label="Route recommendations"
                    description="Suggested routes based on your interests."
                    checked={prefs.recommendations}
                    onChange={(value) =>
                      setPrefs({ ...prefs, recommendations: value })
                    }
                  />
                  <Toggle
                    label="Seasonal updates"
                    description="Winter conditions and summer highlights."
                    checked={prefs.seasonal}
                    onChange={(value) =>
                      setPrefs({ ...prefs, seasonal: value })
                    }
                  />
                  <Toggle
                    label="Offers and promotions"
                    description="Occasional offers and early access bookings."
                    checked={prefs.promotions}
                    onChange={(value) =>
                      setPrefs({ ...prefs, promotions: value })
                    }
                  />
                </div>
              </section>
            </Reveal>

            <Reveal delay={80} variant="up">
              <section className="support-card">
                <p className="section-kicker">Interests</p>
                <h2 className="support-card__title">
                  Personalise your route updates
                </h2>

                <div className="preference-grid">
                  {interestGroups.map((group) => (
                    <article key={group.key} className="preference-card">
                      <span className="preference-card__icon">
                        {group.icon}
                      </span>
                      <h3 className="preference-card__title">
                        {group.title}
                      </h3>
                      <p className="preference-card__copy">{group.copy}</p>

                      <div className="preference-chip-list">
                        {group.options.map((option) => (
                          <PreferenceChip
                            key={option}
                            label={option}
                            active={interests[group.key].includes(option)}
                            onClick={() => toggleInterest(group.key, option)}
                          />
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal delay={120} variant="up">
              <section className="support-card">
                <p className="section-kicker">Frequency</p>
                <h2 className="support-card__title">How often</h2>

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

            <Reveal delay={160} variant="up">
              <section className="support-card email-preferences-actions">
                <button
                  type="button"
                  className="route-card__link route-card__link--primary"
                >
                  Save preferences <FaArrowRight />
                </button>

                <button type="button" className="unsubscribe-link">
                  Unsubscribe from all emails
                </button>
              </section>
            </Reveal>
          </div>

          <aside className="support-aside">
            <Reveal delay={100} variant="right">
              <div className="support-card support-card--sticky">
                <span
                  className="accent-box accent-box--content accent-box--right"
                  aria-hidden="true"
                />
                <span className="faq-group__icon">
                  <FaEnvelopeOpenText />
                </span>
                <p className="section-kicker">Communication</p>
                <h2 className="support-card__title">
                  Thoughtful, not frequent.
                </h2>
                <p className="support-card__copy">
                  We focus on relevant updates tied to routes, conditions,
                  seasonal changes, and the mountain areas you care about.
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