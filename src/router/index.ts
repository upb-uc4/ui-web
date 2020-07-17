import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/common/Login.vue";
import StudentHomeView from "../views/student/Home.vue";
import LecturerHomeView from "../views/lecturer/Home.vue";
import AdminHomeView from "../views/admin/Home.vue";
import CourseFormSuspenseWrapper from "../views/lecturer/CourseFormSuspenseWrapper.vue";
import AccountFormSuspenseWrapper from "../views/admin/AccountFormSuspenseWrapper.vue";
import Redirect from "../views/common/Redirect.vue";
import ProfileWrapper from "../components/profile/Wrapper.vue";
import PageNotFound from "../views/errors/404.vue";

const routerHistory = createWebHistory(process.env.BASE_URL);

const router = createRouter({
	history: routerHistory,
	routes: [
		{
			path: "/login",
			name: "login",
			component: LoginView,
		},
		{
			path: "/student",
			name: "student.home",
			component: StudentHomeView,
		},
		{
			path: "/lecturer",
			name: "lecturer.home",
			component: LecturerHomeView,
		},

		{
			path: "/admin",
			name: "admin.home",
			component: AdminHomeView,
		},

		{
			path: "/createCourse",
			name: "courseForm.create",
			props: {
				editMode:false,
			},
            component: CourseFormSuspenseWrapper
		},
		{
			path: "/editCourse/:id",
			name: "courseForm.edit",
			props: {
				editMode:true,
			},
            component: CourseFormSuspenseWrapper
        },
		{
			path: "/user/:username",
			name: "profile.public",
			props: {isPrivate: false},
			component: ProfileWrapper
		},
		{
			path: "/profile",
			name: "profile.private",
			props: {isPrivate: true},
			component: ProfileWrapper
		},
		{
			path: "/",
			name: "home",
			component: LoginView,
		},
		{
			path: "/createAccount",
			name: "accountForm.create",
			props: {
				editMode:false,
			},
			component: AccountFormSuspenseWrapper
		},
		{
			path: "/editAccount/:username",
			name: "accountForm.edit",
			props: {
				editMode:true,
			},
			component: AccountFormSuspenseWrapper
		},
		{
			path: "/redirect",
			name: "redirect",
			component: Redirect,
		},
		{
			path: "/:catchAll(.*)",
			name: "pageNotFound",
			component: PageNotFound,
		}
	],

	scrollBehavior(to, from, savedPosition) {
		if(savedPosition) {
			return savedPosition;
		}
		return { left:0, top:0 }
	}
});

export default router;
