<template>
    <suspense>
        <template #default>
            <private-profile v-if="isPrivate" />
            <public-profile v-else />
        </template>
        <template #fallback>
            <loading-component />
        </template>
    </suspense>
</template>

<script lang="ts">
    import PrivateProfile from "../../views/common/PrivateProfile.vue";
    import PublicProfile from "../../views/common/PublicProfile.vue";
    import { store } from "@/store/store";
    import { Role } from "@/entities/Role";
    import LoadingComponent from "../../components/loading/Spinner.vue";
    import { checkPrivilege } from "@/use/PermissionHelper";

    export default {
        components: {
            PrivateProfile,
            PublicProfile,
            LoadingComponent,
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
        props: {
            isPrivate: {
                required: true,
                type: Boolean,
            },
        },
    };
</script>
