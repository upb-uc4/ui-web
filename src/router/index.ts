import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/common/Login.vue";
import StudentCourseView from "../views/student/StudentCourseList.vue";
import LecturerCourseView from "../views/lecturer/LecturerCourseList.vue";
import AdminAccountListView from "../views/admin/AdminAccountList.vue";
import CourseFormSuspenseWrapper from "../views/lecturer/EditCreateCourseForm.vue";
import AccountFormSuspenseWrapper from "../views/admin/EditCreateAccountForm.vue";
import Redirect from "../views/errors/403.vue";
import ProfileWrapper from "../components/profile/Wrapper.vue";
import Settings from "../views/common/Settings.vue";
import PageNotFound from "../views/errors/404.vue";
import WelcomePage from "../views/common/Welcome.vue";
import AboutPage from "../views/common/About.vue";
import { checkPrivilege } from "@/use/PermissionHelper";
import { Role } from "@/entities/Role";

const routerHistory = createWebHistory(process.env.BASE_URL);
const suffix: string = " | UC4";

const router = createRouter({
    history: routerHistory,
    routes: [
        {
            path: "/welcome",
            name: "welcome",
            component: WelcomePage,
            meta: {
                title: "Welcome" + suffix,
                roles: ["Admin", "Lecturer", "Student"],
            },
        },
        {
            path: "/about",
            name: "about",
            component: AboutPage,
            meta: {
                title: "About" + suffix,
            },
        },
        {
            path: "/login",
            name: "login",
            component: LoginView,
            meta: {
                title: "Login" + suffix,
            },
        },
        {
            path: "/courses",
            name: "student.courses",
            component: StudentCourseView,
            meta: {
                title: "Home" + suffix,
                roles: ["Student"],
            },
        },
        {
            path: "/course-management",
            name: "lecturer.courses",
            component: LecturerCourseView,
            meta: {
                title: "Courses" + suffix,
                roles: ["Lecturer"],
            },
        },

        {
            path: "/accounts",
            name: "accountlist",
            component: AdminAccountListView,
            meta: {
                title: "Accounts" + suffix,
                roles: ["Admin"],
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
                roles: ["Lecturer"],
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
                roles: ["Lecturer"],
            },
        },
        {
            path: "/user/:username",
            name: "profile.public",
            props: { isPrivate: false },
            component: ProfileWrapper,
            // The page title is set within the component depending on the username
            meta: {
                roles: ["Admin", "Lecturer", "Student"],
            },
        },
        {
            path: "/profile",
            name: "profile.private",
            props: { isPrivate: true },
            component: ProfileWrapper,
            meta: {
                title: "My Profile" + suffix,
                roles: ["Admin", "Lecturer", "Student"],
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
                roles: ["Admin"],
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
                roles: ["Admin"],
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
                roles: ["Admin", "Lecturer", "Student"],
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

router.beforeEach(async (to, from, next) => {
    window.document.title = to.meta && to.meta.title ? to.meta.title : "UC4";

    const roles: Role[] = to.meta.roles;

    if (roles == undefined || roles.length == 0) {
        return next();
    }

    const response = await checkPrivilege(...roles);
    if (response.allowed) {
        return next();
    }
    if (!response.authenticated) {
        return next("/login");
    }

    return next("/redirect");
});

export default router;
