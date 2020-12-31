<template>
    <BaseSection subtitle="General information about the course." title="Basics">
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label for="courseName" class="input-label-tmp">Course Name</label>
                    <input
                        id="courseName"
                        v-model="myName"
                        type="text"
                        class="w-full"
                        :class="errorBag.has('courseName') ? 'input-text-error-tmp' : 'input-text-tmp'"
                    />
                    <label v-if="errorBag.has('courseName')" for="courseName" class="input-label-error-tmp">
                        {{ errorBag.get("courseName") }}
                    </label>
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Type</label>
                    <Select id="courseType" v-model:selection="myType" :elements="availableTypes" />
                    <label v-if="errorBag.has('courseType')" for="courseType" class="input-label-error-tmp">
                        {{ errorBag.get("courseType") }}
                    </label>
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">ECTS</label>
                    <input
                        id="ects"
                        v-model.number="myEcts"
                        min="0"
                        type="number"
                        class="lg:w-32 w-full"
                        :class="errorBag.has('ects') ? 'input-text-error-tmp' : 'input-text-tmp'"
                    />
                    <label v-if="errorBag.has('ects')" for="ects" class="input-label-error-tmp">
                        {{ errorBag.get("ects") }}
                    </label>
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Language</label>
                    <Select id="courseLanguage" v-model:selection="myLanguage" :elements="availableLanguages" />
                    <label v-if="errorBag.has('courseLanguage')" for="courseLanguage" class="input-label-error-tmp">
                        {{ errorBag.get("courseLanguage") }}
                    </label>
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="w-full">
                    <label for="courseDescription" class="input-label-tmp">Course Description</label>
                    <textarea
                        id="courseDescription"
                        v-model="myDescription"
                        rows="5"
                        class="w-full"
                        :class="errorBag.has('courseDescription') ? 'input-text-error-tmp' : 'input-text-tmp'"
                    />
                    <label v-if="errorBag.has('courseDescription')" for="courseDescription" class="input-label-error-tmp">
                        {{ errorBag.get("courseDescription") }}
                    </label>
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
    import ErrorBag from "@/use/helpers/ErrorBag";

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
            errorBag: {
                type: Object as () => ErrorBag,
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
