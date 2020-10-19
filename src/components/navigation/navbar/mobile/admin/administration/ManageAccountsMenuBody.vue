<template>
    <section class="flex flex-col px-2 pt-3 pb-1">
        <ul class="w-full px-2">
            <li class="mb-2">
                <menu-item
                    id="nav_mobile_admin_menu_manage_accounts_all"
                    title="All Users"
                    description="List of all users"
                    icon-class="fa-globe-americas"
                    target-route-name="accountlist"
                />
            </li>
            <li>
                <menu-item
                    id="nav_mobile_admin_menu_manage_accounts_create"
                    title="New Account"
                    description="Create a new user"
                    icon-class="fa-star"
                    target-route-name="accountForm.create"
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
