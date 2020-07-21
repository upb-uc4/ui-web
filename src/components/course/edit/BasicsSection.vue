<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-lg font-medium mb-2">Basics</label>
                <label class="block text-gray-600">
                    This is some long detailed description which is part towards a better form.
                </label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="mb-4 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Type</label>
                    <div class="flex">
                        <div v-for="availableType in availableCourseTypes" :key="availableType" class="mr-4">
                            <label class="flex items-center">
                                <input v-model="courseType" type="radio" class="form-radio radio" :value="availableType" />
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
                    <input
                        v-model="courseName"
                        type="text"
                        class="w-full form-input input-text"
                        :class="{ error: errorBag.has('courseName') }"
                        placeholder="Course Name"
                    />
                    <p v-if="errorBag.has('courseName')" class="error-message">
                        {{ errorBag.get("courseName") }}
                    </p>
                </div>
                <div class="mb-4 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Language</label>
                    <select
                        v-model="courseLanguage"
                        class="w-full form-select input-select"
                        required
                        :class="{ error: errorBag.has('courseLanguage') }"
                    >
                        <option disabled :value="''">Select a Language</option>
                        <option v-for="availableLanguage in availableCourseLanguages" :key="availableLanguage">{{
                            availableLanguage
                        }}</option>
                    </select>
                    <p v-if="errorBag.has('courseLanguage')" class="error-message">
                        {{ errorBag.get("courseLanguage") }}
                    </p>
                </div>
                <div class="mb-4 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">
                        Description
                        <span class="text-gray-600 font-normal">
                            (Optional)
                        </span>
                    </label>
                    <textarea
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
    import ErrorBag from "@/use/ErrorBag";
    import { CourseType } from "@/entities/CourseType";
    import { Language } from "@/entities/Language";
    import { useModelWrapper } from "@/use/ModelWrapper";

    export default {
        name: "BasicsSection",
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
            description: {
                required: true,
                type: String,
            },
        },
        setup(props: any, { emit }: any) {
            const availableCourseLanguages = Object.values(Language).filter((e) => e != Language.NONE);
            const availableCourseTypes = Object.values(CourseType).filter((e) => e != CourseType.NONE);

            return {
                availableCourseLanguages,
                availableCourseTypes,
                courseType: useModelWrapper(props, emit, "type"),
                courseName: useModelWrapper(props, emit, "name"),
                courseLanguage: useModelWrapper(props, emit, "language"),
                courseDescription: useModelWrapper(props, emit, "description"),
            };
        },
    };
</script>
