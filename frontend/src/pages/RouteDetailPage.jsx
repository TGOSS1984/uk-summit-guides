import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaCalendarDays,
  FaLocationDot,
  FaMapLocationDot,
  FaMountain,
  FaUserGroup,
} from "react-icons/fa6";
import { FiClock } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import RouteCard from "../components/ui/RouteCard";
import RouteMap from "../components/ui/RouteMap";
import { getRouteDetail, getRoutes, getRouteWeather, getScheduledTours } from "../lib/api";

function formatDifficulty(value) {
  if (!value) return "Route";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatWeatherDate(dateValue) {
  if (!dateValue) return "";
  const date = new Date(`${dateValue}T00:00:00`);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(date);
}

function describeWeatherCode(code) {
  const weatherMap = {
    0: "Clear",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Cloudy",
    45: "Fog",
    48: "Freezing fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Showers",
    82: "Heavy showers",
    95: "Thunderstorm",
  };

  return weatherMap[code] || "Mixed conditions";
}

function RouteDetailPage() {
  const { slug } = useParams();

  const [route, setRoute] = useState(null);
  const [scheduledTours, setScheduledTours] = useState([]);
  const [relatedRoutes, setRelatedRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  useEffect(() => {
    async function loadRouteData() {
      try {
        setLoading(true);
        setError("");

        const routeData = await getRouteDetail(slug);
        setRoute(routeData);

        const [toursData, routesData, weatherData] = await Promise.all([
          getScheduledTours({ route: slug }),
          getRoutes({ region: routeData.region.slug }),
          getRouteWeather(slug).catch(() => null),
        ]);

        setScheduledTours(toursData);
        setWeather(weatherData);
        setWeatherError(weatherData ? "" : "Weather forecast is unavailable right now.");
        setRelatedRoutes(
          routesData.filter((item) => item.slug !== routeData.slug).slice(0, 2)
        );
      } catch (err) {
        setError("Unable to load this route right now.");
      } finally {
        setLoading(false);
      }
    }

    loadRouteData();
  }, [slug]);

  if (loading) {
    return (
      <section className="section route-detail-shell">
        <div className="container">
          <div className="booking-note-card">
            <h2 className="booking-note-card__title">Loading route…</h2>
            <p className="booking-note-card__copy">
              Pulling live route data from the Django API.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !route) {
    return (
      <section className="section route-detail-shell">
        <div className="container">
          <div className="booking-note-card">
            <h2 className="booking-note-card__title">Route unavailable</h2>
            <p className="booking-note-card__copy">
              {error || "This route could not be found."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="route-detail-hero">
        <div className="route-detail-hero__image route-detail-hero__image--ridge" />
        <div className="route-detail-hero__overlay" />

        <div className="container route-detail-hero__content">
          <Reveal variant="up">
            <div className="route-detail-hero__breadcrumb">
              <Link to="/routes" className="route-detail-hero__breadcrumb-link">
                Routes
              </Link>
              <span>/</span>
              <span>{route.name}</span>
            </div>

            <p className="section-kicker">{route.region.name}</p>
            <h1 className="page-title route-detail-hero__title">{route.name}</h1>
            <p className="route-detail-hero__copy">{route.summary}</p>
          </Reveal>

          <Reveal delay={80} variant="up">
            <div className="route-detail-hero__stats">
              <div className="route-detail-hero__stat">
                <span className="route-detail-hero__stat-icon">
                  <FaMountain />
                </span>
                <div>
                  <span className="route-detail-hero__stat-label">Difficulty</span>
                  <strong className="route-detail-hero__stat-value">
                    {formatDifficulty(route.difficulty)}
                  </strong>
                </div>
              </div>

              <div className="route-detail-hero__stat">
                <span className="route-detail-hero__stat-icon">
                  <FiClock />
                </span>
                <div>
                  <span className="route-detail-hero__stat-label">Duration</span>
                  <strong className="route-detail-hero__stat-value">
                    {route.duration_hours} hrs
                  </strong>
                </div>
              </div>

              <div className="route-detail-hero__stat">
                <span className="route-detail-hero__stat-icon">
                  <FaMountain />
                </span>
                <div>
                  <span className="route-detail-hero__stat-label">Height</span>
                  <strong className="route-detail-hero__stat-value">
                    {route.mountain_height_m} m
                  </strong>
                </div>
              </div>

              <div className="route-detail-hero__stat">
                <span className="route-detail-hero__stat-icon">
                  <FaLocationDot />
                </span>
                <div>
                  <span className="route-detail-hero__stat-label">Elevation</span>
                  <strong className="route-detail-hero__stat-value">
                    {route.elevation_gain_m} m
                  </strong>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section route-detail-shell">
        <div className="container route-detail-layout">
          <div className="route-detail-main">
            <Reveal variant="left">
              <article className="route-detail-panel">
                <span
                  className="accent-box accent-box--content accent-box--right"
                  aria-hidden="true"
                />
                <p className="section-kicker">Overview</p>
                <h2 className="section-title">Live route description</h2>
                <p className="section-copy">{route.description}</p>
              </article>
            </Reveal>

            <Reveal delay={80} variant="left">
              <article className="route-detail-panel route-detail-panel--map">
                <div className="route-detail-panel__header">
                  <div>
                    <p className="section-kicker">Mapping</p>
                    <h2 className="section-title">Interactive route overview</h2>
                  </div>

                  <div className="route-detail-action route-detail-action--static">
                    <FaMapLocationDot />
                    GPX + Leaflet
                  </div>
                </div>

                <RouteMap
                  routeName={route.name}
                  gpxFile={route.gpx_file}
                  mapCenterLat={route.map_center_lat}
                  mapCenterLng={route.map_center_lng}
                  mapZoom={route.map_zoom || 12}
                />
              </article>
            </Reveal>

            <Reveal delay={120} variant="left">
              <article className="route-detail-panel">
                <p className="section-kicker">Scheduled Tours</p>
                <h2 className="section-title">Upcoming bookable departures</h2>

                {scheduledTours.length === 0 ? (
                  <div className="route-detail-highlight">
                    <span className="route-detail-highlight__marker" aria-hidden="true" />
                    <p className="route-detail-highlight__text">
                      No open scheduled tours yet for this route. Add some in Django
                      admin to see live departures here.
                    </p>
                  </div>
                ) : (
                  <div className="route-detail-highlights">
                    {scheduledTours.map((tour) => (
                      <div key={tour.id} className="route-detail-highlight">
                        <span className="route-detail-highlight__marker" aria-hidden="true" />
                        <p className="route-detail-highlight__text">
                          <strong>{tour.date}</strong> at {tour.start_time} — {tour.season} —{" "}
                          {tour.spaces_remaining} spaces remaining — £{tour.price_pp} pp
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </Reveal>
          </div>

          <aside className="route-detail-aside">
            <Reveal variant="right">
              <div className="route-booking-card">
                <p className="route-booking-card__eyebrow">Guided Booking</p>
                <h2 className="route-booking-card__title">Plan this mountain day</h2>

                <div className="route-booking-card__meta">
                  <div className="route-booking-card__meta-row">
                    <span>Difficulty</span>
                    <strong>{formatDifficulty(route.difficulty)}</strong>
                  </div>
                  <div className="route-booking-card__meta-row">
                    <span>Region</span>
                    <strong>{route.region.name}</strong>
                  </div>
                  <div className="route-booking-card__meta-row">
                    <span>Group Size</span>
                    <strong>Max 3</strong>
                  </div>
                  <div className="route-booking-card__meta-row">
                    <span>Available Tours</span>
                    <strong>{scheduledTours.length}</strong>
                  </div>
                </div>

                <Link to="/book-now" className="route-booking-card__button">
                  Book This Route
                  <FaArrowRight />
                </Link>

                <button type="button" className="route-booking-card__secondary">
                  View Dates Placeholder
                </button>
              </div>
            </Reveal>

            <Reveal delay={70} variant="right">
              <div className="route-guide-card">
                <p className="route-guide-card__eyebrow">Route Data</p>
                <div
                  className="route-guide-card__avatar route-guide-card__avatar--dynamic"
                  style={{
                    backgroundImage: route.card_image
                      ? `url(${route.card_image})`
                      : route.hero_image
                      ? `url(${route.hero_image})`
                      : undefined,
                  }}
                />
                <h3 className="route-guide-card__title">{route.region.name}</h3>
                <p className="route-guide-card__copy">
                  This route now supports GPX-based mapping with a fallback map centre.
                  Next we can layer in richer route styling, route stats, and start/end
                  journey detail.
                </p>

                <div className="route-guide-card__meta">
                  <div className="route-guide-card__meta-item">
                    <FaUserGroup />
                    <span>Small guided groups</span>
                  </div>
                  <div className="route-guide-card__meta-item">
                    <FaCalendarDays />
                    <span>Live departure data ready</span>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={110} variant="right">
              <div className="route-weather-card">
                <div className="route-weather-card__header">
                  <div>
                    <p className="route-weather-card__eyebrow">Mountain Forecast</p>
                    <h3 className="route-weather-card__title">Next 7 days</h3>
                  </div>
                  <span className="route-weather-card__source">
                    {weather?.source || "Open-Meteo"}
                  </span>
                </div>

                {weatherError ? (
                  <p className="route-weather-card__empty">{weatherError}</p>
                ) : !weather?.forecast?.length ? (
                  <p className="route-weather-card__empty">Loading forecast…</p>
                ) : (
                  <div className="route-weather-card__list">
                    {weather.forecast.slice(0, 7).map((day) => (
                      <div key={day.date} className="route-weather-card__day">
                        <div>
                          <strong>{formatWeatherDate(day.date)}</strong>
                          <span>{describeWeatherCode(day.weather_code)}</span>
                        </div>

                        <div className="route-weather-card__metrics">
                          <span>
                            {Math.round(day.temperature_min)}° /{" "}
                            {Math.round(day.temperature_max)}°
                          </span>
                          <span>{day.precipitation_probability ?? 0}% rain</span>
                          <span>{Math.round(day.wind_speed_max || 0)} km/h wind</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="route-weather-card__note">
                  Forecast is route-centre guidance only. Mountain conditions can change quickly.
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="section related-routes">
        <div className="container">
          <Reveal variant="up">
            <div className="related-routes__header">
              <div>
                <p className="section-kicker">Continue Exploring</p>
                <h2 className="section-title">Related mountain routes</h2>
              </div>

              <Link to="/routes" className="route-detail-action route-detail-action--link">
                Back to all routes
                <FaArrowRight />
              </Link>
            </div>
          </Reveal>

          <div className="routes-grid routes-grid--related">
            {relatedRoutes.map((item, index) => (
              <Reveal
                key={item.id}
                delay={index * 70}
                variant={index % 2 === 0 ? "left" : "right"}
              >
                <RouteCard route={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default RouteDetailPage;