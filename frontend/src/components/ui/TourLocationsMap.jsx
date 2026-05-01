import { useEffect, useMemo } from "react";
import L from "leaflet";
import { Link } from "react-router-dom";
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const REGION_COLOURS = {
  "Lake District": "#7dd3fc",
  Scotland: "#c084fc",
  Snowdonia: "#86efac",
  "Peak District": "#facc15",
};

const FALLBACK_COLOUR = "#f97316";

function getRegionColour(regionName) {
  return REGION_COLOURS[regionName] || FALLBACK_COLOUR;
}

function buildLocationIcon(regionName) {
  const colour = getRegionColour(regionName);

  return L.divIcon({
    className: "tour-locations-map__pin",
    html: `
      <span style="--pin-colour: ${colour}">
        <i></i>
      </span>
    `,
    iconSize: [28, 38],
    iconAnchor: [14, 34],
  });
}

function FitUkBounds({ routes }) {
  const map = useMap();

  useEffect(() => {
    const ukBounds = L.latLngBounds([
      [49.8, -8.8], // south-west UK
      [60.9, 2.2],  // north-east UK
    ]);

    const timer = window.setTimeout(() => {
      map.invalidateSize();

      const points = routes
        .map((route) => [
          Number(route.map_center_lat),
          Number(route.map_center_lng),
        ])
        .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));

      if (points.length > 1) {
        map.fitBounds(L.latLngBounds(points), {
          padding: [55, 55],
          maxZoom: 7,
        });
      } else {
        map.fitBounds(ukBounds, {
          padding: [28, 28],
          maxZoom: 6,
        });
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, [map, routes]);

  return null;
}

function formatDifficulty(value) {
  if (!value) return "Route";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function TourLocationsMap({ routes = [] }) {
  const mappedRoutes = useMemo(
    () =>
      routes.filter((route) => {
        const lat = Number(route.map_center_lat);
        const lng = Number(route.map_center_lng);
        return Number.isFinite(lat) && Number.isFinite(lng);
      }),
    [routes]
  );

  const regions = useMemo(() => {
    const uniqueRegions = new Map();

    mappedRoutes.forEach((route) => {
      if (!route.region?.name) return;

      uniqueRegions.set(route.region.name, {
        name: route.region.name,
        colour: getRegionColour(route.region.name),
      });
    });

    return Array.from(uniqueRegions.values());
  }, [mappedRoutes]);

  if (!mappedRoutes.length) {
    return (
      <div className="tour-locations-map tour-locations-map--empty">
        <p>No route locations are available yet.</p>
      </div>
    );
  }

  return (
    <div className="tour-locations-map">
      <MapContainer
        center={[54.7, -3.2]}
        zoom={5}
        minZoom={5}
        maxBounds={[
            [49.5, -9.5],
            [61.2, 2.8],
        ]}
        maxBoundsViscosity={0.85}
        scrollWheelZoom={false}
        className="tour-locations-map__canvas"
        >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitUkBounds routes={mappedRoutes} />

        {mappedRoutes.map((route) => {
          const position = [
            Number(route.map_center_lat),
            Number(route.map_center_lng),
          ];

          return (
            <Marker
              key={route.id}
              position={position}
              icon={buildLocationIcon(route.region?.name)}
            >
              <Tooltip
                direction="top"
                offset={[0, -30]}
                opacity={1}
                className="tour-locations-map__tooltip"
              >
                <strong>{route.name}</strong>
                <span>{route.region?.name}</span>
                <small>{formatDifficulty(route.difficulty)}</small>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="tour-locations-map__legend">
        {regions.map((region) => (
          <div key={region.name} className="tour-locations-map__legend-item">
            <span style={{ "--legend-colour": region.colour }} />
            {region.name}
          </div>
        ))}
      </div>

      <div className="tour-locations-map__actions">
        <Link to="/routes" className="route-detail-action route-detail-action--link">
          Explore all mapped routes
        </Link>
      </div>
    </div>
  );
}

export default TourLocationsMap;