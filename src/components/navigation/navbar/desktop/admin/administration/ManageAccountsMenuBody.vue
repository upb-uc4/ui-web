<template>
    <section class="flex flex-col lg:flex-row px-8 py-6 border-b -mx-4">
        <ul class="w-full px-2 space-y-4">
            <li>
                <menu-item
                    id="nav_desktop_admin_menu_manage_accounts_all"
                    title="All Users"
                    description="Show a list of all users"
                    icon-class="fas fa-users"
                    target-route-name="accountlist"
                />
            </li>
            <li>
                <menu-item
                    id="nav_desktop_admin_menu_manage_accounts_create"
                    title="New Account"
                    description="Create a new user"
                    icon-class="fas fa-user-plus"
                    target-route-name="accountForm.create"
                />
            </li>
            <li>
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
        name: "CourseMenuBody",
        components: {
            MenuItem,
        },
    };
</script>
