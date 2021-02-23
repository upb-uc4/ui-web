<template>
    <base-view>
        <loading-spinner v-if="isLoading" />
        <div v-else>
            <section-header :title="heading" />
            <basics-section
                v-model:module-id="exam.moduleId"
                v-model:course-id="exam.courseId"
                v-model:exam-date="exam.date"
                v-model:ects="exam.ects"
                :error-bag="errorBag"
                :view-mode="viewMode"
                :courses="courses"
            />
            <date-section
                v-model:admit-until-date="exam.admittableUntil"
                v-model:drop-until-date="exam.droppableUntil"
                :view-mode="viewMode"
                :error-bag="errorBag"
            />
            <grading-section v-if="isLecturer && viewMode" :exam="exam" />

            <button-section>
                <template #right>
                    <button id="cancel" type="button" class="w-full sm:w-48 btn-secondary" @click="back">Cancel</button>
                    <button
                        v-if="!viewMode"
                        id="createExam"
                        :disabled="!hasInput"
                        type="button"
                        class="w-full w-48 btn"
                        @click="createExam"
                    >
                        Create Exam
                    </button>
                </template>
            </button-section>
            <unsaved-changes-modal ref="unsavedChangesModal" />
        </div>
    </base-view>
</template>

<script lang="ts">
    import Router from "@/use/router/";
    import { computed, onBeforeMount, ref } from "vue";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import UnsavedChangesModal from "@/components/modals/UnsavedChangesModal.vue";
    import { onBeforeRouteLeave } from "vue-router";
    import { useToast } from "@/toast";
    import BaseView from "@/views/common/BaseView.vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import ButtonSection from "@/components/common/section/ButtonSection.vue";
    import SectionHeader from "@/components/common/section/SectionHeader.vue";
    import { ExamEntity } from "@/components/exam/MockExamEntity";
    import BasicsSection from "@/components/exam/edit/BasicsSection.vue";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import CourseManagement from "@/api/CourseManagement";
    import Course from "@/api/api_models/course_management/Course";
    import DateSection from "@/components/exam/edit/DateSection.vue";
    import { useStore } from "@/use/store/store";
    import { Role } from "@/entities/Role";
    import GradingSection from "@/components/exam/edit/GradingSection.vue";
    import ExamManagement from "@/api/ExamManagement";
    import router from "@/use/router/";
    import executeTransaction from "@/api/contracts/ChaincodeUtility";
    import { CreateExamTransaction } from "@/api/contracts/exam/transactions/CreateExamTransaction";
    import { showOperationCreatedToast } from "@/use/helpers/Toasts";
    import CertificateManagement from "@/api/CertificateManagement";

    export default {
        name: "LecturerCreateCourseForm",
        components: {
            BaseView,
            SectionHeader,
            BasicsSection,
            UnsavedChangesModal,
            LoadingSpinner,
            ButtonSection,
            DateSection,
            GradingSection,
        },
        props: {
            viewMode: {
                type: Boolean,
                required: true,
            },
        },

        setup(props: any, { emit }: any) {
            const mockedExam = {
                examId: "ExampleGroup:M.1:Written Exam:2021-02-12T10:00:00",
                courseId: "-1",
                lecturerEnrollmentId: "0123456",
                moduleId: "M.1275.1111",
                type: "Written Exam",
                date: "2021-02-12T10:00:00",
                ects: 6,
                admittableUntil: "2021-01-12T23:59:59",
                droppableUntil: "2021-02-05T23:59:59",
            };

            let isLoading = ref(false);
            let exam = ref(new ExamEntity());
            let initialExamState = ref(new ExamEntity());
            let heading = props.createMode ? "Create Exam" : "Exam";
            let success = ref(false);
            let unsavedChangesModal = ref();

            const role = ref("");
            const courses = ref([] as Course[]);

            const errorBag = ref(new ErrorBag());

            const toast = useToast();

            onBeforeRouteLeave(async (to, from, next) => {
                if (hasInput.value) {
                    const modal = unsavedChangesModal.value;
                    let action = modal.action;
                    const response = await modal.show();
                    switch (response) {
                        case action.CANCEL: {
                            next(false);
                            break;
                        }
                        case action.CONFIRM: {
                            next(true);
                            break;
                        }
                        default: {
                            next(true);
                        }
                    }
                } else {
                    next(true);
                }
            });

            onBeforeMount(async () => {
                isLoading.value = true;
                const promises = [];
                promises.push(getRole());
                if (props.viewMode) {
                    promises.push(getExam());
                }
                await Promise.all(promises);
                await getMyCourses();
                isLoading.value = false;
            });

            const isLecturer = computed(() => {
                return role.value === Role.LECTURER;
            });

            async function getRole() {
                const store = useStore();
                role.value = await store.getters.role;
            }

            async function getMyCourses() {
                const store = useStore();
                const username = (await store.getters.user).username;
                const genericResponseHandler = new GenericResponseHandler("courses");
                const courseManagement: CourseManagement = new CourseManagement();
                let response;
                if (props.viewMode) {
                    response = await courseManagement.getCourse(exam.value.courseId);
                    courses.value = [genericResponseHandler.handleResponse(response)];
                } else {
                    response = await courseManagement.getCourses(undefined, username);
                    courses.value = genericResponseHandler.handleResponse(response);
                }
            }

            async function getExam() {
                //TODO GET EXAM VIA Router.currentRoute.value.params.id as string
                const exam_management = new ExamManagement();
                const handler = new GenericResponseHandler("exam");
                const response = await exam_management.getExams([router.currentRoute.value.params.id as string]);
                //exam.value = handler.handleResponse(response)[0];
                exam.value = new ExamEntity(mockedExam);
                initialExamState.value = new ExamEntity(exam.value);
            }

            let hasInput = computed(() => {
                let returnValue: boolean = !exam.value.equals(initialExamState.value);
                return returnValue;
            });

            let isValid = computed(() => {
                //TODO
                return true;
            });

            async function createExam() {
                isLoading.value = true;
                const store = useStore();
                exam.value.lecturerEnrollmentId = await getOwnEnrollmentID();
                //Set the type to "written exam" as "oral exams" are not supported yet
                exam.value.type = (await store.getters.configuration).examTypes[0];
                console.log(exam.value);
                if (await executeTransaction(new CreateExamTransaction(exam.value))) {
                    showOperationCreatedToast("exam");
                    exam.value = initialExamState.value;
                    back();
                }
                isLoading.value = false;
            }

            async function getOwnEnrollmentID(): Promise<string> {
                const cert_management = new CertificateManagement();
                const handler = new GenericResponseHandler("enrollment-ID");
                const pair = handler.handleResponse(await cert_management.getOwnEnrollmentId())[0];
                return pair.enrollmentId;
            }

            function back() {
                Router.push("/exams");
            }

            function gradeExam() {
                //TODO
            }

            return {
                isLoading,
                exam,
                initialExamState,
                heading,
                success,
                hasInput,
                isValid,
                back,
                createExam,
                unsavedChangesModal,
                errorBag,
                courses,
                isLecturer,
                gradeExam,
            };
        },
    };
</script>
