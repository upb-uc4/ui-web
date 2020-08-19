<template>
    <base-navbar>
        <li>
            <router-link id="routeLogin" :to="{ name: 'login' }" class="mobile-navbar-menu">Login</router-link>
        </li>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "@/components/navigation/navbar/mobile/common/BaseNavbar.vue";

    export default {
        name: "MobileGuestNavbar",
        components: {
            BaseNavbar,
        },
    };
</script>
