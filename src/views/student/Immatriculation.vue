<template>
    <base-view>
        <section-header title="Immatriculation" />
        <base-section title="History" subtitle="Show your immatriculation history.">
            <div class="w-full">
                <immatriculation-history :key="refreshKey" v-model:isLoading="isLoading" :username="username" />
            </div>
        </base-section>
        <base-section title="Manage" subtitle="Keep your immatriculation up to date.">
            <div class="w-full">
                <loading-spinner v-if="isLoading" />
                <div v-else id="immatriculationOptions" class="space-y-6">
                    <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                        <div class="lg:w-1/2 w-full">
                            <label class="input-label"> Semester </label>
                            <Select
                                id="immatriculationSelectSemesterCycle"
                                v-model:selection="semesterType"
                                class="w-48"
                                placeholder="Semester"
                                :elements="['SS', 'WS']"
                            />
                        </div>
                        <div class="lg:w-1/2 w-full">
                            <label class="input-label"> Year </label>
                            <Select
                                id="immatriculationSelectSemesterCycle"
                                v-model:selection="year"
                                placeholder="Year"
                                :elements="selectableYears"
                            />
                        </div>
                    </div>
                    <div>
                        <div class="w-full">
                            <label class="input-label"> Select Fields of Study </label>
                            <searchable-select
                                v-model:selected="searchSelection"
                                placeholder="Search fields of studies"
                                :elements="availableFieldsOfStudy"
                                :clear-input-on-select="true"
                                @update:selected="addFieldOfStudy"
                            />
                            <tag-list
                                v-if="selectedFieldsOfStudy.length > 0"
                                class="mt-4"
                                :elements="selectedFieldsOfStudy"
                                @on-remove="removeFieldOfStudy"
                            />
                            <span v-else class="input-label-warning">Please select at least one field of study.</span>
                        </div>
                    </div>
                </div>
                <p v-if="errorBag.hasNested('matriculation')" class="error-message">{{ errorBag.getNested("matriculation") }}</p>
            </div>
        </base-section>
        <button-section>
            <template #right>
                <button id="addImmatriculationData" :disabled="!validSelection" class="btn w-full lg:w-64" @click="updateImmatriculation">
                    Update
                </button>
            </template>
        </button-section>
    </base-view>
</template>

<script lang="ts">
    import { computed, onBeforeMount, ref } from "vue";
    import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import ImmatriculationHistory from "@/components/common/immatriculation/ImmatriculationHistory.vue";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import { useStore } from "@/use/store/store";
    import CertificateManagement from "@/api/CertificateManagement";
    import { useToast } from "@/toast";
    import { updateMatriculation } from "@/api/abstractions/FrontendSigning";
    import BaseView from "@/views/common/BaseView.vue";
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import SectionHeader from "@/components/common/section/SectionHeader.vue";
    import Select from "@/components/common/Select.vue";
    import ButtonSection from "@/components/common/section/ButtonSection.vue";
    import SearchableSelect from "@/components/common/SearchableSelect.vue";
    import TagList from "@/components/common/TagList.vue";
    import SearchSelectOption from "@/use/helpers/SearchSelectOption";
    import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";

    export default {
        components: {
            ButtonSection,
            Select,
            SectionHeader,
            LoadingSpinner,
            ImmatriculationHistory,
            BaseView,
            BaseSection,
            TagList,
            SearchableSelect,
        },
        setup() {
            let refreshKey = ref(false);
            let isLoading = ref(true);
            let fieldsOfStudy = ref(["Computer Science", "Physics", "Mechanical Engineering"] as string[]);
            let semesterType = ref("");
            let year = ref("");
            let selectedFieldsOfStudy = ref([] as string[]);
            const username = ref("");
            const searchSelection = ref();

            let currentYear = new Date().getFullYear();

            onBeforeMount(async () => {
                await getUsername();
                const examRegManagement = new ExaminationRegulationManagement();
                const response = await examRegManagement.getExaminationRegulation();
                fieldsOfStudy.value.push(
                    ...new GenericResponseHandler("examination regulations")
                        .handleResponse(response)
                        .filter((e) => e.active)
                        .map((e) => e.name)
                );

                isLoading.value = false;
            });

            const availableFieldsOfStudy = computed(() =>
                fieldsOfStudy.value
                    .filter(
                        (fieldOfStudy: string) =>
                            !selectedFieldsOfStudy.value.some((selectedFieldOfStudy: string) => fieldOfStudy === selectedFieldOfStudy)
                    )
                    .map((field: string) => {
                        return {
                            value: field,
                            display: field,
                        };
                    })
            );

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

            function updateSelectedFieldsOfStudy(value: any) {
                selectedFieldsOfStudy.value = value.value;
            }

            async function updateImmatriculation() {
                isLoading.value = true;
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

                isLoading.value = false;
                refreshKey.value = !refreshKey.value;
            }

            function removeFieldOfStudy(index: number) {
                selectedFieldsOfStudy.value.splice(index, 1);
            }

            function addFieldOfStudy(field: SearchSelectOption) {
                selectedFieldsOfStudy.value.push(field.value as string);
            }

            return {
                addFieldOfStudy,
                removeFieldOfStudy,
                availableFieldsOfStudy,
                isLoading,
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
                searchSelection,
            };
        },
    };
</script>
