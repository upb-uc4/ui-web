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
const prefix: string = "UC4";

const router = createRouter({
    history: routerHistory,
    routes: [
        {
            path: "/login",
            name: "login",
            component: LoginView,
            meta: {
                title: prefix + " - Login",
            },
        },
        {
            path: "/student",
            name: "student.home",
            component: StudentHomeView,
            meta: {
                title: prefix + " - Home",
            },
        },
        {
            path: "/lecturer",
            name: "lecturer.home",
            component: LecturerHomeView,
            meta: {
                title: prefix + " - Home",
            },
        },

        {
            path: "/admin",
            name: "admin.home",
            component: AdminHomeView,
            meta: {
                title: prefix + " - Home",
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
                title: prefix + " - Course Creation",
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
                title: prefix + " - Course Editing",
            },
        },
        {
            path: "/user/:username",
            name: "profile.public",
            props: { isPrivate: false },
            component: ProfileWrapper,
        },
        {
            path: "/profile",
            name: "profile.private",
            props: { isPrivate: true },
            component: ProfileWrapper,
        },
        {
            path: "/",
            name: "home",
            component: LoginView,
            meta: {
                title: prefix + " - Welcome",
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
                title: prefix + " - Account Creation",
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
                title: prefix + " - Account Editing",
            },
        },
        {
            path: "/redirect",
            name: "redirect",
            component: Redirect,
            meta: {
                title: prefix + " - Permission Denied",
            },
        },
        {
            path: "/:catchAll(.*)",
            name: "pageNotFound",
            component: PageNotFound,
            meta: {
                title: prefix + " - 404",
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
