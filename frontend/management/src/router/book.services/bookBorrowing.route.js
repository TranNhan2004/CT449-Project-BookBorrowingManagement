import BookBorrowingTable from "@/views/book.services/BookBorrowingTable.vue"

export default [
  {
    path: '/services/book-borrowings',
    name: 'book-borrowing-table',
    component: BookBorrowingTable,
    meta: { requiresAuth: true }
  },
];