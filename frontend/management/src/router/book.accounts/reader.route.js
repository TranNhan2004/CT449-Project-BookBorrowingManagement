import ReaderList from '@/views/book.accounts/readers/ReaderList.vue';
import ReaderAdd from '@/views/book.accounts/readers/ReaderAdd.vue';
import ReaderEdit from '@/views/book.accounts/readers/ReaderEdit.vue';

export default [
  {
    path: '/accounts/readers',
    name:'reader-list',
    component: ReaderList,
    meta: { requiresAuth: true }
  },
  {
    path: '/accounts/readers/add',
    name: 'reader-add',
    component: ReaderAdd,
    meta: { requiresAuth: true }
  },
  {
    path: '/accounts/readers/edit/:readerId',
    name: 'reader-edit',
    component: ReaderEdit,
    meta: { requiresAuth: true },
    props: true
  }
]