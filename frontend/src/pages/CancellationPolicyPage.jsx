import {
  FaArrowRight,
  FaCalendarCheck,
  FaCloudSun,
  FaFileContract,
  FaMountain,
  FaRotateLeft,
  FaShieldHeart,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";

function CancellationPolicyPage() {
  const policySections = [
    {
      title: "Customer cancellations",
      icon: <FaRotateLeft />,
      items: [
        {
          heading: "More than 14 days before your tour",
          copy:
            "Bookings cancelled more than 14 days before the scheduled start date can usually be moved to another available date or cancelled with a partial refund, less any payment processing or administration costs already incurred.",
        },
        {
          heading: "7 to 14 days before your tour",
          copy:
            "Cancellations within this period may be eligible for a date transfer where availability allows. Refunds may be reduced because guide time, planning, and route preparation may already have been committed.",
        },
        {
          heading: "Less than 7 days before your tour",
          copy:
            "Late cancellations are normally non-refundable unless there are exceptional circumstances. Where possible, we will still try to help you move to another suitable date.",
        },
      ],
    },
    {
      title: "Weather and mountain conditions",
      icon: <FaCloudSun />,
      items: [
        {
          heading: "Unsafe or unsuitable conditions",
          copy:
            "If weather, snow conditions, wind, visibility, access, or route hazards make the original objective unsuitable, the guide may change the route, adjust the plan, or recommend rescheduling.",
        },
        {
          heading: "Alternative objectives",
          copy:
            "A poor forecast does not always mean cancellation. Mountain days are often adapted to a safer objective, lower-level route, skills-focused day, or different region where appropriate.",
        },
        {
          heading: "Guide-led cancellations",
          copy:
            "If the guide decides the day cannot run safely and no suitable alternative is available, you will normally be offered a transfer to another date or a refund in line with the final booking terms.",
        },
      ],
    },
    {
      title: "Booking amendments",
      icon: <FaCalendarCheck />,
      items: [
        {
          heading: "Changing your date",
          copy:
            "Date changes are usually easiest when requested early. Availability depends on guide schedules, route conditions, group size, and whether the new date matches the original service type.",
        },
        {
          heading: "Changing participant numbers",
          copy:
            "Participant changes may affect pricing, safety ratios, and available spaces. Please request changes as soon as possible so the booking can be reviewed properly.",
        },
        {
          heading: "Private guiding changes",
          copy:
            "Private bookings may involve more tailored planning, so amendment windows and costs can vary depending on the route, guide allocation, and preparation already completed.",
        },
      ],
    },
  ];

  const reminders = [
    {
      icon: <FaMountain />,
      title: "Summits are not guaranteed",
      copy:
        "The guide’s decision on route choice, turnaround points, and safety is final.",
    },
    {
      icon: <FaShieldHeart />,
      title: "Safety comes first",
      copy:
        "Weather, terrain, daylight, group pace, and conditions can all change the plan.",
    },
    {
      icon: <FaFileContract />,
      title: "Final terms apply at checkout",
      copy:
        "This page gives realistic guidance. Final legal wording can be tightened later.",
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
              Cancellation policy
            </h1>
            <p className="support-hero__copy">
              Practical guidance for cancellations, amendments, weather-related
              changes, and how guided mountain days are managed when conditions
              affect the original plan.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section support-shell">
        <div className="container support-layout">
          <div className="support-main">
            {policySections.map((section, sectionIndex) => (
              <Reveal
                key={section.title}
                delay={sectionIndex * 80}
                variant="up"
              >
                <section className="support-card faq-group">
                  <div className="faq-group__header">
                    <span className="faq-group__icon">{section.icon}</span>
                    <div>
                      <p className="section-kicker">Policy</p>
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
                <p className="section-kicker">Before cancelling</p>
                <h2 className="support-card__title">
                  Contact us early if your plans change.
                </h2>
                <p className="support-card__copy">
                  The earlier you get in touch, the more options there usually
                  are for date changes, route alternatives, or transferring a
                  booking to another suitable mountain day.
                </p>
                <Link
                  to="/contact"
                  className="route-card__link route-card__link--primary"
                >
                  Contact support <FaArrowRight />
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
              <p className="section-kicker">Important notes</p>
              <h2 className="section-title">
                Mountain days need flexible decision-making
              </h2>
            </div>
          </Reveal>

          <div className="support-link-grid">
            {reminders.map((item, index) => (
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

export default CancellationPolicyPage;