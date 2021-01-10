<template>
    <div class="flex items-center space-x-4">
        <svg
            class="h-8 w-8"
            :class="isDarkModeEnabled ? 'text-gray-400' : 'text-yellow-500'"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
        </svg>
        <Switch
            v-slot="{ checked }"
            v-model="isDarkModeEnabled"
            as="button"
            class="relative inline-flex flex-shrink-0 items-center px-0.5 w-12 h-6 transition-colors duration-200 ease-in-out rounded-full cursor-pointer focus:outline-none focus:shadow-outline"
            :class="isDarkModeEnabled ? 'bg-yellow-500' : 'bg-gray-600'"
        >
            <span
                class="inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full"
                :class="{ 'translate-x-6': checked, 'translate-x-0': !checked }"
            />
        </Switch>
        <i class="fa fa-moon text-2xl" :class="isDarkModeEnabled ? 'text-yellow-500' : 'text-gray-500'" />
    </div>
</template>

<script lang="ts">
    import { Switch } from "@headlessui/vue";
    import { ref, watch } from "vue";

    export default {
        name: "DarkModeToggle",
        components: {
            Switch,
        },
        setup() {
            const isDarkModeEnabled = ref(
                localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
            );

            watch(isDarkModeEnabled, (isDarkModeEnabled) => {
                if (isDarkModeEnabled) {
                    localStorage.theme = "dark";
                    document.querySelector("html")?.classList.add("dark");
                } else {
                    localStorage.theme = "light";
                    document.querySelector("html")?.classList.remove("dark");
                }
            });
            return { isDarkModeEnabled };
        },
    };
</script>
