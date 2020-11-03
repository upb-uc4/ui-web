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
    import PrivateProfile from "@/views/common/PrivateProfile.vue";
    import PublicProfile from "@/views/common/PublicProfile.vue";
    import { store } from "@/use/store/store";
    import { Role } from "@/entities/Role";
    import LoadingComponent from "@/components/common/loading/Spinner.vue";
    import { checkPrivilege } from "@/use/helpers/PermissionHelper";
    import { paths } from "@/use/router/paths";

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
                return next(paths.LOGIN_PAGE);
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
