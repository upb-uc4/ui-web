<template>
    <section class="w-full h-screen mx-auto mt-8 bg-gray-300 lg:mt-20">
        <div class="lg:flex">
            <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                <label class="block mb-2 text-lg font-medium text-gray-700">Immatriculation Status</label>
                <label class="block text-gray-600">Lookup and update your immatriculation data.</label>
            </div>
            <div class="flex flex-col">
                <div class="flex flex-col pl-2 mt-5">
                    <label class="mb-3 text-sm font-medium text-gray-700">Immatriculation History</label>
                    <immatriculation-history :key="refreshKey" v-model:busy="busy" :username="username" />
                    <div v-if="busy">
                        <loading-spinner />
                    </div>
                    <div v-else id="immatriculationOptions" class="w-full flex flex-wrap mt-5">
                        <div class="flex flex-wrap items-start">
                            <select id="semesterType" v-model="semesterType" class="form-select input-select" @change="resetYear">
                                <option disabled :value="''">Semester</option>
                                <option>SS</option>
                                <option>WS</option>
                            </select>
                            <select id="semesterYear" v-model="year" class="form-select input-select xl:mx-2">
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
                                id="addImmatriculationData"
                                :disabled="!validSelection"
                                class="btn btn-green-primary-500 px-3 py-3"
                                @click="updateImmatriculation"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                    <p v-if="errorBag.hasNested('matriculation')" class="error-message">{{ errorBag.getNested("matriculation") }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import MultiSelect from "@/components/common/MultiSelect.vue";
    import MatriculationManagement from "@/api/MatriculationManagement";
    import { onBeforeMount, ref, computed, reactive, watch, onMounted } from "vue";
    import { historyToSortedList } from "@/use/helpers/ImmatriculationHistoryHandler";
    import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
    import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import ImmatriculationHistoryEntry from "@/components/common/immatriculation/ImmatriculationHistoryEntry.vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import ImmatriculationHistory from "@/components/common/immatriculation/ImmatriculationHistory.vue";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import { useStore } from "@/use/store/store";
    import CertificateManagement from "@/api/CertificateManagement";
    import { useToast } from "@/toast";
    import { showAPIToast } from "@/use/helpers/Toasts";
    import { updateMatriculation } from "@/api/abstractions/FrontendSigning";
    import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";

    export default {
        components: {
            MultiSelect,
            LoadingSpinner,
            ImmatriculationHistory,
        },
        setup(props: any, { emit }: any) {
            let refreshKey = ref(false);
            let busy = ref(0);
            let fieldsOfStudy = ref([] as string[]);
            let semesterType = ref("");
            let year = ref("");
            let selectedFieldsOfStudy = ref([] as string[]);
            const username = ref("");

            let currentYear = new Date().getFullYear();

            onBeforeMount(async () => {
                busy.value++;
                await getUsername();
                const examRegManagement = new ExaminationRegulationManagement();
                const response = await examRegManagement.getExaminationRegulation();
                fieldsOfStudy.value.push(
                    ...new GenericResponseHandler("examination regulations")
                        .handleResponse(response)
                        .filter((e) => e.active)
                        .map((e) => e.name)
                );

                busy.value--;
            });

            async function getUsername() {
                const store = useStore();
                username.value = (await store.getters.user).username;
            }

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

            let errorBag = ref(new ErrorBag());

            const toast = useToast();

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

            function resetYear() {
                year.value = "";
            }

            function updateSelectedFieldsOfStudy(value: any) {
                selectedFieldsOfStudy.value = value.value;
            }

            async function updateImmatriculation() {
                busy.value++;
                let error = false;
                let matriculationEntries: SubjectMatriculation[] = [];
                selectedFieldsOfStudy.value
                    .filter((s) => s != "")
                    .forEach((entry) => {
                        matriculationEntries.push({ fieldOfStudy: entry, semesters: [selectedSemester.value] });
                    });

                const enrollmentIdResponse = await new CertificateManagement().getEnrollmentId(username.value);
                const responseHandler = new GenericResponseHandler("enrollment id");
                const enrollmentId = responseHandler.handleResponse(enrollmentIdResponse);

                await updateMatriculation(enrollmentId.id, matriculationEntries);

                busy.value--;
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
                errorBag,
                username,
            };
        },
    };
</script>
