<template>
    <base-menu>
        <template #hook>Exams</template>
        <template #content>
            <menu-body />
        </template>
    </base-menu>
</template>

<script lang="ts">
    import BaseMenu from "../../common/BaseMenu.vue";
    import MenuBody from "./ExamsMenuBody.vue";

    export default {
        name: "MobileLecturerCourseMenu",
        components: {
            BaseMenu,
            MenuBody,
        },
    };
</script>
