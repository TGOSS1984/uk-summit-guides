import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function parseGpxTrackPoints(gpxText) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(gpxText, "application/xml");

  const parserError = xml.querySelector("parsererror");
  if (parserError) {
    throw new Error("Invalid GPX file.");
  }

  const trackPoints = Array.from(xml.querySelectorAll("trkpt")).map((point) => [
    Number(point.getAttribute("lat")),
    Number(point.getAttribute("lon")),
  ]);

  if (trackPoints.length > 1) {
    return trackPoints;
  }

  const routePoints = Array.from(xml.querySelectorAll("rtept")).map((point) => [
    Number(point.getAttribute("lat")),
    Number(point.getAttribute("lon")),
  ]);

  return routePoints;
}

function buildDivIcon(label) {
  return L.divIcon({
    className: "route-map__marker-icon",
    html: `<span>${label}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function FitBounds({ points, fallbackCenter, fallbackZoom }) {
  const map = useMap();

  useEffect(() => {
    if (points.length > 1) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [28, 28] });
      return;
    }

    map.setView(fallbackCenter, fallbackZoom);
  }, [map, points, fallbackCenter, fallbackZoom]);

  return null;
}

function RouteMap({
  routeName,
  gpxFile,
  mapCenterLat,
  mapCenterLng,
  mapZoom = 12,
}) {
  const [routePoints, setRoutePoints] = useState([]);
  const [loading, setLoading] = useState(Boolean(gpxFile));
  const [error, setError] = useState("");

  const fallbackCenter = useMemo(() => {
    const lat = Number(mapCenterLat);
    const lng = Number(mapCenterLng);

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return [lat, lng];
    }

    return [54.5, -3.2];
  }, [mapCenterLat, mapCenterLng]);

  useEffect(() => {
    let isMounted = true;

    async function loadGpx() {
      if (!gpxFile) {
        setRoutePoints([]);
        setLoading(false);
        setError("");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(gpxFile);
        if (!response.ok) {
          throw new Error("Unable to load GPX file.");
        }

        const gpxText = await response.text();
        const parsedPoints = parseGpxTrackPoints(gpxText);

        if (!isMounted) return;

        if (parsedPoints.length > 1) {
          setRoutePoints(parsedPoints);
        } else {
          setRoutePoints([]);
          setError("GPX loaded but no valid route points were found.");
        }
      } catch (err) {
        if (!isMounted) return;
        setRoutePoints([]);
        setError(err.message || "Unable to load GPX route.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadGpx();

    return () => {
      isMounted = false;
    };
  }, [gpxFile]);

  const startPoint = routePoints[0] || null;
  const endPoint = routePoints.length > 1 ? routePoints[routePoints.length - 1] : null;

  return (
    <div className="route-map">
      <MapContainer
        center={fallbackCenter}
        zoom={mapZoom}
        scrollWheelZoom
        className="route-map__canvas"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds
          points={routePoints}
          fallbackCenter={fallbackCenter}
          fallbackZoom={mapZoom}
        />

        {routePoints.length > 1 ? (
          <>
            <Polyline positions={routePoints} className="route-map__line" />

            {startPoint ? (
              <Marker position={startPoint} icon={buildDivIcon("S")}>
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  Start · {routeName}
                </Tooltip>
              </Marker>
            ) : null}

            {endPoint ? (
              <Marker position={endPoint} icon={buildDivIcon("E")}>
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  End · {routeName}
                </Tooltip>
              </Marker>
            ) : null}
          </>
        ) : null}
      </MapContainer>

      <div className="route-map__status">
        {loading ? (
          <p className="route-map__status-text">Loading GPX route…</p>
        ) : error ? (
          <p className="route-map__status-text">{error}</p>
        ) : routePoints.length > 1 ? (
          <p className="route-map__status-text">
            Interactive route loaded with start and end markers.
          </p>
        ) : (
          <p className="route-map__status-text">
            No GPX route available yet. Showing fallback map centre only.
          </p>
        )}
      </div>
    </div>
  );
}

export default RouteMap;