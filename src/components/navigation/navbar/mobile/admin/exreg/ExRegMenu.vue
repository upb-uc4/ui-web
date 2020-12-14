<template>
    <base-menu>
        <template #hook>Exam Regulations</template>
        <template #content>
            <menu-body />
        </template>
    </base-menu>
</template>

<script lang="ts">
    import BaseMenu from "../../common/BaseMenu.vue";
    import MenuBody from "./ExRegBody.vue";

    export default {
        name: "MobileAdminExRegMenu",
        components: {
            BaseMenu,
            MenuBody,
        },
    };
</script>
