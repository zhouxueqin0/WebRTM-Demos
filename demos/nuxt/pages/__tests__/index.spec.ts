import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import IndexPage from "../index.vue";

// Mock router
const mockPush = vi.fn();
vi.mock("#app", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock shared utils
vi.mock("../../shared/utils/auth", () => ({
  mockAppLogin: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../shared/rtm", () => ({
  rtmEventEmitter: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
  },
}));

describe("Login Page", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockPush.mockClear();
  });

  it("renders login form", () => {
    const wrapper = mount(IndexPage);
    expect(wrapper.find("h1").text()).toBe("RTM SDK Demo");
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it("shows error when username is empty", async () => {
    const wrapper = mount(IndexPage);
    await wrapper.find("form").trigger("submit");
    expect(wrapper.find(".error-message").text()).toBe(
      "Please enter a username",
    );
  });
});
