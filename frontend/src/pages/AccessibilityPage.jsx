import {
  FaArrowRight,
  FaCircleInfo,
  FaEye,
  FaKeyboard,
  FaMountain,
  FaPersonHiking,
  FaShieldHeart,
  FaUniversalAccess,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";

function AccessibilityPage() {
  const accessibilitySections = [
    {
      title: "Website accessibility",
      icon: <FaUniversalAccess />,
      items: [
        {
          heading: "Clear structure and navigation",
          copy:
            "Pages are designed with consistent headings, clear sections, readable cards, and predictable navigation so visitors can move through route, booking, support, and account areas with less friction.",
        },
        {
          heading: "Keyboard-friendly interactions",
          copy:
            "Core links and controls should remain usable with a keyboard. Interactive elements are built as links or buttons where possible, helping the interface behave more predictably for assistive technology.",
        },
        {
          heading: "Readable contrast and spacing",
          copy:
            "The visual system uses dark surfaces, strong typography, generous spacing, and restrained accent colours. Any future UI additions should keep text contrast, tap targets, and mobile readability in mind.",
        },
      ],
    },
    {
      title: "Mountain day suitability",
      icon: <FaMountain />,
      items: [
        {
          heading: "Routes vary significantly",
          copy:
            "Mountain routes can involve steep ascents, rough paths, scrambling, exposure, snow, ice, poor visibility, and long periods away from easy road access. Accessibility depends heavily on the route, season, and conditions.",
        },
        {
          heading: "Pre-booking conversation",
          copy:
            "If you have mobility, sensory, medical, confidence, or fitness considerations, the best approach is to contact the team before booking so the route choice, pace, and support needs can be discussed properly.",
        },
        {
          heading: "Alternative objectives",
          copy:
            "Where a specific summit or ridge is not suitable, a lower-level route, skills-focused session, shorter objective, or private guiding format may be more appropriate.",
        },
      ],
    },
    {
      title: "Communication and adjustments",
      icon: <FaCircleInfo />,
      items: [
        {
          heading: "Tell us what would help",
          copy:
            "Useful details include walking experience, confidence on uneven ground, relevant medical considerations, preferred pace, communication needs, and any equipment or support requirements.",
        },
        {
          heading: "Reasonable adjustments",
          copy:
            "Where practical, adjustments may include route choice, meeting point planning, group format, pacing, additional pre-day guidance, or recommending a private booking instead of a scheduled group day.",
        },
        {
          heading: "Guide judgement remains final",
          copy:
            "Guides may still adjust or stop a route if conditions, group pace, terrain, or safety concerns make the original plan unsuitable on the day.",
        },
      ],
    },
  ];

  const commitments = [
    {
      icon: <FaEye />,
      title: "Readable experience",
      copy:
        "Strong headings, clear page sections, and card-based layouts help users scan important information quickly.",
    },
    {
      icon: <FaKeyboard />,
      title: "Usable controls",
      copy:
        "Navigation and booking flows should prioritise real links, buttons, labels, and sensible focus behaviour.",
    },
    {
      icon: <FaPersonHiking />,
      title: "Route suitability",
      copy:
        "Mountain accessibility is route-specific, so suitability should be discussed before committing to harder objectives.",
    },
  ];

  return (
    <>
      <section className="support-hero">
        <div className="support-hero__image" />
        <div className="support-hero__overlay" />

        <div className="container support-hero__content">
          <Reveal variant="up">
            <p className="section-kicker">Support</p>
            <h1 className="page-title support-hero__title">
              Accessibility
            </h1>
            <p className="support-hero__copy">
              Information about website usability, mountain route suitability,
              and how visitors can discuss access needs before booking a guided
              mountain day.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section support-shell">
        <div className="container support-layout">
          <div className="support-main">
            {accessibilitySections.map((section, sectionIndex) => (
              <Reveal
                key={section.title}
                delay={sectionIndex * 80}
                variant="up"
              >
                <section className="support-card faq-group">
                  <div className="faq-group__header">
                    <span className="faq-group__icon">{section.icon}</span>
                    <div>
                      <p className="section-kicker">Accessibility</p>
                      <h2 className="faq-group__title">{section.title}</h2>
                    </div>
                  </div>

                  <div className="faq-list">
                    {section.items.map((item) => (
                      <article key={item.heading} className="faq-item">
                        <div className="faq-item__question">
                          {item.heading}
                        </div>
                        <p className="faq-item__answer">{item.copy}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>

          <aside className="support-aside">
            <Reveal delay={100} variant="right">
              <div className="support-card support-card--sticky">
                <span
                  className="accent-box accent-box--content accent-box--right"
                  aria-hidden="true"
                />
                <p className="section-kicker">Before booking</p>
                <h2 className="support-card__title">
                  Ask about route suitability before choosing a harder day.
                </h2>
                <p className="support-card__copy">
                  The best route is the one that matches the person, the season,
                  and the conditions. Contact the team with any access,
                  confidence, fitness, or support questions before booking.
                </p>
                <Link
                  to="/contact"
                  className="route-card__link route-card__link--primary"
                >
                  Discuss access needs <FaArrowRight />
                </Link>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="section support-quick-links">
        <div className="container">
          <Reveal variant="up">
            <div className="support-section-heading">
              <p className="section-kicker">Our approach</p>
              <h2 className="section-title">
                Clear information, realistic route choice, and calm planning
              </h2>
            </div>
          </Reveal>

          <div className="support-link-grid">
            {commitments.map((item, index) => (
              <Reveal key={item.title} delay={index * 70} variant="up">
                <article className="support-link-card">
                  <span className="support-link-card__icon">{item.icon}</span>
                  <h3 className="support-link-card__title">{item.title}</h3>
                  <p className="support-link-card__copy">{item.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} variant="up">
            <div className="support-card" style={{ marginTop: "1.5rem" }}>
              <p className="section-kicker">Important</p>
              <h2 className="support-card__title">
                This is a project accessibility statement, not a guarantee that
                every route is suitable for every participant.
              </h2>
              <p className="support-card__copy">
                UK mountain environments can be remote, steep, exposed, and
                condition-dependent. Suitability should always be assessed
                against the specific route, season, group, guide judgement, and
                individual needs.
              </p>
              <Link to="/routes" className="route-card__link">
                Browse route difficulty <FaShieldHeart />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default AccessibilityPage;