<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-lg font-medium mb-2">Basics</label>
                <label class="block text-gray-600"> General Information about the Course </label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="mb-4 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Type</label>
                    <div class="flex">
                        <div v-for="availableType in availableCourseTypes" :key="availableType" class="mr-4">
                            <label class="flex items-center">
                                <input id="courseType" v-model="courseType" type="radio" class="form-radio radio" :value="availableType" />
                                <span class="ml-2 text-gray-700 text-md font-medium">{{ availableType }}</span>
                            </label>
                        </div>
                    </div>
                    <p v-if="errorBag.has('courseType')" class="error-message">
                        {{ errorBag.get("courseType") }}
                    </p>
                </div>
                <div class="mb-4 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Name</label>
                    <base-input
                        v-model:value="courseName"
                        identifier="courseName"
                        :error-message="getErrorMessage(errorBag, 'courseName')"
                        type="text"
                        class="w-full"
                        placeholder="Course Name"
                        validation-query="course.courseName"
                    />
                </div>
                <div class="mb-4 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Language</label>
                    <select
                        id="courseLanguage"
                        v-model="courseLanguage"
                        class="w-full form-select input-select"
                        required
                        :class="{ error: errorBag.has('courseLanguage') }"
                    >
                        <option disabled :value="''">Select a Language</option>
                        <option v-for="availableLanguage in availableCourseLanguages" :key="availableLanguage">
                            {{ availableLanguage }}
                        </option>
                    </select>
                    <p v-if="errorBag.has('courseLanguage')" class="error-message">
                        {{ errorBag.get("courseLanguage") }}
                    </p>
                </div>
                <div class="mb-4 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Credits</label>
                    <input
                        id="ects"
                        v-model="courseEcts"
                        type="number"
                        min="0"
                        class="w-full form-input input-text"
                        :class="{ error: errorBag.has('ects') }"
                        @input="updateEcts($event.target.value)"
                    />
                    <p v-if="errorBag.has('ects')" class="error-message">
                        {{ errorBag.get("ects") }}
                    </p>
                </div>
                <div class="mb-4 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">
                        Description
                        <span class="text-gray-600 font-normal"> (Optional) </span>
                    </label>
                    <textarea
                        id="courseDescription"
                        v-model="courseDescription"
                        cols="30"
                        rows="10"
                        class="w-full form-textarea border-2 border-gray-400 rounded-lg text-gray-600"
                        :class="{ error: errorBag.has('courseDescription') }"
                        placeholder="Add an optional description."
                    />
                    <p v-if="errorBag.has('courseDescription')" class="error-message">
                        {{ errorBag.get("courseDescription") }}
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import ErrorBag, { getErrorMessage } from "@/use/helpers/ErrorBag";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import { onMounted, ref } from "vue";
    import { useStore } from "@/use/store/store";
    import BaseInput from "@/components/common/BaseInput.vue";

    export default {
        name: "BasicsSection",
        components: {
            BaseInput,
        },
        props: {
            errorBag: {
                required: true,
                type: ErrorBag,
            },
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
        emits: ["update:type", "update:name", "update:language", "update:description", "update:ects"],
        setup(props: any, { emit }: any) {
            const availableCourseLanguages = ref([] as string[]);
            const availableCourseTypes = ref([] as string[]);
            const courseEcts = ref(props.ects);

            function isNumber(value: string) {
                return /[0-9]/g.test(value);
            }

            function updateEcts(value: string) {
                if (isNumber(value)) {
                    emit("update:ects", parseInt(value));
                } else {
                    emit("update:ects", 0);
                }
            }

            onMounted(async () => {
                const store = useStore();
                availableCourseLanguages.value = (await store.getters.configuration).languages;
                availableCourseTypes.value = (await store.getters.configuration).courseTypes;
            });

            return {
                availableCourseLanguages,
                availableCourseTypes,
                courseEcts,
                updateEcts,
                getErrorMessage,
                courseType: useModelWrapper(props, emit, "type"),
                courseName: useModelWrapper(props, emit, "name"),
                courseLanguage: useModelWrapper(props, emit, "language"),
                courseDescription: useModelWrapper(props, emit, "description"),
            };
        },
    };
</script>
