<template>
    <base-section title="Student Information" subtitle="Manage information relevant to the immatriculation of a student.">
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="w-full lg:w-1/2">
                    <label class="input-label">Matriculation-ID</label>
                    <input
                        id="matriculationId"
                        v-model="studentMatriculationId"
                        :disabled="editMode"
                        type="text"
                        class="w-full"
                        :class="errorBag.has('matriculationId') ? 'input-text-error' : 'input-text'"
                        placeholder="Matriculation-ID"
                    />
                    <label v-if="errorBag.hasNested('matriculationId')" class="input-label-error">
                        {{ errorBag.getNested("matriculationId") }}
                    </label>
                </div>
                <div class="w-full lg:w-1/2 invisible"></div>
            </div>
            <div v-if="editMode && latest != ''" class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="w-full lg:w-1/2">
                    <label class="input-label">Latest Immatriculation</label>
                    <input id="latestImmatriculation" disabled class="input-text" :value="latest" />
                </div>
                <div class="w-full lg:w-1/2 invisible"></div>
            </div>
            <immatriculation
                v-if="editMode"
                v-model:immatriculation-has-change="studentImmatriculationHasChange"
                :is-admin-view="true"
                :username="username"
            />
        </div>
    </base-section>
</template>

<script lang="ts">
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import Immatriculation from "@/components/account/edit/sections/Immatriculation.vue";

    export default {
        name: "RoleSection",
        components: {
            Immatriculation,
            BaseSection,
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
