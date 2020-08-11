<template>
    <header class="flex items-center justify-between px-4 bg-gray-800 lg:px-8 md:h-20 min-h-20">
        <div class="flex items-center w-full">
            <div class="flex items-center pr-8 mr-8 border-r-4 border-gray-100">
                <button class="flex text-3xl font-semibold tracking-wider text-gray-100 outline-none" @click="routeLogo">
                    UC4
                </button>
            </div>

            <div class="flex w-full">
                <nav class="items-center justify-between w-full md:flex" :class="{ hidden: !isBurgerMenuOpen }">
                    <ul class="justify-between pt-2 font-semibold tracking-wider text-gray-100 md:flex">
                        <slot></slot>
                    </ul>
                    <div class="pb-3">
                        <slot name="right"></slot>
                    </div>
                </nav>
            </div>

            <button type="button" class="block text-gray-100 md:hidden hover:text-gray-500 focus:outline-none" @click="toggleBurgerMenu">
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
    </header>
</template>

<script lang="ts">
    import { ref, computed } from "vue";
    import { useStore } from "@/store/store";
    import Router from "@/router";

    export default {
        name: "BaseNavbar",
        setup() {
            const isBurgerMenuOpen = ref(false);

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
