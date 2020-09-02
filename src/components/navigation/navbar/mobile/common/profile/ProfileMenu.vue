<template>
    <base-menu>
        <template #hook>My Profile</template>
        <template #content>
            <menu-body />
        </template>
    </base-menu>
</template>

<script lang="ts">
    import BaseMenu from "../BaseMenu.vue";
    import MenuBody from "./ProfileMenuBody.vue";

    export default {
        name: "MobileProfileMenu",
        components: {
            BaseMenu,
            MenuBody,
        },
    };
</script>
