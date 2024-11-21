import BookBorrowingTableOfReader from "@/views/book.services/BookBorrowingTableOfReader.vue";

export default [
  {
    path: '/services/book-borrowings',
    name: 'book-borrowing-table-of-reader',
    component: BookBorrowingTableOfReader,
    meta: { requiresAuth: true }
  },
];