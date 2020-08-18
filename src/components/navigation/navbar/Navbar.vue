<template>
    <guest-navbar-desktop class="hidden md:flex" />
    <guest-navbar-mobile class="flex md:hidden" />
</template>

<script lang="ts">
    import GuestNavbarDesktop from "@/components/navigation/navbar/desktop/guest/Navbar.vue";
    import GuestNavbarMobile from "@/components/navigation/navbar/mobile/guest/Navbar.vue";
    import { Role } from "@/entities/Role";
    import { useStore } from "@/store/store";
    import { ref } from "vue";
    import { MutationTypes } from "@/store/mutation-types";

    export default {
        name: "Navbar",
        components: {
            GuestNavbarDesktop,
            GuestNavbarMobile,
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
