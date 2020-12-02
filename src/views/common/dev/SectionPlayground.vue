<template>
    <div class="w-full mx-auto lg:mt-20 mt-8">
        <section-header title="Playground" />
        <input-section class="w-full" />
        <input-section class="w-full" />
    </div>
</template>

<script lang="ts">
    import InputSection from "@/components/common/dev/playground/InputSection.vue";
    import SectionHeader from "@/components/common/section/SectionHeader.vue";

    export default {
        name: "Playground",
        components: {
            SectionHeader,
            InputSection,
        },
    };
</script>
