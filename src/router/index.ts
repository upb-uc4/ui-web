import { Course } from './../entities/Course';
import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/common/Login.vue";
import StudentHomeView from "../views/student/Home.vue";
import LecturerHomeView from "../views/lecturer/Home.vue";
import LecturerCreateCourseView from '../views/lecturer/CreateCourseForm.vue';
import Test from '../components/Test.vue'

const routerHistory = createWebHistory();

const router = createRouter({
	history: routerHistory,
	routes: [
		{
			path: "/login",
			component: LoginView,
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
			name: 'createEditCourse',
			props: true,
            component: LecturerCreateCourseView
		},
		{
			path: '/Test',
			name: 'test',
			props: true,
            component: Test
        },
		{
			path: "/",
			component: LoginView,
		},
	],
});

export default router;
