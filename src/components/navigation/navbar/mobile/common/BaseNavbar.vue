<template>
    <header class="flex flex-col w-full px-4 bg-gray-800 min-h-16">
        <div class="flex justify-between pr-2">
            <div class="flex pr-8 mr-8 border-gray-100">
                <div class="items-center h-20 rounded-lg cursor-pointer outline-none" title="Home" @click="routeLogo">
                    <img src="../../../../../assets/logo/logo_short_title_right.svg" class="h-full py-5" />
                </div>
            </div>

            <button
                id="nav_mobile_toggle_menu"
                type="button"
                class="block text-gray-100 md:hidden hover:text-gray-500 focus:outline-none"
                @click="toggleBurgerMenu"
            >
                <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path
                        v-if="isBurgerMenuOpen"
                        fill-rule="evenodd"
                        d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                    />
                    <path
                        v-if="!isBurgerMenuOpen"
                        fill-rule="evenodd"
                        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                    />
                </svg>
            </button>
        </div>

        <nav class="" :class="{ hidden: !isBurgerMenuOpen }">
            <ul class="pb-4 font-semibold tracking-wider text-gray-100">
                <slot></slot>
                <li>
                    <router-link
                        id="nav_mobile_common_about"
                        :to="{ name: 'about' }"
                        class="hover:bg-blue-800 rounded-lg mobile-navbar-menu"
                    >
                        About
                    </router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script lang="ts">
    import { ref } from "vue";
    import { useStore } from "@/use/store/store";
    import Router from "@/use/router";
    import { MutationTypes } from "@/use/store/mutation-types";

    export default {
        name: "MobileBaseNavbar",
        components: {},
        setup() {
            const store = useStore();
            const isBurgerMenuOpen = ref(false);

            store.subscribe((mutation) => {
                if (mutation.type === MutationTypes.FORCE_CLOSE_BURGER_MENU) {
                    isBurgerMenuOpen.value = false;
                }
            });

            function routeLogo() {
                let store = useStore();
                let loggedIn = store.getters.loggedIn;
                let logoTargetRoute = loggedIn ? "welcome" : "login";
                Router.push(logoTargetRoute);
            }

            function toggleBurgerMenu() {
                isBurgerMenuOpen.value = !isBurgerMenuOpen.value;
            }

            return { isBurgerMenuOpen, routeLogo, toggleBurgerMenu };
        },
    };
</script>
