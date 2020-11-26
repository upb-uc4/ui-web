import AuthenticationManagement from "@/api/AuthenticationManagement";
import { Role } from "@/entities/Role";
import { checkPrivilege } from "@/use/helpers/PermissionHelper";
import { MutationTypes } from "@/use/store/mutation-types";
import { useStore } from "@/use/store/store";
import AboutPage from "@/views/common/About.vue";
import WelcomePage from "@/views/common/Welcome.vue";
import Redirect from "@/views/errors/403.vue";
import PageNotFound from "@/views/errors/404.vue";
import { createRouter, createWebHistory } from "vue-router";
const LoginView = () => import("@/views/common/Login.vue");
const StudentCourseView = () => import("@/views/student/StudentCourseList.vue");
const AllCourseView = () => import("@/views/common/CourseList.vue");
const AdminAccountListView = () => import("@/views/admin/AdminAccountList.vue");
const CourseForm = () => import("@/views/shared/EditCreateCourseForm.vue");
const AccountForm = () => import("@/views/admin/EditCreateAccountForm.vue");
const PrivateProfile = () => import("@/views/common/PrivateProfile.vue");
const PublicProfile = () => import("@/views/common/PublicProfile.vue");
const Settings = () => import("@/views/common/Settings.vue");

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
            path: "/course-catalog",
            name: "courseCatalog",
            props: { showAllCourses: true },
            component: AllCourseView,
            meta: {
                title: "Course Catalog" + suffix,
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
                title: "Courses" + suffix,
                roles: ["Student"],
            },
        },
        {
            path: "/course-management",
            name: "lecturer.myCourses",
            props: { showAllCourses: false },
            component: AllCourseView,
            meta: {
                title: "My Courses" + suffix,
            },
        },

        {
            path: "/all-courses",
            name: "shared.courses",
            props: { showAllCourses: true },
            component: AllCourseView,
            meta: {
                title: "All Courses" + suffix,
                roles: ["Lecturer", "Admin"],
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
            component: CourseForm,
            meta: {
                title: "Course Creation" + suffix,
                roles: ["Lecturer", "Admin"],
            },
        },
        {
            path: "/editCourse/:id",
            name: "courseForm.edit",
            props: {
                editMode: true,
            },
            component: CourseForm,
            meta: {
                title: "Course Editing" + suffix,
                roles: ["Lecturer", "Admin"],
            },
        },
        {
            path: "/user/:username",
            name: "profile.public",
            component: PublicProfile,
            // The page title is set within the component depending on the username
            meta: {
                roles: ["Admin", "Lecturer", "Student"],
            },
        },
        {
            path: "/profile",
            name: "profile.private",
            component: PrivateProfile,
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
            component: AccountForm,
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
            component: AccountForm,
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

    const store = useStore();

    if (!(await store.getters.loggedIn)) {
        await AuthenticationManagement._getLoginToken();
    }

    if (to.name == "login" || to.name == "home") {
        if (await store.getters.loggedIn) {
            // We need to explicitly set the title here, because the component is not rendered again if going back from "/welcome" to "/login"
            window.document.title = "Welcome" + suffix;
            return next("/welcome");
        }
    }

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

router.afterEach(async (to, from, next) => {
    const store = useStore();
    store.commit(MutationTypes.FORCE_CLOSE_BURGER_MENU);
});

export default router;
