import BookList from "@/views/book.data/books/BookList.vue";
import BookDetail from "@/views/book.data/books/BookDetail.vue";

export default [
  {
    path: '/info/books',
    name: 'book-list',
    component: BookList,
    meta: { requiresAuth: true }
  },
  {
    path: '/info/books/:bookId',
    name: 'book-detail',
    component: BookDetail,
    props: true,
    meta: { requiresAuth: true }
  },
]