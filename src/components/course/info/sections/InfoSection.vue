<template>
    <base-section title="Basics" subtitle="General information about the course.">
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Type</label>
                    <input class="input-text w-full" readonly :value="type" />
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Name</label>
                    <input class="input-text w-full" readonly :value="name" />
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Language</label>
                    <input class="input-text w-full" readonly :value="language" />
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Credits</label>
                    <input class="input-text w-full" readonly :value="ects" />
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Description (Optional)</label>
                    <textarea class="input-text w-full" readonly :value="description" rows="5" />
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
        </div>
    </base-section>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";

    export default {
        name: "BasicsSection",
        components: {
            BaseSection,
        },
        props: {
            type: {
                required: true,
                type: String,
            },
            name: {
                required: true,
                type: String,
            },
            language: {
                required: true,
                type: String,
            },
            ects: {
                type: Number,
                required: true,
            },
            description: {
                required: true,
                type: String,
            },
        },
    };
</script>
