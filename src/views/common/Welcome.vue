<template>
    <div v-if="!busy" class="flex flex-col items-center justify-center w-full mt-20">
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
    <div v-else>
        <loading-spinner />
    </div>
</template>
<script lang="ts">
    import UserManagement from "@/api/UserManagement";
    import CourseManagement from "@/api/CourseManagement";
    import AuthenticationManagement from "@/api/AuthenticationManagement";
    import HyperledgerManagement from "@/api/HyperledgerManagement";
    import HyperledgerCourseManagement from "@/api/HyperledgerCourseManagement";
    import { useStore } from "@/store/store";
    import { ref, onBeforeMount } from "vue";
    import LoadingSpinner from "@/components/loading/Spinner.vue";
    import { checkPrivilege } from "@/use/PermissionHelper";
    import { Role } from "@/entities/Role";

    export default {
        name: "WelcomePage",
        components: {
            LoadingSpinner,
        },

        async beforeRouteEnter(_from: any, _to: any, next: any) {
            const response = await checkPrivilege(Role.LECTURER, Role.STUDENT, Role.ADMIN);

            if (response.allowed) {
                return next();
            }
            if (!response.authenticated) {
                return next("/login");
            }

            return next("/redirect");
        },

        setup() {
            let busy = ref(false);
            let name = ref("");

            onBeforeMount(() => {
                getName();
            });
            
            async function getName() {
                busy.value = true;
                let store = useStore();
                name.value = await store.getters.user.firstName;
                busy.value = false;
            }

            return {
                name,
                busy,
            };
        },
    };
</script>
