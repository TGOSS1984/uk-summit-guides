import {
  FaArrowRight,
  FaCloudSun,
  FaCompass,
  FaLayerGroup,
  FaMountain,
  FaPersonHiking,
  FaShieldHeart,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";

function MountainAdvicePage() {
  const sections = [
    {
      title: "Choosing the right route",
      icon: <FaMountain />,
      items: [
        {
          heading: "Match the route to your current experience",
          copy:
            "Start with distance, ascent, terrain, exposure, and likely conditions. A shorter route can still feel serious in winter, poor visibility, strong wind, or rough ground.",
        },
        {
          heading: "Do not judge difficulty by distance alone",
          copy:
            "Mountain difficulty is shaped by steepness, navigation, scrambling, weather, remoteness, and how sustained the day feels. A route with modest mileage can still be demanding.",
        },
        {
          heading: "Build up gradually",
          copy:
            "If you are new to UK mountain terrain, begin with lower-level or moderate routes before moving towards exposed ridges, winter objectives, or longer remote days.",
        },
      ],
    },
    {
      title: "Weather and conditions",
      icon: <FaCloudSun />,
      items: [
        {
          heading: "Check more than one forecast",
          copy:
            "Mountain weather can change quickly. Look at wind speed, gusts, cloud base, precipitation, temperature, freezing level, visibility, and how the forecast changes through the day.",
        },
        {
          heading: "Winter changes everything",
          copy:
            "Snow, ice, short daylight, wind chill, and avalanche considerations can make familiar summer routes feel completely different. Equipment and decision-making need to match the season.",
        },
        {
          heading: "Have a backup plan",
          copy:
            "Good mountain planning includes alternatives: a shorter route, lower objective, different aspect, earlier turnaround point, or the decision not to go.",
        },
      ],
    },
    {
      title: "Kit, pacing and safety",
      icon: <FaShieldHeart />,
      items: [
        {
          heading: "Carry suitable layers",
          copy:
            "Weather can shift quickly. Waterproofs, insulating layers, gloves, hat, spare warm clothing, food, water, and a headtorch are sensible basics for most mountain days.",
        },
        {
          heading: "Move at a sustainable pace",
          copy:
            "A steady pace is usually safer than rushing early. Time, daylight, energy, group ability, and conditions should all shape the plan.",
        },
        {
          heading: "Turnaround decisions are normal",
          copy:
            "Turning back is part of good mountain judgement. Reaching the summit should never matter more than getting down safely and enjoying the day responsibly.",
        },
      ],
    },
  ];

  const links = [
    {
      icon: <FaCompass />,
      title: "Browse routes",
      copy: "Compare route distance, duration, region, and difficulty.",
      to: "/routes",
    },
    {
      icon: <FaPersonHiking />,
      title: "Private guiding",
      copy: "Ask about a route-led private mountain day.",
      to: "/services",
    },
    {
      icon: <FaLayerGroup />,
      title: "Route suitability",
      copy: "Contact us before booking if you are unsure.",
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
            <p className="section-kicker">Discover</p>
            <h1 className="page-title support-hero__title">
              Mountain advice
            </h1>
            <p className="support-hero__copy">
              Practical guidance for choosing routes, reading conditions,
              preparing kit, and approaching UK mountain days with calm,
              realistic decision-making.
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
                      <p className="section-kicker">Advice</p>
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
                <p className="section-kicker">Route judgement</p>
                <h2 className="support-card__title">
                  The best mountain plan is flexible.
                </h2>
                <p className="support-card__copy">
                  Conditions, group pace, daylight, and confidence on the ground
                  should shape the day. A good plan always leaves room to adapt.
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

      <section className="section support-quick-links">
        <div className="container">
          <Reveal variant="up">
            <div className="support-section-heading">
              <p className="section-kicker">Plan your next step</p>
              <h2 className="section-title">
                Choose a route that fits the season and your experience
              </h2>
            </div>
          </Reveal>

          <div className="support-link-grid">
            {links.map((item, index) => (
              <Reveal key={item.title} delay={index * 70} variant="up">
                <Link to={item.to} className="support-link-card">
                  <span className="support-link-card__icon">{item.icon}</span>
                  <h3 className="support-link-card__title">{item.title}</h3>
                  <p className="support-link-card__copy">{item.copy}</p>
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

export default MountainAdvicePage;