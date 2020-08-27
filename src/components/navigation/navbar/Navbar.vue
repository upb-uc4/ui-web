<template>
    <admin-navbar v-if="role === Role.ADMIN" />
    <lecturer-navbar v-else-if="role === Role.LECTURER" />
    <student-navbar v-else-if="role === Role.STUDENT" />
    <guest-navbar v-else />
</template>

<script lang="ts">
    import GuestNavbar from "@/components/navigation/navbar/guest/Navbar.vue";
    import LecturerNavbar from "@/components/navigation/navbar/lecturer/Navbar.vue";
    import StudentNavbar from "@/components/navigation/navbar/student/Navbar.vue";
    import AdminNavbar from "@/components/navigation/navbar/admin/Navbar.vue";
    import { Role } from "@/entities/Role";
    import { useStore } from "@/use/store/store";
    import { ref } from "vue";
    import { MutationTypes } from "@/use/store/mutation-types";

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
