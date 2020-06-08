import { createApp } from 'vue';
import App from './App.vue';
import Router from './router';
import {store} from './store/store';
import './assets/styles/index.css';

const app = createApp(App);
app.use(Router);
app.use(store);
app.mount('#app');