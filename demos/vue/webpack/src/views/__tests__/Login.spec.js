import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import { createPinia } from "pinia";
import Login from "../Login.vue";

describe("Login.vue", () => {
  it("renders login form", () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: "/", component: Login }],
    });

    const wrapper = mount(Login, {
      global: {
        plugins: [router, createPinia()],
      },
    });

    expect(wrapper.find("h1").text()).toBe("RTM SDK Demo");
    expect(wrapper.find("button").text()).toBe("Login to App");
    expect(wrapper.find('input[type="radio"][value="teacher"]').exists()).toBe(
      true,
    );
    expect(wrapper.find('input[type="radio"][value="student"]').exists()).toBe(
      true,
    );
  });
});
