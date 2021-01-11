<template>
    <BaseSection title="Appearance" subtitle="Modify the appearance of the application. Choose between classic or dark-mode.">
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Toggle Dark-Mode Theme</label>
                    <dark-mode-toggle />
                </div>
                <div class="lg:w-1/2 w-full" />
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import DarkModeToggle from "@/components/common/DarkModeToggle.vue";

    export default {
        name: "AppearanceSection",
        components: {
            BaseSection,
            DarkModeToggle,
        },
        setup() {},
    };
</script>
