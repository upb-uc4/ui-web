import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/Login.vue';
import HomeView from '../views/Home.vue';

const routerHistory = createWebHistory();

const router = createRouter({
    history: routerHistory,
    routes: [
        {
            path: '/login',
            component: LoginView
        },
        {
            path: '/',
            component: HomeView
        }
    ]
});

export default router;