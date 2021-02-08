<template>
    <base-view>
        <loading-spinner v-if="isLoading" />
        <div v-else>
            <section-header :title="heading" />
            <basics-section
                v-model:module-id="exam.moduleId"
                v-model:course-id="exam.courseId"
                v-model:ects="exam.ects"
                :error-bag="errorBag"
                :view-mode="viewMode"
                :courses="courses"
            />
            <date-section
                v-model:exam-date="exam.date"
                v-model:admit-until-date="exam.admittableUntil"
                v-model:drop-until-date="exam.droppableUntil"
                :view-mode="viewMode"
                :error-bag="errorBag"
            />

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
    import { useStore } from "vuex";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import CourseManagement from "@/api/CourseManagement";
    import Course from "@/api/api_models/course_management/Course";
    import DateSection from "@/components/exam/edit/DateSection.vue";

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
        },
        props: {
            viewMode: {
                type: Boolean,
                required: true,
            },
        },
        emits: ["update:has-input", "update:success"],

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
            let initialExamState = new ExamEntity();
            let heading = props.createMode ? "Create Exam" : "Exam";
            let success = ref(false);
            let unsavedChangesModal = ref();

            const courses = ref([] as Course[]);

            const errorBag = ref(new ErrorBag());

            const toast = useToast();

            onBeforeRouteLeave(async (to, from, next) => {
                if (success.value) {
                    return next();
                }
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
                await getMyCourses();
                if (props.viewMode) {
                    getExam();
                }
                isLoading.value = false;
            });

            async function getMyCourses() {
                const store = useStore();
                const username = (await store.getters.user).username;
                const genericResponseHandler = new GenericResponseHandler("courses");
                const courseManagement: CourseManagement = new CourseManagement();
                const response = await courseManagement.getCourses(undefined, username);
                courses.value = genericResponseHandler.handleResponse(response);

                //TODO REMOVE MOCK DATA
                courses.value.push({
                    courseDescription: "This is another course description.",
                    courseId: "-1",
                    courseLanguage: "German",
                    courseName: "VueJS Programming 1",
                    courseType: "Lecture",
                    currentParticipants: 5,
                    ects: 6,
                    startDate: "1999-01-01",
                    endDate: "2000-01-01",
                    lecturerId: "lecturer",
                    maxParticipants: 10,
                    moduleIds: ["M.1275.0000"],
                } as Course);
            }

            async function getExam() {
                //TODO GET EXAM VIA Router.currentRoute.value.params.id as string
                exam.value = new ExamEntity(mockedExam);
            }

            let hasInput = computed(() => {
                let returnValue: boolean = !exam.value.equals(initialExamState);
                emit("update:has-input", returnValue);
                return returnValue;
            });

            let isValid = computed(() => {
                //TODO
                return true;
            });

            async function createExam() {
                //TODO CREATE EXAM VIA API
                emit("update:success", success.value);
            }

            function back() {
                Router.push("/exams");
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
            };
        },
    };
</script>
