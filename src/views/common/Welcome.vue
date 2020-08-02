<template>
    <div class="flex flex-col items-center justify-center w-full mt-20">
        <h1 class="text-4xl font-semibold text-blue-800">Welcome back, {{ name }}!</h1>
        <div class="flex flex-col mt-5">
            <h2 class="text-xl">
                This application is work in progress. If you encounter any problems, please let us know on
                <a
                    target="_blank"
                    class="text-blue-800 cursor-pointer"
                    href="https://github.com/upb-uc4/ui-web/issues/new?assignees=&labels=&template=bug_report.md&title="
                >
                    GitHub
                </a>
                and refer to the version numbers below.
            </h2>
            <p class="mt-2 text-lg">
                Frontend version:
                <a class="text-blue-800 cursor-pointer" target="_blank" href="https://github.com/upb-uc4/ui-web/blob/master/CHANGELOG.md">{{
                    frontEndVersion
                }}</a>
            </p>
            <p class="text-lg">Authentication version: {{ authenticationManagementVersion }}</p>
            <p class="text-lg">Course management version: {{ courseManagementVersion }}</p>
            <p class="text-lg">User management version: {{ userManagementVersion }}</p>
            <p class="text-lg">Hyperledger management version: {{ hyperledgerManagementVersion }}</p>
            <p class="text-lg">Hyperledger course management version: {{ hyperledgerCourseManagementVersion }}</p>
        </div>
    </div>
</template>
<script lang="ts">
    import UserManagement from "@/api/UserManagement";
    import CourseManagement from "@/api/CourseManagement";
    import AuthenticationManagement from "@/api/AuthenticationManagement";
    import HyperledgerManagement from "@/api/HyperledgerManagement";
    import HyperledgerCourseManagement from "@/api/HyperledgerCourseManagement";
    import { useStore } from "@/store/store";
    import { ref } from "vue";
    export default {
        name: "WelcomePage",
        async setup() {
            let store = useStore();
            let name = await store.getters.user.firstName;
            let frontEndVersion = "v" + process.env.VUE_APP_VERSION;

            let authenticationManagementVersion = await AuthenticationManagement.getVersion();

            let courseManagementVersion = await CourseManagement.getVersion();

            let userManagementVersion = await UserManagement.getVersion();

            let hyperledgerManagementVersion = await HyperledgerManagement.getVersion();

            let hyperledgerCourseManagementVersion = await HyperledgerCourseManagement.getVersion();

            return {
                name,
                frontEndVersion,
                authenticationManagementVersion,
                courseManagementVersion,
                userManagementVersion,
                hyperledgerManagementVersion,
                hyperledgerCourseManagementVersion,
            };
        },
    };
</script>
