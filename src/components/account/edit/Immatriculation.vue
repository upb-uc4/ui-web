<template>
    <div class="flex flex-col pl-2 mt-5">
        <label class="mb-3 text-sm font-medium text-gray-700">Immatriculation History</label>
        <div class="w-2/3">
            <immatriculation-history :key="refreshKey" v-model:busy="busy" :username="username" />
        </div>
        <div v-if="busy">
            <loading-spinner />
        </div>
        <div v-else class="w-full flex flex-row mt-5">
            <div class="flex flex-row items-start justify-between w-2/3">
                <select id="semesterType" v-model="semesterType" class="form-select input-select" @change="resetYear">
                    <option disabled :value="''">Semester</option>
                    <option>SS</option>
                    <option>WS</option>
                </select>
                <select id="semesterYear" v-model="year" class="form-select input-select mx-2">
                    <option disabled :value="''">Year</option>
                    <option v-for="year in selectableYears" :key="year">{{ year }}</option>
                </select>
                <multi-select
                    :input-list="fieldsOfStudy"
                    :placeholder="'Select a Field of Study'"
                    :pre-selection="selectedFieldsOfStudy"
                    @changed="updateSelectedFieldsOfStudy"
                />
            </div>
            <div class="flex-none">
                <button
                    id="addImmatirculationData"
                    :disabled="!validSelection"
                    class="btn btn-green-primary-500 px-3 py-3"
                    @click="updateImmatriculation"
                >
                    Add
                </button>
            </div>
        </div>
        {{ selectedFieldsOfStudy }}
        {{ hasInput }}
    </div>
</template>

<script lang="ts">
    import MultiSelect from "@/components/MultiSelect.vue";
    import MatriculationManagement from "@/api/MatriculationManagement";
    import { onBeforeMount, ref, computed, reactive, watch } from "vue";
    import { FieldOfStudy } from "@/api/api_models/user_management/FieldOfStudy";
    import { historyToSortedList } from "@/use/ImmatriculationHistoryHandler";
    import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
    import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
    import GenericResponseHandler from "@/use/GenericResponseHandler";
    import ImmatriculationHistoryEntry from "@/components/ImmatriculationHistoryEntry.vue";
    import LoadingSpinner from "@/components/loading/Spinner.vue";
    import ImmatriculationHistory from "@/components/ImmatriculationHistory.vue";

    export default {
        components: {
            MultiSelect,
            LoadingSpinner,
            ImmatriculationHistory,
        },
        props: {
            username: {
                type: String,
                required: true,
            },
            immatriculationHasChange: {
                type: Boolean,
                required: true,
            },
        },
        emits: ["update:immatriculationHasChange"],
        setup(props: any, { emit }: any) {
            let refreshKey = ref(false);
            let busy = ref(true);
            let fieldsOfStudy = Object.values(FieldOfStudy).filter((e) => e != FieldOfStudy.NONE);
            let semesterType = ref("");
            let year = ref("");
            let selectedFieldsOfStudy = ref([] as FieldOfStudy[]);

            let currentYear = new Date().getFullYear();
            let selectableYears = computed(() => {
                let array: String[] = [];
                for (let index = currentYear; index >= currentYear - 10; index--) {
                    if (semesterType.value == "WS") {
                        array.push(
                            index.toString() + "/" + (index + 1).toString().substring(index.toString().length - 2, index.toString().length)
                        );
                    } else {
                        array.push(index.toString());
                    }
                }
                return array;
            });

            let selectedSemester = computed(() => {
                return semesterType.value + year.value;
            });

            let validSelection = computed(() => {
                return (
                    semesterType.value != "" &&
                    year.value != "" &&
                    selectedFieldsOfStudy.value.length != 0 &&
                    selectedFieldsOfStudy.value[0] != ""
                );
            });

            let hasInput = computed(() => {
                let hasInput: Boolean =
                    year.value != "" ||
                    semesterType.value != "" ||
                    (selectedFieldsOfStudy.value.length > 0 && selectedFieldsOfStudy.value[0] != "");
                return hasInput;
            });

            watch(hasInput, () => {
                emit("update:immatriculationHasChange", hasInput.value);
            });

            function resetYear() {
                year.value = "";
            }

            function updateSelectedFieldsOfStudy(value: any) {
                selectedFieldsOfStudy.value = value.value;
            }

            async function updateImmatriculation() {
                busy.value = true;
                let error = false;
                let successfullUpdates: number[] = [];
                const matriculationManagement: MatriculationManagement = new MatriculationManagement();

                //TODO Replace the for-loop with a single call containing a list of FoSs  as soon as provided by backend
                for (let i = 0; i < selectedFieldsOfStudy.value.length; i++) {
                    const response = await matriculationManagement.updateMatriculationData(
                        props.username,
                        selectedFieldsOfStudy.value[i],
                        selectedSemester.value
                    );
                    const responseHandler = new GenericResponseHandler();
                    const result = responseHandler.handleReponse(response);
                    if (response.statusCode != 200) {
                        error = true;
                        console.log(
                            "Error: Updating Entry '" + selectedSemester.value + " : " + selectedFieldsOfStudy.value[i] + "' Failed!"
                        );
                    } else {
                        console.log("Update: new Matriculationdata --->" + selectedSemester.value + " : " + selectedFieldsOfStudy.value[i]);
                        successfullUpdates.push(i);
                    }
                }
                if (error) {
                    successfullUpdates.forEach((i) => {
                        selectedFieldsOfStudy.value = selectedFieldsOfStudy.value.filter((e) => e != selectedFieldsOfStudy.value[i]);
                    });
                } else {
                    semesterType.value = "";
                    year.value = "";
                    selectedFieldsOfStudy.value = [];
                }
                refreshKey.value = !refreshKey.value;
            }

            return {
                busy,
                resetYear,
                fieldsOfStudy,
                selectableYears,
                year,
                semesterType,
                selectedFieldsOfStudy,
                updateSelectedFieldsOfStudy,
                updateImmatriculation,
                validSelection,
                refreshKey,
                hasInput,
            };
        },
    };
</script>
