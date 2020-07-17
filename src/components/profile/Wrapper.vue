<template>
    <suspense>
        <template #default>
            <private-profile v-if="isPrivate" />
            <public-profile v-else />
        </template>
        <template #fallback>
            <p class="text-center text-lg pt-20">
                Loading Profile...
            </p>
        </template>
    </suspense>
</template>

<script lang="ts">
    import PrivateProfile from "../../views/common/PrivateProfile.vue";
    import PublicProfile from "../../views/common/PublicProfile.vue";
    import { store } from "@/store/store";
    import { Role } from "@/entities/Role";

    export default {
        components: {
            PrivateProfile,
            PublicProfile,
        },
        beforeRouteEnter(_from: any, _to: any, next: any) {
            const myRole = store.state.myRole;
            if (myRole == Role.NONE) {
                return next("/redirect");
            }
            return next();
        },
        props: {
            isPrivate: {
                required: true,
                type: Boolean,
            },
        },
    };
</script>
