<template>
    <div class="flex items-center space-x-4">
        <i class="fa fa-sun text-3xl" :class="isDarkModeEnabled ? 'text-gray-400' : 'text-yellow-500'" />
        <Switch
            v-slot="{ checked }"
            v-model="isDarkModeEnabled"
            as="button"
            class="relative inline-flex flex-shrink-0 items-center px-0.5 w-18 h-9 transition-colors duration-200 ease-in-out rounded-full cursor-pointer focus:outline-none focus:shadow-outline"
            :class="isDarkModeEnabled ? 'bg-yellow-500' : 'bg-gray-600'"
        >
            <span
                class="inline-block w-8 h-8 transition duration-200 ease-in-out transform bg-white rounded-full"
                :class="{ 'translate-x-9': checked, 'translate-x-0': !checked }"
            />
        </Switch>
        <i class="fa fa-moon text-3xl" :class="isDarkModeEnabled ? 'text-yellow-500' : 'text-gray-500'" />
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
            const isDarkModeEnabled = ref(false);

            watch(isDarkModeEnabled, (isDarkModeEnabled) => {
                if (isDarkModeEnabled) {
                    document.querySelector("html").classList.add("dark");
                } else {
                    document.querySelector("html").classList.remove("dark");
                }
            });
            return { isDarkModeEnabled };
        },
    };
</script>
