<template>
    <base-navbar>
        <li>
            <router-link id="nav_desktop_guest_login" :to="{ name: 'login' }" class="navbar-menu">Login</router-link>
        </li>
        <li>
            <router-link id="routeCourseCatalog" :to="{ name: 'courseCatalog' }" class="navbar-menu"> Course Catalog </router-link>
        </li>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "../common/BaseNavbar.vue";

    export default {
        name: "LecturerNavbar",
        components: {
            BaseNavbar,
        },
    };
</script>
