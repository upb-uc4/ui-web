<template>
    <section class="flex flex-col px-2 pt-3 pb-1">
        <ul class="w-full px-2">
            <li class="mb-2">
                <menu-item
                    id="nav_mobile_admin_menu_manage_accounts_all"
                    title="All Users"
                    description="List of all users"
                    icon-class="fas fa-users"
                    target-route-name="accountlist"
                />
            </li>
            <li>
                <menu-item
                    id="nav_mobile_admin_menu_manage_accounts_create"
                    title="New Account"
                    description="Create a new user"
                    icon-class="fas fa-user-plus"
                    target-route-name="accountForm.create"
                />
            </li>
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
    import MenuItem from "@/components/navigation/navbar/mobile/common/MenuItem.vue";

    export default {
        name: "MobileManageAccountsMenuBody",
        components: {
            MenuItem,
        },
    };
</script>
