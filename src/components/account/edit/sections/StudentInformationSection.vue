<template>
    <section class="py-8 border-t-2 border-gray-400">
        <div class="lg:flex">
            <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                <label class="block mb-2 text-lg font-medium text-gray-700">Student Information</label>
                <label class="block text-gray-600">Manage information relevant to the immatriculation of a new student.</label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="flex flex-col w-full mb-4">
                    <div class="flex flex-row w-2/3 justify-between">
                        <div class="flex flex-col pl-2">
                            <label class="mb-3 text-sm font-medium text-gray-700">Matriculation-ID</label>
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
                        <div v-if="editMode && latest != ''" class="flex flex-col">
                            <label class="mb-3 text-sm font-medium text-gray-700">Latest Immatriculation</label>
                            <input id="latestImmatriculation" disabled class="form-input input-text" :value="latest" />
                        </div>
                    </div>
                    <immatriculation
                        v-if="editMode"
                        v-model:immatriculation-has-change="studentImmatriculationHasChange"
                        :username="username"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import { FieldOfStudy } from "@/api/api_models/user_management/FieldOfStudy";
    import { ref } from "vue";
    import Immatriculation from "./Immatriculation.vue";

    export default {
        name: "RoleSection",
        components: {
            Immatriculation,
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
            immatriculationHasChange: {
                type: Boolean,
                required: true,
            },
        },
        emits: ["update:matriculationId", "update:immatriculationHasChange"],
        setup(props: any, { emit }: any) {
            return {
                studentMatriculationId: useModelWrapper(props, emit, "matriculationId"),
                studentImmatriculationHasChange: useModelWrapper(props, emit, "immatriculationHasChange"),
            };
        },
    };
</script>
