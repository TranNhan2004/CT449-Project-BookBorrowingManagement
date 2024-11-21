import ReservationTable from "@/views/book.services/ReservationTable.vue";

export default [
  {
    path: '/services/reservations',
    name:'reservation-table',
    component: ReservationTable,
    meta: { requiresAuth: true }
  }
]