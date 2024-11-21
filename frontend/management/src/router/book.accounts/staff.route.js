import StaffList from "@/views/book.accounts/staffs/StaffList.vue";
import StaffAdd from "@/views/book.accounts/staffs/StaffAdd.vue";
import StaffEdit from "@/views/book.accounts/staffs/StaffEdit.vue";

export default [
  {
    path: '/accounts/staffs',
    name:'staff-list',
    component: StaffList,
    meta: { requiresAuth: true, allowsPositions: ['admin'] }
  },
  {
    path: '/accounts/staff/add',
    name:'staff-add',
    component: StaffAdd,
    meta: { requiresAuth: true, allowsPositions: ['admin'] }
  },
  {
    path: '/accounts/staff/edit/:staffId',
    name:'staff-edit',
    component: StaffEdit,
    meta: { requiresAuth: true, allowsPositions: ['admin'] },
    props: true
  }
];