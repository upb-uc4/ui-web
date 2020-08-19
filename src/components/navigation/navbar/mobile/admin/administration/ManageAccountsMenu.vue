<template>
    <base-menu>
        <template #hook>Administration</template>
        <template #content>
            <menu-body />
        </template>
    </base-menu>
</template>

<script lang="ts">
    import BaseMenu from "../../common/BaseMenu.vue";
    import MenuBody from "./ManageAccountsMenuBody.vue";

    export default {
        components: {
            BaseMenu,
            MenuBody,
        },
    };
</script>
