const API_BASE = "http://127.0.0.1:8000/api";

async function fetchJson(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function getRegions() {
  return fetchJson("/regions/");
}

export async function getRoutes(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  return fetchJson(`/routes/${queryString ? `?${queryString}` : ""}`);
}

export async function getRouteDetail(slug) {
  return fetchJson(`/routes/${slug}/`);
}

export async function getScheduledTours(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  return fetchJson(`/scheduled-tours/${queryString ? `?${queryString}` : ""}`);
}