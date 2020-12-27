<template>
    <section class="flex flex-col lg:flex-row px-8 py-6 -mx-4">
        <ul class="w-full px-2">
            <li class="">
                <menu-item
                    id="nav_desktop_student_menu_study_immatriculation"
                    title="Immatrictulation"
                    description="Detailed Status Report"
                    icon-class="fas fa-clipboard-list"
                    target-route-name="student.immatriculation"
                />
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
    import MenuItem from "../../common/MenuItem.vue";

    export default {
        name: "StudyMenuBody",
        components: {
            MenuItem,
        },
    };
</script>
