import { RouteRecordRaw } from "vue-router";
import LoginPage from "../views/LoginPage.vue";

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth/login',
    component: LoginPage
  }
];
