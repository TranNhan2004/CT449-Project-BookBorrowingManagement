import FavoriteTableOfReader from "@/views/book.services/FavoriteTableOfReader.vue";

export default [
  {
    path: '/services/favorites',
    name: 'favorite-table-of-reader',
    component: FavoriteTableOfReader,
    meta: { requiresAuth: true }
  }
]