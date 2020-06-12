import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/common/Login.vue";
import StudentHomeView from "../views/student/Home.vue";
import LecturerHomeView from "../views/lecturer/Home.vue";
import LecturerCreateCourseView from '../views/lecturer/CreateCourseForm.vue';
import AdminCreateAccountView from '../views/admin/CreateAccountForm.vue';
import Login from "../views/common/Login2.vue";

const routerHistory = createWebHistory();

const router = createRouter({
	history: routerHistory,
	routes: [
		{
			path: "/login",
			component: LoginView,
		},
		{
			path: "/login2",
			component: Login
		},
		{
			path: "/student",
			component: StudentHomeView,
		},
		{
			path: "/lecturer",
			component: LecturerHomeView,
		},
		{
            path: '/createCourse',
            component: LecturerCreateCourseView
        },
		{
			path: "/",
			component: LoginView,
		},
	],
});

export default router;
