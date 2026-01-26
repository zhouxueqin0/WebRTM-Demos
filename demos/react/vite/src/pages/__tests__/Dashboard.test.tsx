import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Dashboard from "../Dashboard";

describe("Dashboard", () => {
  it("renders Hello World", () => {
    render(<Dashboard />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("has correct heading", () => {
    render(<Dashboard />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Hello World");
  });
});
