import { FaChevronLeft, FaChevronRight, FaMapLocationDot } from "react-icons/fa6";
import RouteCard from "../components/ui/RouteCard";
import Reveal from "../components/ui/Reveal";

const mockRoutes = [
  {
    id: 1,
    name: "Helvellyn via Striding Edge",
    region: "Lake District",
    season: "Winter Classic",
    difficulty: "Advanced",
    distance: "11 km",
    duration: "7 hrs",
    height: "950 m",
    elevation: "860 m",
    summary:
      "A premium ridge day with steep exposure, winter movement, and one of the UK's most iconic summit approaches.",
    imageClass: "route-card__media--ridge",
  },
  {
    id: 2,
    name: "Blencathra via Sharp Edge",
    region: "Lake District",
    season: "Alpine Feel",
    difficulty: "Advanced",
    distance: "9 km",
    duration: "6 hrs",
    height: "868 m",
    elevation: "760 m",
    summary:
      "A sharper, more dramatic line with exposed movement and a strong mountain character suited to confident clients.",
    imageClass: "route-card__media--sharp",
  },
  {
    id: 3,
    name: "Tryfan North Ridge",
    region: "Eryri / Snowdonia",
    season: "Scramble Day",
    difficulty: "Advanced",
    distance: "8 km",
    duration: "6 hrs",
    height: "918 m",
    elevation: "790 m",
    summary:
      "A classic scrambling mountain with hands-on terrain, route choice, and a strong sense of movement through the landscape.",
    imageClass: "route-card__media--tryfan",
  },
  {
    id: 4,
    name: "Pen y Fan Horseshoe",
    region: "Bannau Brycheiniog",
    season: "Guided Day",
    difficulty: "Moderate",
    distance: "13 km",
    duration: "5.5 hrs",
    height: "886 m",
    elevation: "720 m",
    summary:
      "A broader mountain day with flowing ridges, open views, and a balanced challenge ideal for guided progression.",
    imageClass: "route-card__media--fan",
  },
  {
    id: 5,
    name: "Scafell Pike Corridor Route",
    region: "Lake District",
    season: "Summit Day",
    difficulty: "Moderate",
    distance: "14 km",
    duration: "6.5 hrs",
    height: "978 m",
    elevation: "840 m",
    summary:
      "A flagship summit experience with classic lines, strong mountain atmosphere, and adaptable guiding options.",
    imageClass: "route-card__media--scafell",
  },
  {
    id: 6,
    name: "Crib Goch Traverse",
    region: "Eryri / Snowdonia",
    season: "High Exposure",
    difficulty: "Advanced",
    distance: "10 km",
    duration: "7 hrs",
    height: "923 m",
    elevation: "850 m",
    summary:
      "A high-commitment day with a narrow ridge and premium guiding appeal for experienced clients seeking a memorable line.",
    imageClass: "route-card__media--crib",
  },
];

function RoutesPage() {
  return (
    <>
      <section className="routes-hero">
        <div className="routes-hero__image" />
        <div className="routes-hero__overlay" />

        <div className="container routes-hero__content">
          <Reveal variant="up">
            <p className="section-kicker">Curated Route Collection</p>
            <h1 className="page-title routes-hero__title">
              Explore guided mountain routes across the UK
            </h1>
            <p className="section-copy routes-hero__copy">
              Discover regional mountain days shaped around terrain, season,
              difficulty, and guiding quality. This page will later connect to
              live pagination, route data, and Leaflet / OS mapping.
            </p>
          </Reveal>

          <Reveal delay={80} variant="up">
            <div className="routes-hero__meta">
              <div className="routes-hero__meta-item">
                <span className="routes-hero__meta-label">Available Routes</span>
                <strong className="routes-hero__meta-value">28</strong>
              </div>
              <div className="routes-hero__meta-item">
                <span className="routes-hero__meta-label">Regions</span>
                <strong className="routes-hero__meta-value">5</strong>
              </div>
              <div className="routes-hero__meta-item">
                <span className="routes-hero__meta-label">Map Ready</span>
                <strong className="routes-hero__meta-value">
                  <FaMapLocationDot />
                </strong>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section routes-shell">
        <div className="container">
          <Reveal variant="up">
            <div className="routes-filter-bar">
              <div className="routes-filter-bar__group">
                <label className="routes-filter-bar__label" htmlFor="region-filter">
                  Region
                </label>
                <select id="region-filter" className="routes-filter-bar__control" defaultValue="all">
                  <option value="all">All Regions</option>
                  <option value="lake-district">Lake District</option>
                  <option value="snowdonia">Eryri / Snowdonia</option>
                  <option value="brecon">Bannau Brycheiniog</option>
                  <option value="scotland">Scotland</option>
                </select>
              </div>

              <div className="routes-filter-bar__group">
                <label className="routes-filter-bar__label" htmlFor="difficulty-filter">
                  Difficulty
                </label>
                <select id="difficulty-filter" className="routes-filter-bar__control" defaultValue="all">
                  <option value="all">All Levels</option>
                  <option value="moderate">Moderate</option>
                  <option value="hard">Hard</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="routes-filter-bar__group">
                <label className="routes-filter-bar__label" htmlFor="season-filter">
                  Season
                </label>
                <select id="season-filter" className="routes-filter-bar__control" defaultValue="all">
                  <option value="all">All Seasons</option>
                  <option value="winter">Winter</option>
                  <option value="summer">Summer</option>
                </select>
              </div>

              <div className="routes-filter-bar__group routes-filter-bar__group--search">
                <label className="routes-filter-bar__label" htmlFor="route-search">
                  Search
                </label>
                <input
                  id="route-search"
                  className="routes-filter-bar__control"
                  type="text"
                  placeholder="Search route name"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={60} variant="up">
            <div className="routes-toolbar">
              <p className="routes-toolbar__count">Showing 6 of 28 routes</p>

              <div className="routes-toolbar__sort">
                <label className="routes-filter-bar__label" htmlFor="sort-routes">
                  Sort by
                </label>
                <select id="sort-routes" className="routes-filter-bar__control routes-filter-bar__control--small" defaultValue="featured">
                  <option value="featured">Featured</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="distance">Distance</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>
          </Reveal>

          <div className="routes-grid">
            {mockRoutes.map((route, index) => (
              <Reveal
                key={route.id}
                delay={index * 60}
                variant={index % 2 === 0 ? "left" : "right"}
              >
                <RouteCard route={route} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} variant="up">
            <nav className="pagination-shell" aria-label="Routes pagination">
              <button type="button" className="pagination-shell__button">
                <FaChevronLeft />
                Previous
              </button>

              <div className="pagination-shell__pages">
                <button type="button" className="pagination-shell__page is-active">
                  1
                </button>
                <button type="button" className="pagination-shell__page">2</button>
                <button type="button" className="pagination-shell__page">3</button>
                <span className="pagination-shell__dots">…</span>
                <button type="button" className="pagination-shell__page">5</button>
              </div>

              <button type="button" className="pagination-shell__button">
                Next
                <FaChevronRight />
              </button>
            </nav>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default RoutesPage;