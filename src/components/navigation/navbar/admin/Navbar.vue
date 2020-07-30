<template>
    <base-navbar>
        <li>
            <router-link :to="{ name: 'admin.home' }" class="navbar-menu">Home</router-link>
        </li>
        <li>
            <manage-accounts-menu class="navbar-menu" />
        </li>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "@/components/navigation/navbar/common/BaseNavbar.vue";
    import ManageAccountsMenu from "@/components/navigation/navbar/admin/administration/ManageAccountsMenu.vue";

    export default {
        name: "AdminNavbar",
        components: {
            BaseNavbar,
            ManageAccountsMenu,
        },
    };
</script>
