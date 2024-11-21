import AuthorTable from "@/views/book.data/authors/AuthorTable.vue";

export default [
  {
    path: '/data/authors',
    name: 'author-table',
    component: AuthorTable,
    meta: { requiresAuth: true }
  },
]