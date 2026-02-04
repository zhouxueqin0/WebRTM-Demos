import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "jotai";
import Login from "../pages/Login";

describe("Login Page", () => {
  it("renders login form", () => {
    render(
      <Provider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByText("RTM SDK Demo")).toBeTruthy();
    expect(screen.getByLabelText("User ID")).toBeTruthy();
    expect(screen.getByLabelText("User Role")).toBeTruthy();
    expect(screen.getByRole("button", { name: /login to app/i })).toBeTruthy();
  });

  it("renders role selection radio buttons", () => {
    render(
      <Provider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>,
    );

    const teacherRadio = screen.getByLabelText("Teacher");
    const studentRadio = screen.getByLabelText("Student");

    expect(teacherRadio).toBeTruthy();
    expect(studentRadio).toBeTruthy();
  });
});
