import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Swal from 'sweetalert2';
import router from './router';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App);

app.config.globalProperties.$swal = Swal;
app.use(router).use(pinia).mount('#app');

