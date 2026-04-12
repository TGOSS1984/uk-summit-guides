function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero__image" />
        <div className="hero__overlay" />
        <div className="container hero__content">
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
      </section>

      <section className="section section--panel">
        <div className="container feature-band">
          <div className="feature-band__card">
            <p className="feature-band__eyebrow">Seasonal touring</p>
            <h2 className="feature-band__title">Winter-first mountain platform</h2>
            <p className="feature-band__text">
              Designed around clean mountain photography, dark layered panels,
              elegant spacing, and a future-ready booking engine.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container showcase-grid">
          <article className="showcase-card">
            <div className="showcase-card__media" />
            <div className="showcase-card__body">
              <p className="section-kicker">01 / Routes</p>
              <h2 className="section-title">Find the right mountain day</h2>
              <p className="section-copy">
                Browse regional routes with difficulty, distance, elevation,
                duration, and seasonal suitability.
              </p>
            </div>
          </article>

          <article className="showcase-card showcase-card--reverse">
            <div className="showcase-card__media" />
            <div className="showcase-card__body">
              <p className="section-kicker">02 / Guided tours</p>
              <h2 className="section-title">Book guided departures with confidence</h2>
              <p className="section-copy">
                Capacity rules, protected availability, customer accounts, and
                guided tour scheduling will all sit behind the polished frontend.
              </p>
            </div>
          </article>

          <article className="showcase-card">
            <div className="showcase-card__media" />
            <div className="showcase-card__body">
              <p className="section-kicker">03 / Seasonal design</p>
              <h2 className="section-title">Switch between winter and summer mood</h2>
              <p className="section-copy">
                The full interface uses root-based CSS tokens so palette, hero
                imagery, and surface styling can switch cleanly.
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

export default HomePage;