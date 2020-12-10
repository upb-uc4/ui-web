<template>
    <div class="flex flex-col pl-2 mt-5">
        <label class="mb-3 text-sm font-medium text-gray-700">Immatriculation History</label>
        <div class="w-2/3">
            <immatriculation-history :key="refreshKey" v-model:busy="busy" :username="username" />
        </div>
        <div v-if="busy">
            <loading-spinner />
        </div>
    </div>
</template>

<script lang="ts">
    import MultiSelect from "@/components/common/MultiSelect.vue";
    import MatriculationManagement from "@/api/MatriculationManagement";
    import { ref, computed, reactive, watch, onMounted } from "vue";
    import { historyToSortedList } from "@/use/helpers/ImmatriculationHistoryHandler";
    import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
    import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import ImmatriculationHistoryEntry from "@/components/common/immatriculation/ImmatriculationHistoryEntry.vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import ImmatriculationHistory from "@/components/common/immatriculation/ImmatriculationHistory.vue";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import { MatriculationValidationResponseHandler } from "@/use/helpers/ImmatriculationResponseHandler";
    import { useToast } from "@/toast";
    import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";

    export default {
        components: {
            LoadingSpinner,
            ImmatriculationHistory,
        },
        props: {
            username: {
                type: String,
                required: true,
            },
        },
        setup(props: any, { emit }: any) {
            let refreshKey = ref(false);
            let busy = ref(true);

            return {
                busy,
                refreshKey,
            };
        },
    };
</script>
