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
                    <input id="courseType" :value="type" type="text" class="w-full form-input input-text" disabled />
                </div>
                <div class="mb-4 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Name</label>
                    <input id="courseName" :value="name" type="text" class="w-full form-input input-text" disabled />
                </div>
                <div class="mb-4 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Language</label>
                    <input id="courseLanguage" :value="language" class="w-full form-input input-text" type="text" disabled />
                </div>
                <div class="mb-4 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Credits</label>
                    <input id="courseCredits" :value="ects" type="number" disabled class="w-full form-input input-text" />
                </div>
                <div class="mb-4 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">
                        Description
                        <span class="text-gray-600 font-normal"> (Optional) </span>
                    </label>
                    <textarea
                        id="courseDescription"
                        :value="description"
                        cols="30"
                        rows="10"
                        class="w-full form-textarea input-text border-2 border-gray-400 rounded-lg text-gray-600"
                        disabled
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    export default {
        name: "BasicsSection",
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
