<template>
    <BaseSection subtitle="General Information about the Course" title="Basics">
        <div class="space-y-6">
            <div class="space-y-6">
                <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                    <div class="lg:w-1/2 w-full">
                        <label class="input-label-tmp">Course Name</label>
                        <input v-model="myName" type="text" class="w-full input-text-tmp" />
                    </div>
                    <div class="lg:w-1/2 w-full invisible" />
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Type</label>
                    <Select v-model:selection="myType" :elements="availableTypes" />
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">ECTS</label>
                    <input v-model.number="myEcts" min="0" type="number" class="lg:w-32 w-full input-text-tmp" />
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Language</label>
                    <Select v-model:selection="myLanguage" :elements="availableLanguages" />
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="w-full">
                    <label class="input-label-tmp">Course Description</label>
                    <textarea v-model="myDescription" rows="5" class="w-full input-text-tmp" />
                </div>
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import Select from "@/components/common/Select.vue";
    import { Language } from "@/entities/Language";
    import { CourseType } from "@/entities/CourseType";

    export default {
        name: "CourseInfoSection",
        components: {
            BaseSection,
            Select,
        },
        props: {
            name: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
            language: {
                type: String,
                required: true,
            },
            ects: {
                type: Number,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
        },
        emits: ["update:name", "update:type", "update:language", "update:ects", "update:description"],
        setup(props: any, { emit }: any) {
            const availableLanguages = Object.values(Language).filter((e) => e != Language.NONE);
            const availableTypes = Object.values(CourseType).filter((e) => e != CourseType.NONE);

            return {
                availableLanguages,
                availableTypes,
                myEcts: useModelWrapper(props, emit, "ects"),
                myName: useModelWrapper(props, emit, "name"),
                myLanguage: useModelWrapper(props, emit, "language"),
                myType: useModelWrapper(props, emit, "type"),
                myDescription: useModelWrapper(props, emit, "description"),
            };
        },
    };
</script>
