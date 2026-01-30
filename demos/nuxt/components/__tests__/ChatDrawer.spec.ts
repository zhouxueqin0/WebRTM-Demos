import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import ChatDrawer from "../ChatDrawer.vue";

describe("ChatDrawer", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders drawer when open", () => {
    const wrapper = mount(ChatDrawer, {
      props: {
        state: {
          isOpen: true,
          mode: "private",
          targetId: "test_user",
          targetName: "Test User",
        },
        currentUserId: "me",
      },
    });

    expect(wrapper.find(".drawer").classes()).toContain("open");
    expect(wrapper.find(".header-title").text()).toContain("Test User");
  });

  it("does not render drawer when closed", () => {
    const wrapper = mount(ChatDrawer, {
      props: {
        state: {
          isOpen: false,
          mode: "private",
          targetId: "test_user",
          targetName: "Test User",
        },
        currentUserId: "me",
      },
    });

    expect(wrapper.find(".drawer").classes()).not.toContain("open");
  });
});
