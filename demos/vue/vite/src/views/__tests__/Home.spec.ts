import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import Home from "../Home.vue";

vi.mock("../../../../../shared/utils/auth", () => ({
  isAuthenticated: () => true,
}));

describe("Home.vue", () => {
  it("renders welcome content", () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: "/home", component: Home }],
    });

    const wrapper = mount(Home, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.find("h1").text()).toBe("Hello World");
    expect(wrapper.text()).toContain("Welcome to RTM SDK Demo");
  });
});
