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
                    <input id="matriculationId" type="text" readonly :value="matriculationId" class="w-full form-input input-text" />
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    export default {
        props: {
            matriculationId: {
                type: String,
                required: true,
            },
        },
    };
</script>
