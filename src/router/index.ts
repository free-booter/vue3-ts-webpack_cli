import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/todos",
    name: "Todos",
    component: () => import("@/views/TodoList.vue"),
  },
  {
    path: "/archive",
    name: "Archive",
    component: () => import("@/views/TaskArchive.vue"),
  },
  {
    path: "/categories",
    name: "Categories",
    component: () => import("@/views/CategoryManagement.vue"),
  },
  {
    path: "/statistics",
    name: "Statistics",
    component: () => import("@/views/Statistics.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("@/views/Settings.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
