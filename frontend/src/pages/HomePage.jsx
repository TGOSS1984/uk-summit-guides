import Reveal from "../components/ui/Reveal";
import StatsBand from "../components/sections/StatsBand";

function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero__image" />
        <div className="hero__overlay" />

        <div className="hero__map-motif hero__map-motif--one" aria-hidden="true">
          <svg
            viewBox="0 0 420 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 184C60 164 86 150 98 116C110 82 136 58 170 60C204 62 214 102 236 128C258 154 288 170 330 152C360 139 380 108 400 68"
              pathLength="1"
            />
            <circle cx="20" cy="184" r="5" />
            <circle cx="170" cy="60" r="5" />
            <circle cx="330" cy="152" r="5" />
            <circle cx="400" cy="68" r="5" />
          </svg>
        </div>

        <div className="hero__map-motif hero__map-motif--two" aria-hidden="true">
          <svg
            viewBox="0 0 260 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32 188C68 176 88 150 88 118C88 80 114 52 146 50C176 48 194 72 194 104C194 138 210 164 234 178"
              pathLength="1"
            />
            <circle cx="32" cy="188" r="4.5" />
            <circle cx="146" cy="50" r="4.5" />
            <circle cx="234" cy="178" r="4.5" />
          </svg>
        </div>

        <div className="container hero__content">
          <div className="hero__content-grid">
            <div className="hero__main">
              <p className="hero__eyebrow">Mountain Travel Experts</p>
              <h1 className="hero__title">
                Guided summit days shaped by season, terrain, and adventure.
              </h1>
              <p className="hero__text">
                Premium guided mountain experiences across the UK with route-led
                planning, seasonal departures, and a sleek booking experience.
              </p>

              <div className="hero__actions">
                <a className="button button--primary" href="/book-now">
                  Book a Tour
                </a>
                <a className="button button--secondary" href="/routes">
                  Explore Routes
                </a>
              </div>
            </div>

            <div className="hero__aside">
              <div className="hero__route-card">
                <p className="hero__route-kicker">Featured route</p>
                <h2 className="hero__route-title">Helvellyn Winter Traverse</h2>

                <div className="hero__route-stats">
                  <div className="hero__route-stat">
                    <span className="hero__route-stat-label">Distance</span>
                    <strong className="hero__route-stat-value">11 km</strong>
                  </div>
                  <div className="hero__route-stat">
                    <span className="hero__route-stat-label">Duration</span>
                    <strong className="hero__route-stat-value">7 hrs</strong>
                  </div>
                  <div className="hero__route-stat">
                    <span className="hero__route-stat-label">Difficulty</span>
                    <strong className="hero__route-stat-value">Advanced</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hero__panel">
            <div className="hero__panel-card">
              <p className="hero__panel-kicker">Seasonal departures</p>
              <h2 className="hero__panel-title">
                Discover guided days built for winter and summer terrain.
              </h2>
              <p className="hero__panel-copy">
                Route-led planning, premium guiding, and a booking platform
                designed to feel calm, modern, and mountain-first.
              </p>
            </div>

            <div className="hero__panel-meta">
              <div className="hero__meta-item">
                <span className="hero__meta-label">Regions</span>
                <strong className="hero__meta-value">5</strong>
              </div>
              <div className="hero__meta-item">
                <span className="hero__meta-label">Routes</span>
                <strong className="hero__meta-value">28</strong>
              </div>
              <div className="hero__meta-item">
                <span className="hero__meta-label">Guides</span>
                <strong className="hero__meta-value">8</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--panel">
        <div className="container feature-band">
          <Reveal delay={80}>
            <div className="feature-band__card">
              <span className="feature-band__accent" aria-hidden="true" />
              <p className="feature-band__eyebrow">Seasonal touring</p>
              <h2 className="feature-band__title">Winter-first mountain platform</h2>
              <p className="feature-band__text">
                Designed around clean mountain photography, dark layered panels,
                elegant spacing, and a future-ready booking engine.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section editorial-section">
        <div className="container editorial-stack">
          <Reveal delay={40} variant="left">
            <article className="editorial-block editorial-block--first">
              <div className="editorial-block__text-wrap">
                <span
                  className="accent-box accent-box--content accent-box--right"
                  aria-hidden="true"
                />
                <div className="editorial-block__text">
                  <p className="editorial-block__number">01</p>
                  <p className="section-kicker">Get started</p>
                  <h2 className="section-title">
                    Find the right route for your season and experience level
                  </h2>
                  <p className="section-copy">
                    Browse structured mountain days with difficulty, distance,
                    elevation gain, duration, and regional detail. The goal is a
                    calmer, clearer planning experience that feels premium from
                    the first screen.
                  </p>
                </div>
              </div>

              <div className="editorial-block__media-wrap">
                <span
                  className="accent-box accent-box--media accent-box--top-left"
                  aria-hidden="true"
                />
                <div className="editorial-block__media" />
              </div>
            </article>
          </Reveal>

          <Reveal delay={110} variant="right">
            <article className="editorial-block editorial-block--reverse">
              <div className="editorial-block__text-wrap">
                <span
                  className="accent-box accent-box--content accent-box--left"
                  aria-hidden="true"
                />
                <div className="editorial-block__text">
                  <p className="editorial-block__number">02</p>
                  <p className="section-kicker">Book with confidence</p>
                  <h2 className="section-title">
                    Protected availability and route-led guided departures
                  </h2>
                  <p className="section-copy">
                    Capacity rules, seasonal pricing, customer accounts, and
                    guide scheduling will sit behind a polished frontend that
                    keeps the experience simple and intentional.
                  </p>
                </div>
              </div>

              <div className="editorial-block__media-wrap editorial-block__media-wrap--offset">
                <span
                  className="accent-box accent-box--media accent-box--bottom-right"
                  aria-hidden="true"
                />
                <div className="editorial-block__media editorial-block__media--alt" />
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="section scenic-section">
        <div className="container scenic-layout">
          <Reveal delay={60} variant="left">
            <div className="scenic-layout__left">
              <div className="scenic-layout__image-wrap">
                <span
                  className="accent-box accent-box--media accent-box--mid-left"
                  aria-hidden="true"
                />
                <div className="scenic-layout__image scenic-layout__image--one" />
              </div>

              <div className="scenic-layout__copy">
                <p className="section-kicker">Regional discovery</p>
                <h2 className="section-title">
                  Route pages that feel editorial, visual, and useful
                </h2>
                <p className="section-copy">
                  We are shaping the UI so route discovery feels more like a
                  curated mountain journal than a plain listing page, while
                  still keeping all the data and booking utility underneath.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} variant="right">
            <div className="scenic-layout__right">
              <div className="scenic-layout__copy scenic-layout__copy--compact">
                <p className="section-kicker">Design language</p>
                <h2 className="section-title">
                  Quiet surfaces, layered imagery, and restrained accents
                </h2>
                <p className="section-copy">
                  The red frames stay subtle and selective, used only to tie
                  together editorial cards and image compositions without
                  overpowering the colder mountain palette.
                </p>
              </div>

              <div className="scenic-layout__image scenic-layout__image--two" />
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal variant="up">
        <StatsBand />
      </Reveal>
    </>
  );
}

export default HomePage;