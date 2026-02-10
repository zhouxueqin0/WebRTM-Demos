import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import App from "./App.vue";
import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import Message from "./views/Message.vue";
import More from "./views/More.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Login },
    { path: "/home", component: Home },
    { path: "/message", component: Message },
    { path: "/more", component: More },
  ],
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
