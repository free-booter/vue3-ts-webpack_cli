import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import TodoList from "@/components/TodoList.vue";
import Dashboard from "@/views/Dashboard.vue";
import Statistics from "@/views/Statistics.vue";
import Settings from "@/views/Settings.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: Dashboard,
    },
    {
      path: "/todos",
      name: "todos",
      component: TodoList,
    },
    {
      path: "/statistics",
      name: "statistics",
      component: Statistics,
    },
    {
      path: "/settings",
      name: "settings",
      component: Settings,
    },
  ],
});

export default router;
