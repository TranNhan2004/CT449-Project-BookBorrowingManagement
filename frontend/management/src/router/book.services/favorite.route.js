import FavoriteTable from "@/views/book.services/FavoriteTable.vue";

export default [
  {
    path: '/services/favorites',
    name: 'favorite-table',
    component: FavoriteTable,
    meta: { requiresAuth: true }
  }
]