<template>
    <div class="flex flex-col items-center justify-center w-full mt-20">
        <h1 class="text-4xl font-semibold text-blue-800">Welcome back, {{ name }}!</h1>
        <div class="flex flex-col items-center mt-5">
            <h2 class="text-xl">
                This application is work in progress. If you encounter any problems, please contact us via one of our communication
                channels. These channels, as well as detailed information of versions of the individual services and a linked Github bug
                report template can be found
                <a>
                    <router-link
                        id="routeAboutLink"
                        :to="{ name: 'about' }"
                        class="font-semibold text-blue-800 hover:text-blue-900 hover:underline"
                    >
                        here
                    </router-link>
                </a>
                .
            </h2>
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
            return {
                name,
            };
        },
    };
</script>
