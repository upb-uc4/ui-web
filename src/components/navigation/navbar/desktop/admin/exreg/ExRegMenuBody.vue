<template>
    <section class="flex flex-col lg:flex-row px-8 py-6 border-b -mx-4">
        <ul class="w-full px-2">
            <li class="mb-4">
                <menu-item
                    id="nav_desktop_admin_menu_exreg_create"
                    title="Create Exam Regulation"
                    description="Create a new Exam Regulation"
                    icon-class="fas fa-folder-plus"
                    target-route-name="examRegForm"
                />
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
    import MenuItem from "../../common/MenuItem.vue";

    export default {
        name: "ExRegMenuBody",
        components: {
            MenuItem,
        },
    };
</script>
