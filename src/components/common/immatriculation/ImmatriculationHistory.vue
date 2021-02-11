<template>
    <div>
        <loading-spinner
            v-if="isLoading"
            title="Loading Immatriculation History"
            subtitle="We are querying the blockchain. This might take some seconds."
        />
        <div v-else-if="hasEntries" class="relative m-8">
            <div class="border-r-4 border-blue-700 dark:border-lime-500 absolute h-full top-0" style="left: 15px" />
            <div class="m-0 p-0 space-y-6">
                <immatriculation-history-entry
                    v-for="entry in chronologicalList"
                    :key="entry"
                    :is-admin-view="isAdminView"
                    :username="username"
                    :fields-of-study="entry.fieldsOfStudy"
                    :semester="entry.semester"
                />
            </div>
        </div>
        <label v-else class="input-label-warning">There is no matriculation data yet!</label>
    </div>
</template>

<script lang="ts">
    import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
    import { reactive, ref, onBeforeMount, watch, computed } from "vue";
    import { historyToSortedList } from "@/use/helpers/ImmatriculationHistoryHandler";
    import ImmatriculationHistoryEntry from "./ImmatriculationHistoryEntry.vue";
    import MatriculationManagement from "@/api/MatriculationManagement";
    import ImmatriculationResponseHandler from "@/use/helpers/ImmatriculationResponseHandler";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    export default {
        components: {
            LoadingSpinner,
            ImmatriculationHistoryEntry,
        },
        props: {
            username: {
                type: String,
                required: true,
            },
            isAdminView: {
                type: Boolean,
                default: false,
            },
        },
        setup(props: any) {
            const isLoading = ref(true);
            const hasEntries = computed(() => chronologicalList.value.length > 0);

            let history: MatriculationData = reactive({} as MatriculationData);
            let chronologicalList = ref([] as { semester: String; fieldsOfStudy: String[] }[]);

            watch(
                () => props.username,
                () => getHistory()
            );

            onBeforeMount(async () => {
                await getHistory();
            });

            async function getHistory() {
                if (!props.username) return;

                const matriculationManagement: MatriculationManagement = new MatriculationManagement();
                const response = await matriculationManagement.getMatriculationHistory(props.username);
                const responseHandler = new ImmatriculationResponseHandler();
                history = responseHandler.handleResponse(response);
                chronologicalList.value = historyToSortedList(history).reverse();
                isLoading.value = false;
            }

            return {
                chronologicalList,
                isLoading,
                hasEntries,
            };
        },
    };
</script>
