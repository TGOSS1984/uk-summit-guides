import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaCompass,
  FaMountain,
  FaShieldAlt,
  FaSnowflake,
  FaUsers,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import { getGuides } from "../lib/api";

function getGuideInitials(guide) {
  const first = guide.first_name?.charAt(0) || "";
  const last = guide.last_name?.charAt(0) || "";
  return `${first}${last}` || "UG";
}

function getGuideName(guide) {
  return guide.full_name || `${guide.first_name || ""} ${guide.last_name || ""}`.trim();
}

function getGuideImage(profileImage) {
  if (!profileImage) return "";

  if (profileImage.startsWith("http") || profileImage.startsWith("/")) {
    return profileImage;
  }

  return `${import.meta.env.BASE_URL}${profileImage}`;
}

function getGuideRole(index) {
  const roles = [
    "Lead Mountain Guide",
    "Senior Mountain Guide",
    "Winter Skills Guide",
    "Private Guiding Specialist",
  ];

  return roles[index] || "Mountain Guide";
}

function getGuideRegion(index) {
  const regions = [
    "Lake District / Scotland",
    "Snowdonia / North Wales",
    "Scottish Highlands",
    "UK-wide",
  ];

  return regions[index] || "UK mountain regions";
}

function GuidesPage() {
  const [guides, setGuides] = useState([]);
  const [guidesLoading, setGuidesLoading] = useState(true);
  const [guidesError, setGuidesError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadGuides() {
      try {
        setGuidesLoading(true);
        setGuidesError("");

        const data = await getGuides();
        const results = Array.isArray(data) ? data : data.results || [];

        if (isMounted) {
          setGuides(results);
        }
      } catch (error) {
        if (isMounted) {
          setGuidesError("Unable to load guide profiles right now.");
        }
      } finally {
        if (isMounted) {
          setGuidesLoading(false);
        }
      }
    }

    loadGuides();

    return () => {
      isMounted = false;
    };
  }, []);

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
                Guide profiles are now powered by Django, so names, bios,
                images, qualifications, and active status can be managed from
                the admin panel.
              </p>
            </div>
          </Reveal>

          {guidesLoading ? (
            <div className="support-card">
              <p className="support-card__copy">Loading guide profiles…</p>
            </div>
          ) : guidesError ? (
            <div className="support-card">
              <p className="support-card__copy">{guidesError}</p>
            </div>
          ) : (
            <div className="guides-grid">
              {guides.map((guide, index) => {
                const guideName = getGuideName(guide);
                const guideImage = getGuideImage(guide.profile_image);
                const qualifications = guide.qualifications
                  ? guide.qualifications
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean)
                  : [];

                return (
                  <Reveal
                    key={guide.id || guide.slug || guideName}
                    delay={index * 70}
                    variant={index % 2 === 0 ? "left" : "right"}
                  >
                    <article className="guide-card">

                      <div className="guide-card__portrait-wrap">
                        <div className="guide-card__portrait">
                        {guideImage ? (
                          <>
                            <img
                              src={guideImage}
                              alt={guideName}
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                                event.currentTarget.nextElementSibling.style.display = "block";
                              }}
                            />
                            <span style={{ display: "none" }}>{getGuideInitials(guide)}</span>
                          </>
                        ) : (
                          <span>{getGuideInitials(guide)}</span>
                        )}
                      </div>
                      </div>

                      <div className="guide-card__content">
                        <p className="guide-card__eyebrow">
                          {getGuideRole(index)}
                        </p>
                        <h3 className="guide-card__name">{guideName}</h3>

                        <div className="guide-card__meta">
                          <span>
                            <FaMountain /> {getGuideRegion(index)}
                          </span>
                          <span>
                            <FaSnowflake />{" "}
                            {qualifications.length
                              ? qualifications.slice(0, 2).join(" / ")
                              : "Route-led mountain guiding"}
                          </span>
                        </div>

                        <p className="guide-card__bio">
                          {guide.bio ||
                            "A calm, supportive mountain guide focused on safe route choice, steady pacing, and helping clients enjoy memorable guided days in the UK mountains."}
                        </p>

                        <div className="guide-card__highlights">
                          {(qualifications.length
                            ? qualifications
                            : [
                                "Small-group guiding",
                                "Route planning",
                                "Client-focused pacing",
                              ]
                          ).map((highlight) => (
                            <span key={highlight}>{highlight}</span>
                          ))}
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
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