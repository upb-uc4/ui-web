<template>
    <header class="flex flex-col w-full px-4 bg-gray-800 min-h-20">
        <div class="flex justify-between p-2">
            <div class="flex pr-8 mr-8 border-gray-100">
                <button class="text-3xl font-semibold tracking-wider text-gray-100 outline-none" @click="routeLogo">
                    UC4
                </button>
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

        <nav class="" :class="{ hidden: !isBurgerMenuOpen }">
            <ul class="pt-2 font-semibold tracking-wider text-gray-100">
                <li>
                    <router-link id="routeLogin" :to="{ name: 'login' }" class="navbar-menu">Login</router-link>
                </li>
                <li>
                    <router-link id="routeAbout" :to="{ name: 'about' }" class="navbar-menu">About</router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script lang="ts">
    import { ref } from "vue";

    export default {
        name: "MobileGuestNavbar",
        components: {},
        setup() {
            const isBurgerMenuOpen = ref(false);

            function toggleBurgerMenu() {
                isBurgerMenuOpen.value = !isBurgerMenuOpen.value;
            }

            return { isBurgerMenuOpen, toggleBurgerMenu };
        },
    };
</script>
