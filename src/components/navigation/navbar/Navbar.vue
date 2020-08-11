<template>
    <admin-navbar v-if="role === Role.ADMIN" />
    <lecturer-navbar v-else-if="role === Role.LECTURER" />
    <student-navbar v-else-if="role === Role.STUDENT" />
    <guest-navbar v-else />
</template>

<script lang="ts">
    import GuestNavbar from "@/components/navigation/navbar/desktop/guest/Navbar.vue";
    import LecturerNavbar from "@/components/navigation/navbar/desktop/lecturer/Navbar.vue";
    import StudentNavbar from "@/components/navigation/navbar/desktop/student/Navbar.vue";
    import AdminNavbar from "@/components/navigation/navbar/desktop/admin/Navbar.vue";
    import { Role } from "@/entities/Role";
    import { useStore } from "../../../store/store";
    import { ref } from "vue";
    import { MutationTypes } from "../../../store/mutation-types";

    export default {
        name: "Navbar",
        components: {
            GuestNavbar,
            LecturerNavbar,
            StudentNavbar,
            AdminNavbar,
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
