import {
  FaArrowRight,
  FaFileContract,
  FaMountain,
  FaShieldHeart,
  FaUserCheck,
  FaTriangleExclamation,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";

function TermsPage() {
  const sections = [
    {
      title: "Bookings and payments",
      icon: <FaUserCheck />,
      items: [
        {
          heading: "Booking confirmation",
          copy:
            "A booking is considered confirmed once payment has been successfully processed and a confirmation has been issued. Details provided during booking should be accurate and up to date.",
        },
        {
          heading: "Pricing and inclusions",
          copy:
            "Prices are based on the service type, group size, route, and guiding requirements. What is included in the day will be clearly outlined before booking.",
        },
        {
          heading: "Customer responsibility",
          copy:
            "Participants are responsible for ensuring they are appropriately equipped, physically prepared, and capable of completing the chosen route under expected conditions.",
        },
      ],
    },
    {
      title: "Safety and guide authority",
      icon: <FaMountain />,
      items: [
        {
          heading: "Guide decisions",
          copy:
            "The guide’s decision regarding route choice, pacing, turnaround points, and whether to continue is final and based on safety, conditions, and group capability.",
        },
        {
          heading: "Changing conditions",
          copy:
            "Weather, terrain, and group factors may require changes to the planned route. Summits and specific objectives are never guaranteed.",
        },
        {
          heading: "Participant conduct",
          copy:
            "Participants must follow reasonable instructions from the guide and behave in a way that does not compromise safety for themselves or others.",
        },
      ],
    },
    {
      title: "Cancellations and changes",
      icon: <FaTriangleExclamation />,
      items: [
        {
          heading: "Customer cancellations",
          copy:
            "Cancellation terms depend on timing and circumstances. Please refer to the cancellation policy page for full guidance.",
        },
        {
          heading: "Guide cancellations",
          copy:
            "In cases where the guide cancels due to safety or operational reasons, a transfer or refund may be offered depending on the situation.",
        },
        {
          heading: "Amendments",
          copy:
            "Requests to change dates, participants, or route type should be made as early as possible and are subject to availability.",
        },
      ],
    },
  ];

  const principles = [
    {
      icon: <FaShieldHeart />,
      title: "Safety first",
      copy:
        "Every decision is led by safety, not by achieving a summit at all costs.",
    },
    {
      icon: <FaFileContract />,
      title: "Clear expectations",
      copy:
        "Routes, risks, and requirements should be understood before booking.",
    },
    {
      icon: <FaMountain />,
      title: "Real mountain environments",
      copy:
        "Conditions are dynamic, and flexibility is part of every guided day.",
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
              Terms & conditions
            </h1>
            <p className="support-hero__copy">
              Core terms covering bookings, payments, guide authority, safety,
              and how mountain days are managed in changing conditions.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section support-shell">
        <div className="container support-layout">
          <div className="support-main">
            {sections.map((section, index) => (
              <Reveal key={section.title} delay={index * 80}>
                <section className="support-card faq-group">
                  <div className="faq-group__header">
                    <span className="faq-group__icon">{section.icon}</span>
                    <div>
                      <p className="section-kicker">Terms</p>
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
                />
                <p className="section-kicker">Before booking</p>
                <h2 className="support-card__title">
                  Make sure the route matches your experience and expectations.
                </h2>
                <p className="support-card__copy">
                  Choosing the right objective is one of the most important parts
                  of a successful mountain day. If unsure, ask before booking.
                </p>
                <Link
                  to="/routes"
                  className="route-card__link route-card__link--primary"
                >
                  Browse routes <FaArrowRight />
                </Link>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="section support-quick-links">
        <div className="container">
          <Reveal>
            <div className="support-section-heading">
              <p className="section-kicker">Principles</p>
              <h2 className="section-title">
                Built around safe, realistic, guided mountain days
              </h2>
            </div>
          </Reveal>

          <div className="support-link-grid">
            {principles.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <article className="support-link-card">
                  <span className="support-link-card__icon">
                    {item.icon}
                  </span>
                  <h3 className="support-link-card__title">
                    {item.title}
                  </h3>
                  <p className="support-link-card__copy">{item.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default TermsPage;