<template>
    <div class="w-full">
        <section-header title="Playground" />
        <input-section class="w-full" />
        <input-section class="w-full" />
        <button-section>
            <template #left>
                <button type="button" class="sm:w-32 w-full btn-secondary-remove-tmp">Delete</button>
            </template>
            <template #right>
                <button class="sm:w-32 w-full btn-secondary-tmp">Cancel</button>
                <button class="sm:w-48 w-full btn-tmp">Create Account</button>
            </template>
        </button-section>
    </div>
</template>

<script lang="ts">
    import InputSection from "@/components/common/dev/playground/InputSection.vue";
    import SectionHeader from "@/components/common/section/SectionHeader.vue";
    import ButtonSection from "@/components/common/section/ButtonSection.vue";

    export default {
        name: "Playground",
        components: {
            SectionHeader,
            InputSection,
            ButtonSection,
        },
    };
</script>
