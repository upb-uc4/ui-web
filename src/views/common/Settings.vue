<template>
    <div class="w-full h-screen mx-auto mt-8 bg-gray-300 lg:mt-16">
        <button id="navigateBack" class="flex items-center mb-4 navigation-link" @click="back">
            <i class="text-xl fas fa-chevron-left" />
            <span class="ml-1 text-sm font-bold">Back</span>
        </button>

        <h1 class="mb-8 text-2xl font-medium text-gray-700">Settings</h1>

        <div>
            <security-section />
        </div>
    </div>
</template>

<script lang="ts">
    import SecuritySection from "@/components/settings/SecuritySection.vue";
    import Router from "@/use/router";
    import { Role } from "@/entities/Role";
    import { checkPrivilege } from "@/use/PermissionHelper";

    export default {
        name: "Settings",
        components: {
            SecuritySection,
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
            function back() {
                Router.back();
            }
            return { back };
        },
    };
</script>
