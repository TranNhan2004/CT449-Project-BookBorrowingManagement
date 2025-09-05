import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import { authRoutes } from './auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  ...authRoutes
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const isAuthenticated = !!localStorage.getItem('user');

  if (requiresAuth && !isAuthenticated) {
    next('/auth/login');
  } else {
    next();
  }
});

export default router;
