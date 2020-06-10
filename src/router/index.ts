import { Course } from './../entities/Course';
import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/common/Login.vue";
import StudentHomeView from "../views/student/Home.vue";
import LecturerHomeView from "../views/lecturer/Home.vue";
import LecturerEditCreateCourseView from '../views/lecturer/EditCreateCourseForm.vue';
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
			props: {editMode:false},
            component: LecturerEditCreateCourseView
		},
		{
			path: '/Test/:id',
			props: {editMode:true},
            component: LecturerEditCreateCourseView
        },
		{
			path: "/",
			component: LoginView,
		},
	],
});

export default router;
