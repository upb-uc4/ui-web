<template>
    <div class="flex flex-col pl-2 mt-5">
        <label class="mb-3 text-sm font-medium text-gray-700">Immatriculation</label>
        <div class="flex flex-col items-start">
            <div v-for="pair in chronologicalList" :key="pair">
                <div v-for="(fieldOfStudy, index) in pair.fieldsOfStudy" :key="fieldOfStudy" class="flex flex-row">
                    <input
                        disabled
                        type="text"
                        class="my-1 w-1/2 form-input input-text mr-2"
                        :class="[index > 0 ? 'invisible' : 'visible']"
                        :value="pair.semester"
                    />
                    <input disabled type="text" class="my-1 w-1/2 form-input input-text" :value="fieldOfStudy" />
                </div>
            </div>
            <div class="w-full flex mt-5">
                <div class="flex flex-row items-start">
                    <select v-model="semesterType" class="form-select input-select" @change="resetYear">
                        <option disabled :value="''">Semester</option>
                        <option>SS</option>
                        <option>WS</option>
                    </select>
                    <select v-if="semesterType == 'WS'" v-model="year" class="form-select input-select mx-2">
                        <option disabled :value="''">Year</option>
                        <option v-for="year in selectableYears" :key="year">{{ year }}/{{ year - 1999 }}</option>
                    </select>
                    <select v-else v-model="year" class="form-select input-select mx-2">
                        <option disabled :value="''">Year</option>
                        <option v-for="year in selectableYears" :key="year">{{ year }}</option>
                    </select>
                    <multi-select
                        class="w-1/2"
                        :input-list="fieldsOfStudy"
                        :placeholder="'Select a Field of Study'"
                        :pre-selection="selectedFieldsOfStudy"
                        @changed="updateSelectedFieldsOfStudy"
                    />
                    <button :disabled="!validSelection" class="btn btn-green-primary-500 px-2" @click="updateImmatriculation">
                        Update
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import MultiSelect from "@/components/MultiSelect.vue";
    import MatriculationManagement from "@/api/MatriculationManagement";
    import { onBeforeMount, ref, computed, reactive } from "vue";
    import { FieldOfStudy } from "@/api/api_models/user_management/FieldOfStudy";
    import { historyToSortedList } from "@/use/ImmatriculationHistoryHandler";
    import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
    import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
    import GenericResponseHandler from "@/use/GenericResponseHandler";

    export default {
        components: {
            MultiSelect,
        },
        props: {
            username: {
                type: String,
                required: true,
            },
        },
        setup(props: any) {
            let fieldsOfStudy = Object.values(FieldOfStudy).filter((e) => e != FieldOfStudy.NONE);
            let semesterType = ref("");
            let year = ref("");
            let selectedFieldsOfStudy = ref([] as FieldOfStudy[]);
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
                        semesters: ["SS2020", "WS2019/20", "SS2020"],
                    } as SubjectMatriculation,
                ],
            });
            let chronologicalList = ref({});

            let currentYear = new Date().getFullYear();
            let selectableYears = [];
            for (let index = currentYear; index >= currentYear - 5; index--) {
                selectableYears.push(index);
            }

            function updateSelectedFieldsOfStudy(value: any) {
                selectedFieldsOfStudy.value = value.value;
            }

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

            function resetYear() {
                year.value = "";
            }

            async function getHistory() {
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
                chronologicalList.value = historyToSortedList(history);
            }

            onBeforeMount(() => {
                getHistory();
            });

            async function updateImmatriculation() {
                let error = false;
                let successfullUpdates: number[] = [];
                const matriculationManagement: MatriculationManagement = new MatriculationManagement();
                // for(let i = 0; i < selectedFieldsOfStudy.value.length; i++ ) {
                //     const response = await matriculationManagement.updateMatriculationData(props.username, selectedFieldsOfStudy.value[i], selectedSemester.value);
                //     const responseHandler = new GenericResponseHandler();
                //     const result = responseHandler.handleReponse(response);
                //     if(response.statusCode != 200) {
                //         error = true;
                //         console.log("Something went wrong!")
                //     }
                //     else {
                //         console.log("Update: new Matriculationdata --->" + selectedSemester.value + " : " + selectedFieldsOfStudy.value[i]);
                //         successfullUpdates.push(i);
                //     }
                // }
                if (error) {
                    successfullUpdates.forEach((i) => {
                        selectedFieldsOfStudy.value = selectedFieldsOfStudy.value.filter((e) => e != selectedFieldsOfStudy.value[i]);
                    });
                } else {
                    semesterType.value = "";
                    year.value = "";
                    selectedFieldsOfStudy.value = [];
                }
                getHistory();
            }

            return {
                resetYear,
                fieldsOfStudy,
                chronologicalList,
                selectableYears,
                year,
                semesterType,
                selectedFieldsOfStudy,
                updateSelectedFieldsOfStudy,
                updateImmatriculation,
                validSelection,
            };
        },
    };
</script>
