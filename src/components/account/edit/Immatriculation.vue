<template>
    <div class="flex flex-col pl-2 mt-5">
        <label class="mb-3 text-sm font-medium text-gray-700">Immatriculation</label>
        <div class="flex flex-col items-start">
            <div v-for="pair in chronologicalList" :key="pair">
                <div v-for="fieldOfStudy in pair.fieldsOfStudy" :key="fieldOfStudy" class="flex flex-row">
                    <input disabled type="text" class="my-1 w-1/2 form-input input-text mr-2" :value="pair.semester" />
                    <input disabled type="text" class="my-1 w-1/2 form-input input-text" :value="fieldOfStudy" />
                </div>
            </div>
            <div class="w-full flex mt-5">
                <div class="flex flex-row items-start">
                    <select v-model="semesterType" class="form-select input-select">
                        <option disabled :value="''">Semester</option>
                        <option>SS</option>
                        <option>WS</option>
                    </select>
                    <select v-if="semesterType == 'WS'" v-model="year" type="text" class="form-select input-select mx-2">
                        <option disabled :value="''">Year</option>
                        <option v-for="year in selectableYears" :key="year">{{ year }}</option>
                    </select>
                    <select v-else v-model="year" class="form-select input-select mx-2">
                        <option disabled :value="''">Year</option>
                        <option v-for="year in selectableYears" :key="year">{{ year }}/{{ year - 1999 }}</option>
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
            const history = {
                matriculationId: "egal",
                firstName: "egal",
                lastName: "egal",
                birthDate: "egal",
                matriculationStatus: [
                    {
                        fieldOfStudy: "Computer Science",
                        semesters: ["WS2020/21", "SS2020"],
                    },
                    {
                        fieldOfStudy: "Mathematic",
                        semesters: ["SS2020"],
                    },
                ],
            };
            //TODO  sort by semester
            let chronologicalList: { semester: String; fieldsOfStudy: String[] }[] = [];
            history.matriculationStatus.forEach((e) => {
                e.semesters.forEach((s) => {
                    let exists = false;
                    chronologicalList.forEach((data) => {
                        if (data.semester == s) {
                            exists = true;
                            data.fieldsOfStudy.push(e.fieldOfStudy);
                            return;
                        }
                    });
                    if (!exists) {
                        chronologicalList.push({ semester: s, fieldsOfStudy: [e.fieldOfStudy] });
                    }
                });
            });

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

            // async function getHistory() {
            //     const matriculationManagement:MatriculationManagement = new MatriculationManagement();
            //     history = await matriculationManagement.getMatriculationHistory(props.username);
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
