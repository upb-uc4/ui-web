import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/common/Login.vue";
import StudentHomeView from "../views/student/Home.vue";
import LecturerHomeView from "../views/lecturer/Home.vue";
import AdminHomeView from "../views/admin/Home.vue"
import LecturerEditCreateCourseView from '../views/lecturer/EditCreateCourseForm.vue';
import AdminEditCreateAccountView from '../views/admin/EditCreateAccountForm.vue';
import Redirect from "../views/common/Redirect.vue"
import Profile from "../views/common/Profile.vue";


const routerHistory = createWebHistory(process.env.BASE_URL);

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
			props: {editMode:false},
			component: AdminEditCreateAccountView
		},
		{
			path: "/editAccount/:username",
			props: {editMode:true},
			component: AdminEditCreateAccountView
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
