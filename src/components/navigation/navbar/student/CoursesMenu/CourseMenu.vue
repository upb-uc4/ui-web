<template>
    <base-menu>
        <template #hook>Courses</template>
        <template #content>
            <div class="absolute left-0 lg:-left-16 lg:w-160 mt-4 z-30 lg:z-10 bg-white shadow-md rounded-lg overflow-hidden border">
                <menu-body />
                <menu-footer />
            </div>
        </template>
    </base-menu>
</template>

<script lang="ts">
    import BaseMenu from "@/components/navigation/navbar/common/BaseMenu.vue";
    import MenuBody from "./CourseMenuBody.vue";
    import MenuFooter from "./CourseMenuFooter.vue";

    export default {
        components: {
            BaseMenu,
            MenuBody,
            MenuFooter,
        },
    };
</script>
