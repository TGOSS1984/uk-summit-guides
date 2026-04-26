import { describe, expect, it } from "vitest";

function formatPaymentStatus(status) {
  switch (status) {
    case "paid":
      return "Paid";
    case "pending":
      return "Pending";
    case "refund_pending":
      return "Refund pending";
    case "refunded":
      return "Refunded";
    default:
      return status;
  }
}

describe("Account payment status formatting", () => {
  it("formats paid status", () => {
    expect(formatPaymentStatus("paid")).toBe("Paid");
  });

  it("formats refund pending status", () => {
    expect(formatPaymentStatus("refund_pending")).toBe("Refund pending");
  });

  it("formats refunded status", () => {
    expect(formatPaymentStatus("refunded")).toBe("Refunded");
  });

  it("returns unknown statuses unchanged", () => {
    expect(formatPaymentStatus("custom_status")).toBe("custom_status");
  });
});