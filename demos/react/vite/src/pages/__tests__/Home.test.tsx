import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../Home";

vi.mock("../../../../../shared/utils/auth", () => ({
  isAuthenticated: () => true,
}));

describe("Home", () => {
  it("renders welcome content", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(
      screen.getByText("Welcome to RTM SDK Demo"),
    ).toBeInTheDocument();
  });
});
