import './styles.css';
import { createApp } from 'vue';
import App from './app/App.vue';
import router from './app/routers';

const app = createApp(App);
app.use(router);
app.mount('#root');
