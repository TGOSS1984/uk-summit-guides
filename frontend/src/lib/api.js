const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  `http://${window.location.hostname}:8000/api`;

const AUTH_TOKEN_KEY = "uksummit-auth-token";

export function getAuthToken() {
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function clearAuthToken() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return "";
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return { detail: text || `HTTP ${response.status}` };
}

async function fetchJson(endpoint, options = {}) {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(
      data?.detail || `API request failed: ${response.status}`
    );
    error.data = data;
    error.status = response.status;
    throw error;
  }

  return data;
}

async function sendJson(endpoint, options = {}) {
  const csrfToken = getCookie("csrftoken");
  const token = getAuthToken();

  return fetchJson(endpoint, {
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
}

export async function ensureCsrf() {
  return fetchJson("/auth/csrf/");
}

export async function registerUser(payload) {
  await ensureCsrf();
  const user = await sendJson("/auth/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  setAuthToken(user.token);
  return user;
}

export async function loginUser(payload) {
  await ensureCsrf();
  const user = await sendJson("/auth/login/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  setAuthToken(user.token);
  return user;
}

export async function logoutUser() {
  await ensureCsrf();

  try {
    return await sendJson("/auth/logout/", {
      method: "POST",
      body: JSON.stringify({}),
    });
  } finally {
    clearAuthToken();
  }
}

export async function getCurrentUser() {
  return fetchJson("/auth/me/");
}

export async function getRegions() {
  return fetchJson("/regions/");
}

export async function getGuides() {
  return fetchJson("/guides/");
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

export async function getFeaturedRoutes() {
  return getRoutes({ featured: "true" });
}

export async function getRouteDetail(slug) {
  return fetchJson(`/routes/${slug}/`);
}

export async function getRouteWeather(slug) {
  return fetchJson(`/routes/${slug}/weather/`);
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

export async function createBooking(payload) {
  await ensureCsrf();
  return sendJson("/bookings/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function amendBooking(bookingId, payload) {
  await ensureCsrf();
  return sendJson(`/my-bookings/${bookingId}/amend/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getMyBookings() {
  return fetchJson("/my-bookings/");
}

export async function cancelBooking(bookingId) {
  await ensureCsrf();
  return sendJson(`/my-bookings/${bookingId}/cancel/`, {
    method: "PATCH",
    body: JSON.stringify({}),
  });
}

export async function refundBooking(bookingId) {
  await ensureCsrf();
  return sendJson(`/my-bookings/${bookingId}/refund/`, {
    method: "PATCH",
    body: JSON.stringify({}),
  });
}

export async function archiveBooking(bookingId) {
  await ensureCsrf();
  return sendJson(`/my-bookings/${bookingId}/archive/`, {
    method: "PATCH",
    body: JSON.stringify({}),
  });
}

export async function createContactMessage(payload) {
  await ensureCsrf();
  return sendJson("/contact/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createCheckoutSession(bookingId) {
  await ensureCsrf();
  return sendJson("/payments/create-checkout-session/", {
    method: "POST",
    body: JSON.stringify({
      booking_id: bookingId,
    }),
  });
}

export async function getCheckoutSession(sessionId) {
  return fetchJson(`/payments/checkout-session/${sessionId}/`);
}