<template>
    <div v-if="role === Role.ADMIN">
        <admin-navbar-desktop class="hidden md:flex" />
        <admin-navbar-mobile class="flex md:hidden" />
    </div>
    <div v-else-if="role === Role.LECTURER">
        <lecturer-navbar-desktop class="hidden md:flex" />
        <lecturer-navbar-mobile class="flex md:hidden" />
    </div>
    <div v-else-if="role === Role.STUDENT">
        <student-navbar-desktop class="hidden md:flex" />
        <student-navbar-mobile class="flex md:hidden" />
    </div>
    <div v-else>
        <guest-navbar-desktop class="hidden md:flex" />
        <guest-navbar-mobile class="flex md:hidden" />
    </div>
</template>

<script lang="ts">
    import GuestNavbarDesktop from "@/components/navigation/navbar/desktop/guest/Navbar.vue";
    import GuestNavbarMobile from "@/components/navigation/navbar/mobile/guest/Navbar.vue";
    import AdminNavbarDesktop from "@/components/navigation/navbar/desktop/admin/Navbar.vue";
    import AdminNavbarMobile from "@/components/navigation/navbar/mobile/admin/Navbar.vue";
    import StudentNavbarDesktop from "@/components/navigation/navbar/desktop/student/Navbar.vue";
    import StudentNavbarMobile from "@/components/navigation/navbar/mobile/student/Navbar.vue";
    import LecturerNavbarDesktop from "@/components/navigation/navbar/desktop/lecturer/Navbar.vue";
    import LecturerNavbarMobile from "@/components/navigation/navbar/mobile/lecturer/Navbar.vue";
    import { Role } from "@/entities/Role";
    import { useStore } from "@/store/store";
    import { ref } from "vue";
    import { MutationTypes } from "@/store/mutation-types";

    export default {
        name: "Navbar",
        components: {
            GuestNavbarDesktop,
            GuestNavbarMobile,
            AdminNavbarDesktop,
            AdminNavbarMobile,
            StudentNavbarDesktop,
            StudentNavbarMobile,
            LecturerNavbarDesktop,
            LecturerNavbarMobile,
        },
        setup() {
            const store = useStore();
            let role = ref(Role.NONE);

            store.subscribe((mutation, state) => {
                if (mutation.type === MutationTypes.SET_ROLE) {
                    role.value = mutation.payload;
                }
            });

            return { role, Role };
        },
    };
</script>
