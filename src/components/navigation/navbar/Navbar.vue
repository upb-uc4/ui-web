<template>
    <div v-if="role === Role.ADMIN">
        <admin-navbar-desktop v-if="width >= mobileSizeGuard" class="flex" />
        <admin-navbar-mobile v-else class="flex" />
    </div>
    <div v-else-if="role === Role.LECTURER">
        <lecturer-navbar-desktop v-if="width >= mobileSizeGuard" class="flex" />
        <lecturer-navbar-mobile v-else class="flex" />
    </div>
    <div v-else-if="role === Role.STUDENT">
        <student-navbar-desktop v-if="width >= mobileSizeGuard" class="flex" />
        <student-navbar-mobile v-else class="flex" />
    </div>
    <div v-else>
        <guest-navbar-desktop v-if="width >= mobileSizeGuard" class="flex" />
        <guest-navbar-mobile v-else class="flex" />
    </div>
</template>

<script lang="ts">
    import { Role } from "@/entities/Role";
    import { useStore } from "@/use/store/store";
    import { ref, watch, defineAsyncComponent } from "vue";
    import { MutationTypes } from "@/use/store/mutation-types";
    import User from "@/api/api_models/user_management/User";

    export default {
        name: "Navbar",
        components: {
            GuestNavbarDesktop: defineAsyncComponent(() => import("@/components/navigation/navbar/desktop/guest/Navbar.vue")),
            GuestNavbarMobile: defineAsyncComponent(() => import("@/components/navigation/navbar/mobile/guest/Navbar.vue")),
            AdminNavbarDesktop: defineAsyncComponent(() => import("@/components/navigation/navbar/desktop/admin/Navbar.vue")),
            AdminNavbarMobile: defineAsyncComponent(() => import("@/components/navigation/navbar/mobile/admin/Navbar.vue")),
            StudentNavbarDesktop: defineAsyncComponent(() => import("@/components/navigation/navbar/desktop/student/Navbar.vue")),
            StudentNavbarMobile: defineAsyncComponent(() => import("@/components/navigation/navbar/mobile/student/Navbar.vue")),
            LecturerNavbarDesktop: defineAsyncComponent(() => import("@/components/navigation/navbar/desktop/lecturer/Navbar.vue")),
            LecturerNavbarMobile: defineAsyncComponent(() => import("@/components/navigation/navbar/mobile/lecturer/Navbar.vue")),
        },
        setup() {
            const mobileSizeGuard = 768;
            let width = ref(window.innerWidth);
            window.addEventListener("resize", (e) => (width.value = window.innerWidth));

            const store = useStore();
            let role = ref(Role.NONE);

            store.subscribe((mutation, _) => {
                if (mutation.type === MutationTypes.SET_USER) {
                    role.value = (mutation.payload as User).role;
                } else if (mutation.type === MutationTypes.RESET_STATE) {
                    role.value = Role.NONE;
                }
            });

            return { role, Role, width, mobileSizeGuard };
        },
    };
</script>
