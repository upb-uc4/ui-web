import { Course } from './../entities/Course';
import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/common/Login.vue";
import StudentHomeView from "../views/student/Home.vue";
import LecturerHomeView from "../views/lecturer/Home.vue";
import LecturerEditCreateCourseView from '../views/lecturer/EditCreateCourseForm.vue';
import AdminCreateAccountView from '../views/admin/CreateAccountForm.vue';
import Redirect from "../views/common/Redirect.vue";
import Profile from "../views/student/Profile.vue";


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
			name: 'createCourse',
			props: {editMode:false},
            component: LecturerEditCreateCourseView
		},
		{
			path: '/editCourse/:id',
			props: {editMode:true},
            component: LecturerEditCreateCourseView
        },
		{
			path: '/profile/:id',
			name: 'profile',
			component: Profile
		},
		{
			path: "/",
			component: LoginView,
		},
		{
			path: "/createAccount",
			component: AdminCreateAccountView
		},
		{
			path: "/redirect",
			component: Redirect,
		}
	],
});

export default router;
