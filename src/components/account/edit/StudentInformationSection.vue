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
                    <label class="mb-3 font-medium text-gray-700 text-md">Immatriculation Status</label>
                    <div class="flex flex-row">
                        <div class="flex flex-col w-1/2">
                            <label class="mb-3 text-sm font-medium text-gray-700">Status</label>
                            <input
                                id="immatriculationStatus"
                                v-model="studentImmatriculationStatus"
                                type="text"
                                class="w-full form-input input-text"
                                :class="{ error: errorBag.hasNested('immatriculationStatus') }"
                                placeholder="Immatriculation Status"
                            />
                            <p v-if="errorBag.hasNested('immatriculationStatus')" class="error-message">
                                {{ errorBag.getNested("immatriculationStatus") }}
                            </p>
                        </div>
                        <div class="flex flex-col w-1/4 pl-2">
                            <label class="mb-3 text-sm font-medium text-gray-700">Matriculation-ID</label>
                            <input
                                id="matriculationId"
                                v-model="studentMatriculationId"
                                type="text"
                                class="w-full form-input input-text"
                                :class="{ error: errorBag.hasNested('matriculationId') }"
                                placeholder="Matriculation-ID"
                            />
                            <p v-if="errorBag.hasNested('matriculationId')" class="error-message">
                                {{ errorBag.getNested("matriculationId") }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col mt-8 mb-4">
                    <label class="mb-3 font-medium text-gray-700 text-md">Study Status</label>
                    <div class="flex flex-row">
                        <div class="flex flex-col w-1/2">
                            <label class="mb-3 text-sm font-medium text-gray-700">Fields of Study</label>
                            <multi-select
                                :input-list="fieldsOfStudy"
                                :pre-selection="selectedFieldsOfStudy"
                                placeholder="Select a Field of Study"
                                @changed="updateFieldsOfStudy"
                            />
                            <p v-if="errorBag.hasNested('fieldsOfStudy')" class="error-message">
                                {{ errorBag.getNested("fieldsOfStudy") }}
                            </p>
                        </div>
                        <div class="flex flex-col w-1/4 pl-2">
                            <label class="mb-3 text-sm font-medium text-gray-700">Semester Count</label>
                            <input
                                id="semesterCount"
                                v-model="studentSemesterCount"
                                type="number"
                                class="w-full form-input input-text"
                                :class="{ error: errorBag.hasNested('semesterCount') }"
                                placeholder="Semester Count"
                            />
                            <p v-if="errorBag.hasNested('semesterCount')" class="error-message">
                                {{ errorBag.getNested("semesterCount") }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import MultiSelect from "@/components/MultiSelect.vue";
    import { useModelWrapper } from "@/use/ModelWrapper";
    import ErrorBag from "@/use/ErrorBag";
    import { FieldOfStudy } from "@/api/api_models/user_management/FieldOfStudy";
    import { ref } from "vue";

    export default {
        name: "RoleSection",
        components: {
            MultiSelect,
        },
        props: {
            errorBag: {
                type: ErrorBag,
                required: true,
            },
            editMode: {
                type: Boolean,
                required: true,
            },
            immatriculationStatus: {
                type: String,
                required: true,
            },
            matriculationId: {
                type: String,
                required: true,
            },
            selectedFieldsOfStudy: {
                type: Array,
                required: true,
            },
            semesterCount: {
                type: Number,
                required: true,
            },
        },
        emits: ["update:selectedFieldsOfStudy"],

        setup(props: any, { emit }: any) {
            let fieldsOfStudy = Object.values(FieldOfStudy).filter((e) => e != FieldOfStudy.NONE);
            let studentFieldsOfStudy = ref(props.selectedFieldsOfStudy);

            function updateFieldsOfStudy(value: any) {
                studentFieldsOfStudy = value.value.filter((f: String) => f != FieldOfStudy.NONE);
                emit("update:selectedFieldsOfStudy", studentFieldsOfStudy);
            }

            return {
                fieldsOfStudy,
                updateFieldsOfStudy,
                studentImmatriculationStatus: useModelWrapper(props, emit, "immatriculationStatus"),
                studentMatriculationId: useModelWrapper(props, emit, "matriculationId"),
                studentSemesterCount: useModelWrapper(props, emit, "semesterCount"),
            };
        },
    };
</script>
