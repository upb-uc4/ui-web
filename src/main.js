import { createApp } from 'vue';
import App from './App.vue';
import Router from './router/routes.js';
import './assets/styles/index.css';

const app = createApp(App);
app.use(Router);
app.mount('#app');