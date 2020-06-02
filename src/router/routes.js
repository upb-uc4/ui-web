import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/common/Login.vue';
import StudentHomeView from '../views/student/Home.vue';
import LecturerHomeView from '../views/lecturer/Home.vue';
import LecturerCreateCourseView from '../views/lecturer/CreateCourseForm.vue';

const routerHistory = createWebHistory();

const router = createRouter({
    history: routerHistory,
    routes: [
        {
            path: '/login',
            component: LoginView
        },
        {
            path: '/student',
            component: StudentHomeView
        },
        {
            path: '/lecturer',
            component: LecturerHomeView
        },
        {
            path: '/createCourse',
            component: LecturerCreateCourseView
        },
        {
            path: '/',
            component: LoginView
        }
    ]
});

export default router;