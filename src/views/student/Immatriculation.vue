<template>
    <base-view>
        <section-header title="Immatriculation" />
        <base-section title="Immatriculation Status" subtitle="Lookup and update your immatriculation data.">
            <div class="w-full">
                <label class="input-label">Immatriculation History</label>
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
        </base-section>
    </base-view>
</template>

<script lang="ts">
    import MultiSelect from "@/components/common/MultiSelect.vue";
    import { onBeforeMount, ref, computed } from "vue";
    import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import ImmatriculationHistory from "@/components/common/immatriculation/ImmatriculationHistory.vue";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import { useStore } from "@/use/store/store";
    import CertificateManagement from "@/api/CertificateManagement";
    import { useToast } from "@/toast";
    import { updateMatriculation } from "@/api/abstractions/FrontendSigning";
    import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
    import BaseView from "@/views/common/BaseView.vue";
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import SectionHeader from "@/components/common/section/SectionHeader.vue";

    export default {
        components: {
            SectionHeader,
            MultiSelect,
            LoadingSpinner,
            ImmatriculationHistory,
            BaseView,
            BaseSection,
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

                await updateMatriculation(enrollmentId.id, username.value, matriculationEntries);

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
