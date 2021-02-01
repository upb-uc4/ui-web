<template>
    <BaseSection subtitle="General information about the course." title="Basics">
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Course Name</label>
                    <base-input
                        v-model:value="myName"
                        identifier="courseName"
                        :error-message="errorBag.getNested('courseName')"
                        type="text"
                        class="w-full"
                        placeholder="Course Name"
                        validation-query="course.courseName"
                    />
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Type</label>
                    <Select :id="'courseType'" v-model:selection="myType" :elements="availableTypes" />
                    <label v-if="errorBag.has('courseType')" class="input-label-error">
                        {{ errorBag.get("courseType") }}
                    </label>
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">ECTS</label>
                    <input
                        id="ects"
                        v-model.number="myEcts"
                        min="0"
                        type="number"
                        class="lg:w-32 w-full"
                        :class="errorBag.has('ects') ? 'input-text-error' : 'input-text'"
                    />
                    <label v-if="errorBag.has('ects')" for="ects" class="input-label-error">
                        {{ errorBag.get("ects") }}
                    </label>
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Language</label>
                    <Select :id="'courseLanguage'" v-model:selection="myLanguage" :elements="availableLanguages" />
                    <label v-if="errorBag.has('courseLanguage')" class="input-label-error">
                        {{ errorBag.get("courseLanguage") }}
                    </label>
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="w-full">
                    <label for="courseDescription" class="input-label">Course Description</label>
                    <textarea
                        id="courseDescription"
                        v-model="myDescription"
                        rows="5"
                        class="w-full"
                        :class="errorBag.has('courseDescription') ? 'input-text-error' : 'input-text'"
                    />
                    <label v-if="errorBag.has('courseDescription')" for="courseDescription" class="input-label-error">
                        {{ errorBag.get("courseDescription") }}
                    </label>
                </div>
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import BaseInput from "@/components/common/BaseInput.vue";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import Select from "@/components/common/Select.vue";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import { onBeforeMount, ref } from "vue";
    import { useStore } from "@/use/store/store";
    import { useToast } from "@/toast";

    export default {
        name: "CourseInfoSection",
        components: {
            BaseInput,
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
            const availableLanguages = ref([] as string[]);
            const availableTypes = ref([] as string[]);

            onBeforeMount(async () => {
                const store = useStore();
                await store.getters.configuration
                    .then((config) => {
                        availableLanguages.value = config.languages;
                        availableTypes.value = config.courseTypes;
                    })
                    .catch((reason) => {
                        const toast = useToast();
                        toast.error(reason);
                    });
            });

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
