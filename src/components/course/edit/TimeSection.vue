<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-md font-medium mb-2">Time</label>
                <label class="block text-gray-600">
                    This section is disabled for now as there is no Vue3 datepicker plugin yet.
                </label>
            </div>
            <div class="w-full lg:w-2/3 flex">
                <div class="w-1/2 mb-4 mr-12 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Start Date</label>
                    <input
                        id="startDate"
                        v-model="startDate"
                        type="text"
                        readonly
                        class="w-full form-input input-text"
                        :class="{ error: errorBag.has('startDate') }"
                    />
                    <p v-if="errorBag.has('startDate')" class="error-message">{{ errorBag.get("startDate") }}</p>
                </div>
                <div class="w-1/2 mb-4 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">End Date</label>
                    <input
                        id="endDate"
                        v-model="endDate"
                        type="text"
                        readonly
                        class="w-full form-input input-text"
                        :class="{ error: errorBag.has('endDate') }"
                    />
                    <p v-if="errorBag.has('endDate')" class="error-message">{{ errorBag.get("endDate") }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import ErrorBag from "@/use/ErrorBag";
    import { useModelWrapper } from "@/use/ModelWrapper";

    export default {
        name: "RestrictionsSection",
        props: {
            errorBag: {
                required: true,
                type: ErrorBag,
            },
            start: {
                required: true,
                type: String,
            },
            end: {
                required: true,
                type: String,
            },
        },
        setup(props: any, { emit }: any) {
            return {
                startDate: useModelWrapper(props, emit, "start"),
                endDate: useModelWrapper(props, emit, "end"),
            };
        },
    };
</script>
