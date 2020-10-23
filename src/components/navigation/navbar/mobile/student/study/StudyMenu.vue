<template>
    <base-menu>
        <template #hook>Study</template>
        <template #content>
            <menu-body />
        </template>
    </base-menu>
</template>

<script lang="ts">
    import BaseMenu from "../../common/BaseMenu.vue";
    import MenuBody from "./StudyMenuBody.vue";

    export default {
        name: "MobileStudentStudyMenu",
        components: {
            BaseMenu,
            MenuBody,
        },
    };
</script>
