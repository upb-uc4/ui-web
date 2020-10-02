<template>
    <section class="py-8 border-t-2 border-gray-400">
        <div class="lg:flex">
            <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                <label class="block mb-2 text-lg font-medium text-gray-700">Lecturer Information</label>
                <label class="block text-gray-600">Manage relevant details of the new lecturer account.</label>
            </div>
            <div class="flex flex-col w-full lg:w-2/3">
                <label class="mb-3 font-medium text-gray-700 text-md">Description</label>
                <div class="flex flex-col mb-4">
                    <label class="mb-3 text-sm font-medium text-gray-700">Free Text Description (optional)</label>
                    <textarea
                        id="freeText"
                        v-model="lecturerFreeText"
                        cols="30"
                        rows="5"
                        class="w-full text-gray-600 border-2 border-gray-400 rounded-lg form-textarea"
                        :class="{ error: errorBag.hasNested('freeText') }"
                        placeholder="Add an optional description for the Lecturer (publications, awards, etc.)"
                    >
                    </textarea>
                    <p v-if="errorBag.hasNested('freeText')" class="error-message">{{ errorBag.getNested("freeText") }}</p>
                </div>
                <div class="flex flex-col mb-4">
                    <label class="mb-3 text-sm font-medium text-gray-700">Fields of Research (optional)</label>
                    <textarea
                        id="researchArea"
                        v-model="lecturerResearchArea"
                        cols="30"
                        rows="3"
                        class="w-full text-gray-600 border-2 border-gray-400 rounded-lg form-textarea"
                        :class="{ error: errorBag.hasNested('researchArea') }"
                        placeholder="Add an optional description of the lecturer's fields of research"
                    >
                    </textarea>
                    <p v-if="errorBag.hasNested('researchArea')" class="error-message">
                        {{ errorBag.getNested("researchArea") }}
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { Role } from "@/entities/Role";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import ErrorBag from "@/use/helpers/ErrorBag";

    export default {
        name: "RoleSection",
        props: {
            errorBag: {
                type: ErrorBag,
                required: true,
            },
            editMode: {
                type: Boolean,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            researchArea: {
                type: String,
                required: true,
            },
        },
        emits: ["update:description", "update:researchArea"],
        setup(props: any, { emit }: any) {
            return {
                lecturerFreeText: useModelWrapper(props, emit, "description"),
                lecturerResearchArea: useModelWrapper(props, emit, "researchArea"),
            };
        },
    };
</script>
