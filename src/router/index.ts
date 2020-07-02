import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/common/Login.vue";
import StudentHomeView from "../views/student/Home.vue";
import LecturerHomeView from "../views/lecturer/Home.vue";
import AdminHomeView from "../views/admin/Home.vue"
import LecturerEditCreateCourseView from '../views/lecturer/EditCreateCourseForm.vue';
import AdminCreateAccountView from '../views/admin/CreateAccountForm.vue';
import Redirect from "../views/common/Redirect.vue"


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
			path: "/admin",
			component: AdminHomeView,
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
			path: "/",
			component: LoginView,
		},
		{
			path: "/createAccount",
			props: {editMode:false},
			component: AdminCreateAccountView
		},
		{
			path: "/editAccount/:username",
			props: {editMode:true},
			component: AdminCreateAccountView
		},
		{
			path: "/redirect",
			component: Redirect,
		}
	],

	scrollBehavior(to,from,savedPosition) {
		if(savedPosition) {
			return savedPosition;
		}
		return { x:0, y:0 }
	}
});

export default router;
