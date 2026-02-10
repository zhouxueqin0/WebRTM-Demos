import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";

describe("Login", () => {
  it("renders login form", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );
    expect(screen.getByText("RTM SDK Demo")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /login to app/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("User ID")).toBeInTheDocument();
    expect(screen.getByLabelText("Teacher")).toBeInTheDocument();
    expect(screen.getByLabelText("Student")).toBeInTheDocument();
  });
});
