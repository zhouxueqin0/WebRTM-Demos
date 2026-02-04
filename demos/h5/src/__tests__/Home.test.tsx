import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../pages/Home";

describe("Home Page", () => {
  it("renders hello world message", () => {
    render(<Home />);

    expect(screen.getByText("Hello World")).toBeTruthy();
    expect(screen.getByText("Welcome to RTM SDK Demo")).toBeTruthy();
  });
});
