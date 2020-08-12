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
                </div>
                <multi-select
                    class="w-1/2"
                    :input-list="fieldsOfStudy"
                    :placeholder="'Select a Field of Study'"
                    :pre-selection="[]"
                    @changed="updateFieldsOfStudy"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import MultiSelect from "@/components/MultiSelect.vue";
    import MatriculationManagement from "@/api/MatriculationManagement";
    import { onBeforeMount, ref, computed } from "vue";
    import { FieldOfStudy } from "@/api/api_models/user_management/FieldOfStudy";
    import { historyToSortedList } from "@/use/ImmatriculationHistoryHandler";
    import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
    import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";

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
            let selectedFieldsOfStudy = ref([] as String[]);
            const history: MatriculationData = {
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
            };

            let chronologicalList = historyToSortedList(history);

            let currentYear = new Date().getFullYear();
            let selectableYears = [];
            for (let index = currentYear; index >= currentYear - 5; index--) {
                selectableYears.push(index);
            }

            let list: String[] = [];
            history.matriculationStatus.forEach((e) => list.unshift(e.fieldOfStudy));

            function updateFieldsOfStudy(value: any) {
                selectedFieldsOfStudy.value = value.value;
            }

            let newMatriculation = computed(() => {
                return { fieldsOfStudy: selectedFieldsOfStudy.value, semester: semesterType.value + year.value };
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
            // }

            // onBeforeMount(() => {
            //     getHistory()
            //  })
            return {
                history,
                list,
                fieldsOfStudy,
                chronologicalList,
                selectableYears,
                year,
                semesterType,
                selectedFieldsOfStudy,
                newMatriculation,
                updateFieldsOfStudy,
            };
        },
    };
</script>
