import { createWebHistory, createRouter } from 'vue-router';
import HomePage from '@/views/HomePage.vue';

import NotFound from '@/views/error/NotFound.vue';
import ServerError from '@/views/error/ServerError.vue';
import ForbiddenPage from '@/views/error/ForbiddenPage.vue';
import LoginPage from '@/views/book.accounts/auth/LoginPage.vue';

import authorRoutes from './book.data/author.route';
import publisherRoutes from './book.data/publisher.route';
import topicRoutes from './book.data/topic.route';

import bookRoutes from './book.data/book.route';


import { useStaffStore } from '@/stores/staffStore';


const routes = [
  {
    path: '/login',
    name: 'login-page',
    component: LoginPage,
  },
  {
    path: '/',
    name: 'home-page',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
    meta: { requiresAuth: true },
  },
  {
    path: '/server-error',
    name: 'server-error',
    component: ServerError,
    meta: { requiresAuth: true },
  },
  {
    path: '/forbidden',
    name: 'forbidden-page',
    component: ForbiddenPage,
    meta: { requiresAuth: true },
  },
  ...authorRoutes,
  ...publisherRoutes,
  ...topicRoutes,
  ...bookRoutes,

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const store = useStaffStore();

  if (to.meta.requiresAuth) {
    await store.initializeAuth();

    if (!store.isAuth()) {
      next('/login'); 
    
    } else {
      const staff = store.staff;
      
      if (to.meta.allowsPositions && !to.meta.allowsPositions.includes(staff.position)) {
        next('/forbidden'); 
      } else {
        next(); 
      }
    }

  } else {
    next(); 
  }
});


export default router;