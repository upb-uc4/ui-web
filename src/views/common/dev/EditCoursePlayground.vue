<template>
    <div class="w-full">
        <section-header title="Edit Course" />
        <lecturer-section v-model:lecturerId="lecturerId" />
        <button-section>
            <template #left>
                <button type="button" class="sm:w-32 w-full btn-secondary-remove-tmp">Delete</button>
            </template>
            <template #right>
                <button class="sm:w-32 w-full btn-secondary-tmp">Cancel</button>
                <button class="sm:w-48 w-full btn-tmp">Save</button>
            </template>
        </button-section>
    </div>
</template>

<script lang="ts">
    import SectionHeader from "@/components/common/section/SectionHeader.vue";
    import ButtonSection from "@/components/common/section/ButtonSection.vue";
    import { ref } from "vue";
    import LecturerSection from "@/components/common/dev/playground/course/LecturerSection.vue";

    export default {
        name: "Playground",
        components: {
            SectionHeader,
            ButtonSection,
            LecturerSection,
        },
        setup() {
            const lecturerId = ref("lecturer");

            return {
                lecturerId,
            };
        },
    };
</script>
