import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../Home";

vi.mock("../../../../shared/utils/auth", () => ({
  isAuthenticated: () => true,
}));

describe("Home Page", () => {
  it("renders hello world", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );
    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
  });
});
