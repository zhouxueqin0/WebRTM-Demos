import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/dom";

describe("H5 App", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
  });

  it("renders login button initially", async () => {
    await import("../main");
    const button = screen.getByRole("button", { name: /login/i });
    expect(button).toBeTruthy();
  });
});
