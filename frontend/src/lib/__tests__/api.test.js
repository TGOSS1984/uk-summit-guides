import { describe, expect, it } from "vitest";
import { clearAuthToken, getAuthToken, setAuthToken } from "../api";

describe("auth token helpers", () => {
  it("stores and retrieves auth token", () => {
    clearAuthToken();

    setAuthToken("test-token");

    expect(getAuthToken()).toBe("test-token");
  });

  it("clears auth token", () => {
    setAuthToken("test-token");
    clearAuthToken();

    expect(getAuthToken()).toBeNull();
  });
});