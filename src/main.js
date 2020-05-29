import { createApp } from 'vue';
import App from './App.vue';
import Router from './router/routes';
import Store from './store/store';
import './assets/styles/index.css';

const app = createApp(App);
app.use(Router);
app.use(Store);
app.mount('#app');