<template>
    <section class="flex flex-col px-2 pt-3 pb-1">
        <ul class="w-full px-2">
            <li>
                <menu-item
                    id="nav_mobile_student_menu_immatriculation"
                    title="Immatrictulation Management"
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
        name: "MobileStudentStudentMenuBody",
        components: {
            MenuItem,
        },
    };
</script>
