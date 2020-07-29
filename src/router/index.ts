import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/common/Login.vue";
import StudentHomeView from "../views/student/Home.vue";
import LecturerHomeView from "../views/lecturer/Home.vue";
import AdminHomeView from "../views/admin/Home.vue";
import CourseFormSuspenseWrapper from "../views/lecturer/CourseFormSuspenseWrapper.vue";
import AccountFormSuspenseWrapper from "../views/admin/AccountFormSuspenseWrapper.vue";
import Redirect from "../views/errors/403.vue";
import ProfileWrapper from "../components/profile/Wrapper.vue";
import Settings from "../views/common/Settings.vue";
import PageNotFound from "../views/errors/404.vue";

const routerHistory = createWebHistory(process.env.BASE_URL);
const suffix: string = " | UC4";

const router = createRouter({
    history: routerHistory,
    routes: [
        {
            path: "/login",
            name: "login",
            component: LoginView,
            meta: {
                title: "Login" + suffix,
            },
        },
        {
            path: "/student",
            name: "student.home",
            component: StudentHomeView,
            meta: {
                title: "Home" + suffix,
            },
        },
        {
            path: "/lecturer",
            name: "lecturer.home",
            component: LecturerHomeView,
            meta: {
                title: "Home" + suffix,
            },
        },

        {
            path: "/admin",
            name: "admin.home",
            component: AdminHomeView,
            meta: {
                title: "Home" + suffix,
            },
        },

        {
            path: "/createCourse",
            name: "courseForm.create",
            props: {
                editMode: false,
            },
            component: CourseFormSuspenseWrapper,
            meta: {
                title: "Course Creation" + suffix,
            },
        },
        {
            path: "/editCourse/:id",
            name: "courseForm.edit",
            props: {
                editMode: true,
            },
            component: CourseFormSuspenseWrapper,
            meta: {
                title: "Course Editing" + suffix,
            },
        },
        {
            path: "/user/:username",
            name: "profile.public",
            props: { isPrivate: false },
            component: ProfileWrapper,
            // The page title is set within the component depending on the username
        },
        {
            path: "/profile",
            name: "profile.private",
            props: { isPrivate: true },
            component: ProfileWrapper,
            meta: {
                title: "My Profile" + suffix,
            },
        },
        {
            path: "/",
            name: "home",
            component: LoginView,
            meta: {
                title: "Welcome" + suffix,
            },
        },
        {
            path: "/createAccount",
            name: "accountForm.create",
            props: {
                editMode: false,
            },
            component: AccountFormSuspenseWrapper,
            meta: {
                title: "Account Creation" + suffix,
            },
        },
        {
            path: "/editAccount/:username",
            name: "accountForm.edit",
            props: {
                editMode: true,
            },
            component: AccountFormSuspenseWrapper,
            meta: {
                title: "Account Editing" + suffix,
            },
        },
        {
            path: "/redirect",
            name: "redirect",
            component: Redirect,
            meta: {
                title: "Permission Denied" + suffix,
            },
        },
        {
            path: "/settings",
            name: "settings",
            component: Settings,
            meta: {
                title: "Settings" + suffix,
            },
        },
        {
            path: "/:catchAll(.*)",
            name: "pageNotFound",
            component: PageNotFound,
            meta: {
                title: "404" + suffix,
            },
        },
    ],

    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        return { left: 0, top: 0 };
    },
});

router.beforeEach((to, from, next) => {
    window.document.title = to.meta && to.meta.title ? to.meta.title : "UC4";
    next();
});

export default router;
