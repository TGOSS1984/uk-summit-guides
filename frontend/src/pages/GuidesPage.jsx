import {
  FaArrowRight,
  FaCompass,
  FaFirstAid,
  FaMountain,
  FaSnowflake,
  FaUsers
} from "react-icons/fa";
import { FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";

function GuidesPage() {
  const guides = [
    {
      name: "Tom Goss",
      role: "Lead Mountain Guide",
      initials: "TG",
      region: "Lake District / Scotland",
      specialism: "Winter mountain days, classic ridges, route planning",
      bio:
        "Tom leads route-led mountain days with a calm, structured approach. His guiding style focuses on clear planning, steady pacing, and helping clients choose objectives that suit the season, terrain, and group experience.",
      highlights: ["Small-group guiding", "Winter route planning", "Client-focused pacing"],
    },
    {
      name: "Guide Two",
      role: "Senior Mountain Guide",
      initials: "G2",
      region: "Snowdonia / North Wales",
      specialism: "Scrambles, ridgelines, and technical walking days",
      bio:
        "A confident and supportive guide for clients looking to progress onto more exposed terrain. Their days are built around movement skills, route awareness, and clear decision-making in changing mountain conditions.",
      highlights: ["Scrambling terrain", "Route confidence", "Progressive objectives"],
    },
    {
      name: "Guide Three",
      role: "Winter Skills Guide",
      initials: "G3",
      region: "Scottish Highlands",
      specialism: "Winter skills, snow conditions, and mountain judgement",
      bio:
        "Focused on helping clients build confidence in winter environments, from kit choices and footwork to safe route selection. Their approach keeps the day practical, measured, and condition-led.",
      highlights: ["Winter skills", "Snow travel", "Condition-led planning"],
    },
    {
      name: "Guide Four",
      role: "Private Guiding Specialist",
      initials: "G4",
      region: "UK-wide",
      specialism: "Bespoke guiding, private groups, and tailored objectives",
      bio:
        "Ideal for private bookings and tailored mountain days. Their guiding style is flexible, friendly, and built around matching the right objective to the group’s pace, confidence, and expectations.",
      highlights: ["Private guiding", "Bespoke days", "Group support"],
    },
  ];

  const values = [
    {
        icon: <FaShieldAlt />,
        title: "Safety-led decisions",
        copy:
        "Guides adapt objectives around weather, terrain, daylight, group pace, and real conditions on the hill.",
    },
    {
        icon: <FaUsers />,
        title: "Small-group focus",
        copy:
        "Guided days are designed to feel calm, personal, and properly supported rather than crowded or rushed.",
    },
    {
        icon: <FaCompass />,
        title: "Route-first planning",
        copy:
        "Every guide works from the route, the season, and the client’s current ability before chasing a summit.",
    },
    ];

  return (
    <>
      <section className="guides-hero">
        <div className="guides-hero__image" />
        <div className="guides-hero__overlay" />

        <div className="container guides-hero__content">
          <Reveal variant="up">
            <p className="section-kicker">Discover</p>
            <h1 className="page-title guides-hero__title">
              Meet our mountain guides
            </h1>
            <p className="guides-hero__copy">
              A small, experienced guiding team built around calm leadership,
              route-led planning, seasonal judgement, and premium mountain days
              across the UK.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section guides-shell">
        <div className="container">
          <Reveal variant="up">
            <div className="guides-section-heading">
              <p className="section-kicker">Guide team</p>
              <h2 className="section-title">
                Professional, calm, and mountain-first
              </h2>
              <p className="section-copy">
                Each guide profile is structured so this page can scale later
                from static content into real Django-powered guide records.
              </p>
            </div>
          </Reveal>

          <div className="guides-grid">
            {guides.map((guide, index) => (
              <Reveal
                key={guide.name}
                delay={index * 70}
                variant={index % 2 === 0 ? "left" : "right"}
              >
                <article className="guide-card">
                  <span
                    className="accent-box accent-box--content accent-box--right"
                    aria-hidden="true"
                  />

                  <div className="guide-card__portrait-wrap">
                    <div className="guide-card__portrait">
                      <span>{guide.initials}</span>
                    </div>
                  </div>

                  <div className="guide-card__content">
                    <p className="guide-card__eyebrow">{guide.role}</p>
                    <h3 className="guide-card__name">{guide.name}</h3>

                    <div className="guide-card__meta">
                      <span>
                        <FaMountain /> {guide.region}
                      </span>
                      <span>
                        <FaSnowflake /> {guide.specialism}
                      </span>
                    </div>

                    <p className="guide-card__bio">{guide.bio}</p>

                    <div className="guide-card__highlights">
                      {guide.highlights.map((highlight) => (
                        <span key={highlight}>{highlight}</span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section guides-values">
        <div className="container">
          <Reveal variant="up">
            <div className="guides-section-heading">
              <p className="section-kicker">Guiding standards</p>
              <h2 className="section-title">
                The same principles across every mountain day
              </h2>
            </div>
          </Reveal>

          <div className="support-link-grid">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 70} variant="up">
                <article className="support-link-card">
                  <span className="support-link-card__icon">{value.icon}</span>
                  <h3 className="support-link-card__title">{value.title}</h3>
                  <p className="support-link-card__copy">{value.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} variant="up">
            <div className="guides-cta">
              <div>
                <p className="section-kicker">Private guiding</p>
                <h2 className="guides-cta__title">
                  Want help choosing the right guide or objective?
                </h2>
                <p className="guides-cta__copy">
                  Send a route-led enquiry and we can shape the day around your
                  preferred region, season, group size, and experience level.
                </p>
              </div>

              <Link
                to="/contact"
                className="route-card__link route-card__link--primary"
              >
                Make an enquiry <FaArrowRight />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default GuidesPage;