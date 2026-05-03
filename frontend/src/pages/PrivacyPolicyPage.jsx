import {
  FaArrowRight,
  FaDatabase,
  FaEnvelope,
  FaFileShield,
  FaLock,
  FaShieldHeart,
  FaUserCheck,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";

function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Information we may collect",
      icon: <FaDatabase />,
      items: [
        {
          heading: "Booking details",
          copy:
            "When a customer makes an enquiry or booking, the platform may collect details such as name, email address, phone number, chosen route, booking date, group size, and any message provided through the booking form.",
        },
        {
          heading: "Account information",
          copy:
            "If account features are used, the platform may store login details, saved bookings, booking history, and customer preferences needed to manage the user experience.",
        },
        {
          heading: "Payment status",
          copy:
            "Payment processing is handled through a secure payment provider. The platform should store booking and payment status information, but should not store full card details.",
        },
      ],
    },
    {
      title: "How information is used",
      icon: <FaUserCheck />,
      items: [
        {
          heading: "Managing bookings",
          copy:
            "Customer information is used to confirm bookings, manage availability, send booking updates, support cancellations or amendments, and prepare for the guided mountain day.",
        },
        {
          heading: "Customer support",
          copy:
            "Contact details and booking references may be used to respond to questions, provide route guidance, resolve issues, and keep customers informed about important changes.",
        },
        {
          heading: "Improving the service",
          copy:
            "General usage and booking patterns may help improve route content, booking flows, accessibility, customer communication, and the overall platform experience.",
        },
      ],
    },
    {
      title: "Storage, security and rights",
      icon: <FaFileShield />,
      items: [
        {
          heading: "Data storage",
          copy:
            "Information should be stored only for as long as needed for booking, customer support, legal, accounting, and operational purposes.",
        },
        {
          heading: "Security",
          copy:
            "The platform should use sensible security practices, including protected user accounts, secure payment handling, restricted admin access, and careful treatment of customer records.",
        },
        {
          heading: "Customer rights",
          copy:
            "Customers can request access to their personal information, ask for corrections, or request deletion where appropriate and where legal or operational records do not need to be retained.",
        },
      ],
    },
  ];

  const principles = [
    {
      icon: <FaLock />,
      title: "No full card storage",
      copy:
        "Card payments should be handled by the payment provider rather than stored directly in the application.",
    },
    {
      icon: <FaEnvelope />,
      title: "Relevant communication",
      copy:
        "Emails should be limited to booking, account, support, and opted-in route update communication.",
    },
    {
      icon: <FaShieldHeart />,
      title: "Careful admin access",
      copy:
        "Customer records should only be available to people who need them for booking and support operations.",
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
              Privacy policy
            </h1>
            <p className="support-hero__copy">
              How customer information may be collected, used, stored, and
              protected across bookings, accounts, payments, enquiries, and
              support communication.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section support-shell">
        <div className="container support-layout">
          <div className="support-main">
            {sections.map((section, index) => (
              <Reveal key={section.title} delay={index * 80} variant="up">
                <section className="support-card faq-group">
                  <div className="faq-group__header">
                    <span className="faq-group__icon">{section.icon}</span>
                    <div>
                      <p className="section-kicker">Privacy</p>
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
                <p className="section-kicker">Project note</p>
                <h2 className="support-card__title">
                  This policy is written for a portfolio booking platform.
                </h2>
                <p className="support-card__copy">
                  Before using the site as a real commercial service, the final
                  wording should be reviewed against live data handling,
                  payment, analytics, cookies, and legal requirements.
                </p>
                <Link
                  to="/contact"
                  className="route-card__link route-card__link--primary"
                >
                  Contact us <FaArrowRight />
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
              <p className="section-kicker">Privacy principles</p>
              <h2 className="section-title">
                Keep customer data purposeful, limited, and protected
              </h2>
            </div>
          </Reveal>

          <div className="support-link-grid">
            {principles.map((item, index) => (
              <Reveal key={item.title} delay={index * 70} variant="up">
                <article className="support-link-card">
                  <span className="support-link-card__icon">{item.icon}</span>
                  <h3 className="support-link-card__title">{item.title}</h3>
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

export default PrivacyPolicyPage;