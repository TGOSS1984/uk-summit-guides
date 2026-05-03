import {
  FaArrowRight,
  FaCalendarDays,
  FaCircleQuestion,
  FaCloudSun,
  FaMountain,
  FaShieldHeart,
  FaUserGroup,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";

function FAQPage() {
  const faqGroups = [
    {
      title: "Bookings & availability",
      icon: <FaCalendarDays />,
      items: [
        {
          question: "How do I book a guided mountain day?",
          answer:
            "Choose a route or service, review the available dates, then complete the booking form. The platform is designed around scheduled departures first, with private guiding requests handled through the contact route while bespoke booking tools are expanded.",
        },
        {
          question: "Can I book for a group?",
          answer:
            "Yes. The current experience is shaped around small groups and premium private bookings. Group size is intentionally controlled so the day remains calm, safe, and well-paced.",
        },
        {
          question: "Are routes available all year round?",
          answer:
            "Some routes are seasonal. Winter routes depend on conditions, daylight, snow cover, wind, and guide judgement. Summer routes may still be affected by poor weather, access issues, or unsuitable group experience.",
        },
      ],
    },
    {
      title: "Routes & experience level",
      icon: <FaMountain />,
      items: [
        {
          question: "How do I know which route is right for me?",
          answer:
            "Each route page is structured around difficulty, distance, duration, terrain, region, and route character. If you are unsure, start with the lower difficulty routes or contact the team before booking.",
        },
        {
          question: "Do I need previous winter mountain experience?",
          answer:
            "For more serious winter objectives, previous hillwalking experience and good fitness are expected. Technical winter days may require the ability to use crampons and an ice axe, or may be better approached as a skills-focused day first.",
        },
        {
          question: "What fitness level do I need?",
          answer:
            "You should be comfortable walking for several hours over uneven mountain terrain. Harder routes may involve long ascents, exposed ridges, scrambling, snow, or rough ground. The route difficulty labels are there to help set expectations before booking.",
        },
      ],
    },
    {
      title: "Weather, safety & changes",
      icon: <FaShieldHeart />,
      items: [
        {
          question: "What happens if the weather is unsuitable?",
          answer:
            "Mountain days are always guided by conditions. If the original objective is not appropriate, the guide may adjust the route, choose a safer alternative, delay the start, or recommend rescheduling where necessary.",
        },
        {
          question: "Will the summit always be reached?",
          answer:
            "No summit can be guaranteed. The priority is a well-managed mountain day, not forcing an objective. Weather, group pace, terrain, and safety decisions may all change the plan.",
        },
        {
          question: "What equipment do I need?",
          answer:
            "You will need suitable mountain clothing, footwear, food, water, and personal items for the season. Winter days may require additional kit such as crampons, ice axe, goggles, insulated layers, and gloves. Route-specific guidance should be checked before the day.",
        },
      ],
    },
  ];

  const quickLinks = [
    {
      icon: <FaUserGroup />,
      title: "Private guiding",
      copy: "For tailored objectives, smaller groups, and route-led enquiries.",
      to: "/services",
    },
    {
      icon: <FaCloudSun />,
      title: "Browse routes",
      copy: "Compare regions, distance, difficulty, and seasonal route style.",
      to: "/routes",
    },
    {
      icon: <FaCircleQuestion />,
      title: "Still unsure?",
      copy: "Send a message before choosing your route or booking date.",
      to: "/contact",
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
              Frequently asked questions
            </h1>
            <p className="support-hero__copy">
              Clear answers for booking, route choice, weather decisions, group
              size, kit, and what to expect from a guided UK mountain day.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section support-shell">
        <div className="container support-layout">
          <div className="support-main">
            {faqGroups.map((group, groupIndex) => (
              <Reveal
                key={group.title}
                delay={groupIndex * 80}
                variant="up"
              >
                <section className="support-card faq-group">
                  <div className="faq-group__header">
                    <span className="faq-group__icon">{group.icon}</span>
                    <div>
                      <p className="section-kicker">FAQ</p>
                      <h2 className="faq-group__title">{group.title}</h2>
                    </div>
                  </div>

                  <div className="faq-list">
                    {group.items.map((item) => (
                      <details key={item.question} className="faq-item">
                        <summary className="faq-item__question">
                          {item.question}
                        </summary>
                        <p className="faq-item__answer">{item.answer}</p>
                      </details>
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
                <p className="section-kicker">Need help choosing?</p>
                <h2 className="support-card__title">
                  Start with the route, the season, and your current experience.
                </h2>
                <p className="support-card__copy">
                  The safest choice is usually the route that matches your
                  current fitness, confidence on rough ground, and the likely
                  mountain conditions.
                </p>
                <Link to="/contact" className="route-card__link route-card__link--primary">
                  Ask a question <FaArrowRight />
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
              <p className="section-kicker">Useful next steps</p>
              <h2 className="section-title">
                Continue planning with confidence
              </h2>
            </div>
          </Reveal>

          <div className="support-link-grid">
            {quickLinks.map((link, index) => (
              <Reveal key={link.title} delay={index * 70} variant="up">
                <Link to={link.to} className="support-link-card">
                  <span className="support-link-card__icon">{link.icon}</span>
                  <h3 className="support-link-card__title">{link.title}</h3>
                  <p className="support-link-card__copy">{link.copy}</p>
                  <span className="support-link-card__cta">
                    View page <FaArrowRight />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default FAQPage;