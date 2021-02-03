<template>
    <section class="px-8 py-6 -mx-4">
        <ul class="w-full px-2 space-y-4">
            <div class="flex">
                <li class="w-1/2">
                    <menu-item
                        id="nav_desktop_admin_menu_manage_accounts_all"
                        title="All Users"
                        description="Show every user"
                        icon-class="fas fa-users"
                        target-route-name="accountlist"
                    />
                </li>
                <li class="w-1/2">
                    <menu-item
                        id="nav_desktop_admin_menu_manage_accounts_create"
                        title="New Account"
                        description="Create a new user"
                        icon-class="fas fa-user-plus"
                        target-route-name="accountForm.create"
                    />
                </li>
            </div>
            <div>
                <li>
                    <menu-item
                        id="nav_desktop_admin_menu_exreg_create"
                        title="New Exam Regulation"
                        description="Create a new exam regulation"
                        icon-class="fas fa-folder-plus"
                        target-route-name="examRegForm"
                    />
                </li>
            </div>
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
