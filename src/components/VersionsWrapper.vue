<template>
    <suspense>
        <template #default>
            <versions />
        </template>
        <template #fallback>
            <loading-spinner />
        </template>
    </suspense>
</template>
<script lang="ts">
    import Versions from "@/components/Versions.vue";
    import LoadingSpinner from "@/components/loading/Spinner.vue";
    import { checkPrivilege } from "@/use/PermissionHelper";
    import { Role } from "@/entities/Role";
    export default {
        components: {
            Versions,
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
    };
</script>
