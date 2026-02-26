import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Home from "../pages/Home.vue";
import Message from "../pages/Message.vue";
import More from "../pages/More.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
    },
    {
      path: "/home",
      name: "Home",
      component: Home,
    },
    {
      path: "/message",
      name: "Message",
      component: Message,
    },
    {
      path: "/more",
      name: "More",
      component: More,
    },
  ],
});

export default router;
