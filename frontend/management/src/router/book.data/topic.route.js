import TopicTable from "@/views/book.data/topics/TopicTable.vue";

export default [
  {
    path: '/data/topics',
    name: 'topic-table',
    component: TopicTable,
    meta: { requiresAuth: true }
  },
]