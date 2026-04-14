import { useEffect, useMemo, useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import RouteCard from "../components/ui/RouteCard";
import Reveal from "../components/ui/Reveal";
import { getRegions, getRoutes } from "../lib/api";

function RoutesPage() {
  const [regions, setRegions] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [filters, setFilters] = useState({
    region: "all",
    difficulty: "all",
    search: "",
  });
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        setError("");

        const [regionsData, routesData] = await Promise.all([
          getRegions(),
          getRoutes(),
        ]);

        setRegions(regionsData);
        setRoutes(routesData);
      } catch (err) {
        setError("Unable to load route data right now.");
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    async function loadFilteredRoutes() {
      try {
        setLoading(true);
        setError("");

        const routesData = await getRoutes({
          region: filters.region,
          difficulty: filters.difficulty,
        });

        setRoutes(routesData);
      } catch (err) {
        setError("Unable to update route results right now.");
      } finally {
        setLoading(false);
      }
    }

    loadFilteredRoutes();
  }, [filters.region, filters.difficulty]);

  const displayedRoutes = useMemo(() => {
    let nextRoutes = [...routes];

    if (filters.search.trim()) {
      const searchValue = filters.search.toLowerCase();
      nextRoutes = nextRoutes.filter((route) =>
        route.name.toLowerCase().includes(searchValue)
      );
    }

    if (sortBy === "distance") {
      nextRoutes.sort((a, b) => Number(a.distance_km) - Number(b.distance_km));
    } else if (sortBy === "duration") {
      nextRoutes.sort((a, b) => Number(a.duration_hours) - Number(b.duration_hours));
    } else if (sortBy === "difficulty") {
      const order = { moderate: 1, hard: 2, advanced: 3 };
      nextRoutes.sort(
        (a, b) => (order[a.difficulty] || 0) - (order[b.difficulty] || 0)
      );
    } else {
      nextRoutes.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    }

    return nextRoutes;
  }, [routes, filters.search, sortBy]);

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
              difficulty, and guiding quality. This page is now wired to your
              Django route and region data.
            </p>
          </Reveal>

          <Reveal delay={80} variant="up">
            <div className="routes-hero__meta">
              <div className="routes-hero__meta-item">
                <span className="routes-hero__meta-label">Available Routes</span>
                <strong className="routes-hero__meta-value">{displayedRoutes.length}</strong>
              </div>
              <div className="routes-hero__meta-item">
                <span className="routes-hero__meta-label">Regions</span>
                <strong className="routes-hero__meta-value">{regions.length}</strong>
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
                <select
                  id="region-filter"
                  className="routes-filter-bar__control"
                  value={filters.region}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      region: event.target.value,
                    }))
                  }
                >
                  <option value="all">All Regions</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.slug}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="routes-filter-bar__group">
                <label className="routes-filter-bar__label" htmlFor="difficulty-filter">
                  Difficulty
                </label>
                <select
                  id="difficulty-filter"
                  className="routes-filter-bar__control"
                  value={filters.difficulty}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      difficulty: event.target.value,
                    }))
                  }
                >
                  <option value="all">All Levels</option>
                  <option value="moderate">Moderate</option>
                  <option value="hard">Hard</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="routes-filter-bar__group">
                <label className="routes-filter-bar__label" htmlFor="season-filter">
                  Data Source
                </label>
                <input
                  id="season-filter"
                  className="routes-filter-bar__control"
                  type="text"
                  value="Live Django API"
                  readOnly
                />
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
                  value={filters.search}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      search: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={60} variant="up">
            <div className="routes-toolbar">
              <p className="routes-toolbar__count">
                {loading
                  ? "Loading routes..."
                  : error
                  ? error
                  : `Showing ${displayedRoutes.length} route${
                      displayedRoutes.length === 1 ? "" : "s"
                    }`}
              </p>

              <div className="routes-toolbar__sort">
                <label className="routes-filter-bar__label" htmlFor="sort-routes">
                  Sort by
                </label>
                <select
                  id="sort-routes"
                  className="routes-filter-bar__control routes-filter-bar__control--small"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="distance">Distance</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>
          </Reveal>

          {!loading && !error && displayedRoutes.length === 0 ? (
            <Reveal delay={100} variant="up">
              <div className="booking-note-card">
                <h3 className="booking-note-card__title">No routes found</h3>
                <p className="booking-note-card__copy">
                  Try changing the filters or add more route data in Django admin.
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="routes-grid">
              {displayedRoutes.map((route, index) => (
                <Reveal
                  key={route.id}
                  delay={index * 60}
                  variant={index % 2 === 0 ? "left" : "right"}
                >
                  <RouteCard route={route} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default RoutesPage;