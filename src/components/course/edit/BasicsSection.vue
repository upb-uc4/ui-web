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
                        <div v-for="type in availableCourseTypes" :key="type" class="mr-4">
                            <label class="flex items-center">
                                <input
                                    v-model="courseType"
                                    type="radio"
                                    class="form-radio radio"
                                    name="type"
                                    :value="type"
                                />
                                <span class="ml-2 text-gray-700 text-md font-medium">{{ type }}</span>
                            </label>
                        </div>
                    </div>
                    <p v-if="errorBag.has('courseType')" class="error-message">
                        {{ errorBag.get("courseType") }}
                    </p>
                </div>
                <div class="mb-4 flex flex-col">
                    <label for="name" class="text-gray-700 text-md font-medium mb-3">Name</label>
                    <input
                        id="name"
                        v-model="courseName"
                        type="text"
                        name="courseName"
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
                        id="language"
                        v-model="courseLanguage"
                        required
                        name="language"
                        class="w-full form-select input-select"
                        :class="{ error: errorBag.has('courseLanguage') }"
                    >
                        <option disabled :value="''">Select a Language</option>
                        <option v-for="language in availableCourseLanguages" :key="language">{{ language }}</option>
                    </select>
                    <p v-if="errorBag.has('courseLanguage')" class="error-message">
                        {{ errorBag.get("courseLanguage") }}
                    </p>
                </div>
                <div class="mb-4 flex flex-col">
                    <label for="description" class="text-gray-700 text-md font-medium mb-3">
                        Description
                        <span class="text-gray-600 font-normal">
                            (Optional)
                        </span>
                    </label>
                    <textarea
                        id="description"
                        v-model="courseDescription"
                        name="description"
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
    import ErrorBag from "../../../use/ErrorBag";
    import {CourseType} from "@/entities/CourseType";
    import {Language} from "@/entities/Language";

    export default {
        name: "BasicsSection",
        props: {
            errorBag: {
                required: true,
                type: ErrorBag
            },
        },
        setup(props: any){
            const availableCourseLanguages = Object.values(Language).filter((e) => e != Language.NONE);
            const availableCourseTypes = Object.values(CourseType).filter((e) => e != CourseType.NONE);
            return {availableCourseLanguages, availableCourseTypes};
        }
    }
</script>