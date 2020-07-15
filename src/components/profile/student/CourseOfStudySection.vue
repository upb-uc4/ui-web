<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <div class="flex mb-2 align-baseline">
                    <label class="block text-gray-700 text-lg font-medium">Course of Study</label>
                </div>
                <label class="block text-gray-600">
                    Information related to your individual academic career.
                </label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Matriculation Number</label>
                    <input type="text" readonly :value="matriculationId"
                           class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input bg-gray-300 focus:outline-none focus:shadow-none focus:border-gray-400">
                </div>
                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Field of Study</label>
                    <div v-for="(val, index) in fieldsOfStudy" :key="val">
                        <input type="text" readonly :value="val"
                               class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input bg-gray-300 focus:outline-none focus:shadow-none focus:border-gray-400"
                               :class="{'mb-4' : index !== fieldsOfStudy.length - 1}">
                    </div>
                </div>
                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Degree Sought</label>
                    <input type="text" readonly value="Master's Degree"
                           class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input bg-gray-300 focus:outline-none focus:shadow-none focus:border-gray-400">
                </div>
                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Semester Count</label>
                    <input type="number" readonly :value="semesterCount"
                           class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input bg-gray-300 focus:outline-none focus:shadow-none focus:border-gray-400">
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    export default {
        props: {
            fieldsOfStudy: {
                type: Array,
                required: true
            },
            matriculationId: {
                type: String,
                required: true
            },
            semesterCount: {
                type: Number,
                required: true
            }
        },
    }
</script>