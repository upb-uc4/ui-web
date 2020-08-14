<template>
    <div v-if="!busy">
        <div v-if="chronologicalList.length > 0">
            <div v-for="(pair, index) in chronologicalList" :key="pair">
                <immatriculation-history-entry
                    class="w-1/2"
                    :is-first-row="index == 0"
                    :is-last-row="index == chronologicalList.length - 1"
                    :fields-of-study="pair.fieldsOfStudy"
                    :semester="pair.semester"
                />
            </div>
        </div>
        <div v-else>
            <label class="text-lg">There is no matriculation data, yet!</label>
        </div>
    </div>
</template>

<script lang="ts">
    import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
    import { reactive, ref, onBeforeMount } from "vue";
    import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
    import { FieldOfStudy } from "@/api/api_models/user_management/FieldOfStudy";
    import { historyToSortedList } from "@/use/ImmatriculationHistoryHandler";
    import ImmatriculationHistoryEntry from "@/components/ImmatriculationHistoryEntry.vue";
    export default {
        components: {
            ImmatriculationHistoryEntry,
        },
        props: {
            username: {
                type: String,
                required: true,
            },
            busy: {
                type: Boolean,
                required: true,
            },
        },
        emits: ["update:busy"],
        setup(props: any, { emit }: any) {
            let history: MatriculationData = reactive({
                matriculationId: "egal",
                firstName: "egal",
                lastName: "egal",
                birthDate: "egal",
                matriculationStatus: [
                    {
                        fieldOfStudy: "Computer Science" as FieldOfStudy,
                        semesters: ["WS2020/21", "WS2019/20", "SS2020"],
                    } as SubjectMatriculation,
                    {
                        fieldOfStudy: "Mathematic" as FieldOfStudy,
                        semesters: ["SS2020", "WS2019/20"],
                    } as SubjectMatriculation,
                ],
            });
            let chronologicalList = ref({});

            async function getHistory() {
                emit("update:busy", true);
                // const matriculationManagement:MatriculationManagement = new MatriculationManagement();
                // const response = await matriculationManagement.getMatriculationHistory(props.username);
                // const responseHandler = new GenericResponseHandler();
                // const result = responseHandler.handleReponse(response);
                // if(response.statusCode != 200) {
                //     console.log("Something went wrong!")
                // }
                // else {
                //     history = result;
                //     chronologicalList = historyToSortedList(history);
                // }
                //TODO remove promise as it just simulates waiting for an API call
                await new Promise((r) => setTimeout(r, 3000));
                chronologicalList.value = historyToSortedList(history);
                emit("update:busy", false);
            }

            onBeforeMount(() => {
                getHistory();
            });

            return {
                chronologicalList,
            };
        },
    };
</script>
