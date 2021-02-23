<template>
    <section class="flex flex-col px-2 pt-3 pb-1">
        <ul class="w-full px-2">
            <li class="mb-2">
                <menu-item
                    id="nav_mobile_lecturer_menu_exams_my_exams"
                    title="Courses"
                    icon-class="fas fa-list-alt"
                    target-route-name="exams.list"
                />
            </li>
            <li class="mb-2">
                <menu-item
                    id="nav_mobile_lecturer_menu_exams_create"
                    title="Create Exam"
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
        name: "MobileLecturerExamsMenuBody",
        components: {
            MenuItem,
        },
    };
</script>
