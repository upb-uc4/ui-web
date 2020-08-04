<template>
    <div class="flex flex-col items-center justify-center w-full mt-20">
        <h1 class="text-4xl font-semibold text-blue-800">Welcome back, {{ name }}!</h1>
        <div class="flex items-center flex-col mt-5">
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
            <versions class="mt-6" />
        </div>
    </div>
</template>
<script lang="ts">
    import UserManagement from "@/api/UserManagement";
    import CourseManagement from "@/api/CourseManagement";
    import AuthenticationManagement from "@/api/AuthenticationManagement";
    import HyperledgerManagement from "@/api/HyperledgerManagement";
    import HyperledgerCourseManagement from "@/api/HyperledgerCourseManagement";
    import Versions from "@/components/Versions.vue";
    import { useStore } from "@/store/store";
    import { ref } from "vue";
    export default {
        name: "WelcomePage",
        components: {
            Versions,
        },
        async setup() {
            let store = useStore();
            let name = await store.getters.user.firstName;
            return {
                name,
            };
        },
    };
</script>
