import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";

vi.mock("../../../../shared/utils/auth", () => ({
  mockAppLogin: vi.fn(),
}));

vi.mock("../../../../shared/rtm", () => ({
  rtmEventEmitter: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
  },
}));

describe("Login", () => {
  it("renders login button", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });
});

