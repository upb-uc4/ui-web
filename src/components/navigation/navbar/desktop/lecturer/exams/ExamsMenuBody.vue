<template>
    <section class="flex flex-col lg:flex-row px-8 py-6 -mx-4">
        <ul class="w-full lg:w-1/2 px-2 space-y-4">
            <li>
                <menu-item
                    id="nav_desktop_lecturer_menu_exams_my_exams"
                    title="Exams"
                    description="Existing exams for your courses"
                    icon-class="fas fa-list-alt"
                    target-route-name="exams.list"
                />
            </li>
        </ul>
        <ul class="w-full lg:w-1/2 px-4 space-y-4">
            <li>
                <menu-item
                    id="nav_desktop_lecturer_menu_exams_create"
                    title="Create Exam"
                    description="Create a new exam"
                    icon-class="fas fa-calendar-plus"
                    target-route-name="exams.create"
                />
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
    import MenuItem from "../../common/MenuItem.vue";

    export default {
        name: "CourseMenuBody",
        components: {
            MenuItem,
        },
    };
</script>
