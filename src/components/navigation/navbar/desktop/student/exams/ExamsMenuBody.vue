<template>
    <section class="flex flex-col lg:flex-row px-8 py-6 -mx-4">
        <ul class="w-full px-2">
            <li>
                <menu-item
                    id="nav_desktop_student_menu_exams_my_exams"
                    title="Exams"
                    description="Existing exams for your courses"
                    icon-class="fas fa-list-alt"
                    target-route-name="exams.list"
                />
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
    import MenuItem from "../../common/MenuItem.vue";

    export default {
        name: "ExamMenuBody",
        components: {
            MenuItem,
        },
    };
</script>
