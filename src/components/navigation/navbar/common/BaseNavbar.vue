<template>
    <header class="flex lg:px-8 px-4 bg-white justify-between bg-gray-800 items-center md:h-20 min-h-20">
        <div class="flex w-full items-center">
            <div class="flex items-center pr-8 mr-8 border-gray-100 border-r-4">
                <a href="#" class="flex text-3xl font-semibold text-gray-100 tracking-wider">
                    UC4
                </a>
            </div>

            <div class="flex w-full">
                <nav class="md:flex items-center justify-between w-full" :class="{ hidden: !isBurgerMenuOpen }">
                    <ul class="md:flex justify-between font-semibold text-gray-100 tracking-wider pt-2">
                        <slot></slot>
                    </ul>
                    <div class="pb-3">
                        <slot name="right"></slot>
                    </div>
                </nav>
            </div>

            <button type="button" class="block md:hidden text-gray-100 hover:text-gray-500 focus:outline-none" @click="toggleBurgerMenu">
                <svg class="h-8 w-8 fill-current" viewBox="0 0 24 24">
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
    import { ref } from "vue";

    export default {
        name: "BaseNavbar",
        setup() {
            const isBurgerMenuOpen = ref(false);

            function toggleBurgerMenu() {
                isBurgerMenuOpen.value = !isBurgerMenuOpen.value;
            }

            return { isBurgerMenuOpen, toggleBurgerMenu };
        },
    };
</script>
