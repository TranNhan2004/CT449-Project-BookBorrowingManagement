import PublisherTable from "@/views/book.data/publishers/PublisherTable.vue";

export default [
  {
    path: '/data/publishers',
    name: 'publisher-table',
    component: PublisherTable,
    meta: { requiresAuth: true }
  },
]