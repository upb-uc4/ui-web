<template>
    <base-navbar>
        <li>
            <router-link id="nav_mobile_guest_login" :to="{ name: 'login' }" class="rounded-lg hover:bg-blue-800 mobile-navbar-menu">
                Login
            </router-link>
        </li>
        <li>
            <router-link
                id="nav_mobile_common_course_catalog"
                :to="{ name: 'courseCatalog' }"
                class="hover:bg-blue-800 rounded-lg mobile-navbar-menu"
            >
                Course Catalog
            </router-link>
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
