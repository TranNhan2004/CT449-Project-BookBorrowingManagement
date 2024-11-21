import BookList from "@/views/book.data/books/BookList.vue";
import BookDetail from "@/views/book.data/books/BookDetail.vue";
import BookAdd from "@/views/book.data/books/BookAdd.vue";
import BookEdit from "@/views/book.data/books/BookEdit.vue";

export default [
  {
    path: '/data/books',
    name: 'book-list',
    component: BookList,
    meta: { requiresAuth: true }
  },
  {
    path: '/data/books/:bookId',
    name: 'book-detail',
    component: BookDetail,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/data/books/add',
    name: 'book-add',
    component: BookAdd,
    meta: { requiresAuth: true, allowsPositions: ['admin'] }
  },
  {
    path: '/data/books/edit/:bookId',
    name: 'book-edit',
    component: BookEdit,
    props: true,
    meta: { requiresAuth: true, allowsPositions: ['admin'] }
  }
]