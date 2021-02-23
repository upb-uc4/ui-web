<template>
    <section class="flex flex-col px-2 pt-3 pb-1">
        <ul class="w-full px-2">
            <li class="mb-2">
                <menu-item
                    id="nav_mobile_student_menu_exams_my_exams"
                    title="Exams"
                    icon-class="fas fa-list-alt"
                    target-route-name="exams.list"
                />
            </li>
            <li class="mb-2">
                <menu-item
                    id="nav_mobile_student_menu_exams_result"
                    title="Exam Results"
                    icon-class="fas fa-poll"
                    target-route-name="exams.results"
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
