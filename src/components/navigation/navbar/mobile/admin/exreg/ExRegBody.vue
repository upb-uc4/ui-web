<template>
    <section class="flex flex-col px-2 pt-3 pb-1">
        <ul class="w-full px-2">
            <li>
                <menu-item
                    id="nav_mobile_admin_menu_exreg_create"
                    title="Create Exam Regulation"
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
        name: "MobileAdminExRegMenuBody",
        components: {
            MenuItem,
        },
    };
</script>
