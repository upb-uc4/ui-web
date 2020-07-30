<template>
    <div class="flex flex-col justify-center w-full">
        <h1>Welcome, {{ name }}!</h1>
    </div>
</template>
<script lang="ts">
    import UserManagement from "@/api/UserManagement";
    import CourseManagement from "@/api/CourseManagement";
    import AuthenticationManagement from "@/api/AuthenticationManagement";
    //import HyperledgerManagement from "@/api/HyperledgerManagement";
    //import HyperledgerCourseManagement from "@/api/HyperledgerCourseManagement";
    import { useStore } from "@/store/store";
    export default {
        name: "WelcomePage",
        async setup() {
            let store = useStore();
            let name = await store.getters.user.firstName;
            let frontEndVersion = "v" + process.env.VUE_APP_VERSION;

            let authenticationManagement = new AuthenticationManagement();
            let authenticationManagementVersion = await authenticationManagement.getVersion();

            let courseManagement = new CourseManagement();
            let courseManagementVersion = await courseManagement.getVersion();

            let userManagement = new UserManagement();
            let userManagementVersion = await userManagement.getVersion();

            return {
                name,
                frontEndVersion,
                authenticationManagementVersion,
                courseManagementVersion,
                userManagementVersion,
            };
        },
    };
</script>
