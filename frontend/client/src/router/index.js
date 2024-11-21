import { createWebHistory, createRouter } from 'vue-router';
import HomePage from '@/views/HomePage.vue';

import NotFound from '@/views/error/NotFound.vue';
import ServerError from '@/views/error/ServerError.vue';
import ForbiddenPage from '@/views/error/ForbiddenPage.vue';

import SignupPage from '@/views/book.accounts/auth/SignupPage.vue';
import LoginPage from '@/views/book.accounts/auth/LoginPage.vue';

import ProfilePage from '@/views/personal/ProfilePage.vue';
import ProfileEdit from '@/views/personal/ProfileEdit.vue';
import PasswordChange from '@/views/personal/PasswordChange.vue';

import bookRoutes from './book.data/book.route';

import reservationRoutes from './book.services/reservation.route';
import bookBorrowingRoutes from './book.services/bookBorrowing.route';
import favoriteRoutes from './book.services/favorite.route';

import { useReaderStore } from '@/stores/reader.store';


const routes = [
  {
    path: '/login',
    name: 'login-page',
    component: LoginPage,
  },
  {
    path: '/signup',
    name:'signup-page',
    component: SignupPage,
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
  {
    path: '/profile',
    name: 'profile-page',
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/edit',
    name: 'profile-edit',
    component: ProfileEdit,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/change-password',
    name: 'password-change',
    component: PasswordChange,
    meta: { requiresAuth: true },
  },
  
  ...bookRoutes,

  ...reservationRoutes,
  ...bookBorrowingRoutes,
  ...favoriteRoutes

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const store = useReaderStore();

  if (to.meta.requiresAuth) {
    try {
      await store.initializeAuth();
    
    } catch (err) {
      console.log(err);
      await store.logout();
      return next('/login');  
    }

    if (!store.isAuth()) {
      return next('/login'); 
    } 

  } 
  
  next(); 
});


export default router;