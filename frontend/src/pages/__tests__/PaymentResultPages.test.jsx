import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PaymentCancelledPage from "../PaymentCancelledPage";
import PaymentSuccessPage from "../PaymentSuccessPage";
import { getCheckoutSession } from "../../lib/api";

vi.mock("../../lib/api", () => ({
  getCheckoutSession: vi.fn(),
}));

vi.mock("../../components/ui/Reveal", () => ({
  default: ({ children }) => <>{children}</>,
}));

function renderSuccessPage(initialEntry = "/payment-success?session_id=cs_test_123") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
      </Routes>
    </MemoryRouter>
  );
}

function renderCancelledPage() {
  return render(
    <MemoryRouter initialEntries={["/payment-cancelled"]}>
      <Routes>
        <Route path="/payment-cancelled" element={<PaymentCancelledPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("PaymentSuccessPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and displays checkout session details", async () => {
    getCheckoutSession.mockResolvedValue({
      booking_reference: "ABC1234567",
      route_name: "Ben Nevis via CMD Arête",
      route_region: "Scotland",
      tour_date: "2026-05-12",
      tour_time: "06:00:00",
      amount_total: 14500,
      currency: "gbp",
      payment_status: "paid",
    });

    renderSuccessPage();

    expect(screen.getByText(/loading payment details/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("ABC1234567")).toBeInTheDocument();
    });

    expect(screen.getByText("Ben Nevis via CMD Arête")).toBeInTheDocument();
    expect(screen.getByText("Scotland")).toBeInTheDocument();
    expect(screen.getByText("£145.00")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(
        screen.getByText("Confirmation email", { selector: "strong" })
    ).toBeInTheDocument();
    expect(screen.getByText(/view account/i)).toBeInTheDocument();
  });

  it("shows an error if session id is missing", async () => {
    renderSuccessPage("/payment-success");

    await waitFor(() => {
      expect(screen.getByText("Missing Stripe session ID.")).toBeInTheDocument();
    });

    expect(getCheckoutSession).not.toHaveBeenCalled();
  });

  it("shows a friendly message if checkout session cannot load", async () => {
    getCheckoutSession.mockRejectedValue({
      data: {
        detail: "Checkout session not found.",
      },
    });

    renderSuccessPage();

    await waitFor(() => {
      expect(screen.getByText("Checkout session not found.")).toBeInTheDocument();
    });

    expect(
      screen.getByText(/you can still return to your account/i)
    ).toBeInTheDocument();
  });
});

describe("PaymentCancelledPage", () => {
  it("renders cancelled checkout guidance", () => {
    renderCancelledPage();

    expect(
      screen.getByText(/your stripe checkout was not completed/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/return to your account/i)).toBeInTheDocument();
    expect(screen.getByText(/browse routes/i)).toBeInTheDocument();
  });
});