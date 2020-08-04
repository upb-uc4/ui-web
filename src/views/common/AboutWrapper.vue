<template>
    <suspense>
        <template #default>
            <about-page />
        </template>
        <template #fallback>
            <loading-spinner />
        </template>
    </suspense>
</template>
<script lang="ts">
    import AboutPage from "./About.vue";
    import LoadingSpinner from "@/components/loading/Spinner.vue";
    import { checkPrivilege } from "@/use/PermissionHelper";
    import { Role } from "@/entities/Role";
    export default {
        components: {
            AboutPage,
            LoadingSpinner,
        },
    };
</script>
