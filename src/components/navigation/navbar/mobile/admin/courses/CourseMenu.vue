<template>
    <base-menu>
        <template #hook>Courses</template>
        <template #content>
            <menu-body />
        </template>
    </base-menu>
</template>

<script lang="ts">
    import BaseMenu from "../../common/BaseMenu.vue";
    import MenuBody from "./CourseMenuBody.vue";

    export default {
        name: "MobileLecturerCourseMenu",
        components: {
            BaseMenu,
            MenuBody,
        },
    };
</script>
