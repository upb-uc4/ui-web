<template>
    <section class="py-8 border-t-2 border-gray-400">
        <div class="lg:flex">
            <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                <label class="block mb-2 text-lg font-medium text-gray-700">Student Information</label>
                <label class="block text-gray-600">
                    Information Specifically for a Student
                </label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="flex flex-col mb-4">
                    <div class="flex flex-row">
                        <div class="flex flex-col pl-2">
                            <label class="w-1/2 mb-3 text-sm font-medium text-gray-700">Matriculation-ID</label>
                            <input
                                id="matriculationId"
                                v-model="studentMatriculationId"
                                :disabled="editMode"
                                type="text"
                                class="w-full form-input input-text"
                                :class="{ error: errorBag.hasNested('matriculationId') }"
                                placeholder="Matriculation-ID"
                            />
                            <p v-if="errorBag.hasNested('matriculationId')" class="error-message">
                                {{ errorBag.getNested("matriculationId") }}
                            </p>
                        </div>
                        <div v-if="editMode && latest != ''" class="ml-4 flex flex-col">
                            <label class="mb-3 text-sm font-medium text-gray-700">Latest Immatriculation</label>
                            <input disabled class="form-input input-text" :value="latest" />
                        </div>
                    </div>
                    <immatriculation-history v-if="editMode" :username="username" />
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { useModelWrapper } from "@/use/ModelWrapper";
    import ErrorBag from "@/use/ErrorBag";
    import { FieldOfStudy } from "@/api/api_models/user_management/FieldOfStudy";
    import { ref } from "vue";
    import ImmatriculationHistory from "./Immatriculation.vue";

    export default {
        name: "RoleSection",
        components: {
            ImmatriculationHistory,
        },
        props: {
            username: {
                type: String,
                required: true,
            },
            latest: {
                type: String,
                required: true,
            },
            errorBag: {
                type: ErrorBag,
                required: true,
            },
            editMode: {
                type: Boolean,
                required: true,
            },
            matriculationId: {
                type: String,
                required: true,
            },
        },
        emits: ["update:matriculationId"],
        setup(props: any, { emit }: any) {
            return {
                studentMatriculationId: useModelWrapper(props, emit, "matriculationId"),
            };
        },
    };
</script>
