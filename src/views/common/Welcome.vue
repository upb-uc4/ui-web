<template>
    <base-view>
        <div v-if="busy">
            <loading-spinner />
        </div>
        <div v-else class="flex flex-col items-center justify-center w-full mt-12">
            <h1 class="text-4xl font-semibold text-blue-700 mb-10">Welcome back, {{ name }}!</h1>
            <dashboard />
        </div>
    </base-view>
</template>
<script lang="ts">
    import { useStore } from "@/use/store/store";
    import { ref, onBeforeMount } from "vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import { checkPrivilege } from "@/use/helpers/PermissionHelper";
    import { Role } from "@/entities/Role";
    import Dashboard from "@/components/common/dashboard/Dashboard.vue";
    import BaseView from "@/views/common/BaseView.vue";

    export default {
        name: "WelcomePage",
        components: {
            BaseView,
            LoadingSpinner,
            Dashboard,
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

            onBeforeMount(async () => {
                await getName();
            });

            async function getName() {
                busy.value = true;
                let store = useStore();
                name.value = (await store.getters.user).firstName;
                busy.value = false;
            }

            return {
                name,
                busy,
            };
        },
    };
</script>
