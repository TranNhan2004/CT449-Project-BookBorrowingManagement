import ReservationTableOfReader from "@/views/book.services/ReservationTableOfReader.vue";

export default [
  {
    path: '/services/reservations',
    name:'reservation-table-of-reader',
    component: ReservationTableOfReader,
    meta: { requiresAuth: true }
  }
]