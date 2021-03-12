<template>
    <div>
        <loading-component v-if="isLoading" title="Loading Exams..." />
        <list-placeholder v-else-if="shownExams.length == 0" content-type="exams" />
        <div v-for="exam in shownExams" v-else :key="exam.examId" class="mt-6">
            <exam-row
                :is-student="isStudent"
                :exam-grade="examResults.find((result) => result.examId == exam.examId)?.grade"
                :exam-admissions="examAdmissions"
                :exam="exam"
                :course="getCourse(exam.courseId)"
            />
            <hr class="my-6 dark:border-normalgray-700" />
        </div>
    </div>
</template>

<script lang="ts">
    import { useStore } from "@/use/store/store";
    import { Role } from "@/entities/Role";
    import ExamRow from "./ExamRow.vue";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import { computed, ref, onBeforeMount, watch } from "vue";
    import LoadingComponent from "@/components/common/loading/Spinner.vue";
    import CourseManagement from "@/api/CourseManagement";
    import Course from "@/api/api_models/course_management/Course";
    import ExamManagement from "@/api/ExamManagement";
    import CertificateManagement from "@/api/CertificateManagement";
    import APIResponse from "@/api/helpers/models/APIResponse";
    import AdmissionManagement from "@/api/AdmissionManagement";
    import Exam from "@/api/api_models/exam_management/Exam";
    import ExamResult from "@/api/api_models/exam_result_management/ExamResult";
    import ExamResultManagement from "@/api/ExamResultManagement";
    import ListPlaceholder from "@/components/common/ListPlaceholder.vue";

    export default {
        name: "CourseList",
        components: {
            ExamRow,
            LoadingComponent,
            ListPlaceholder,
        },
        props: {
            selectedType: {
                type: String,
                required: true,
            },
            filter: {
                type: String,
                required: true,
            },
            showAllCourses: {
                type: Boolean,
                required: true,
            },
        },
        emits: ["updated"],
        setup(props: any, { emit }: any) {
            let isLoading = ref(false);
            const roles = Object.values(Role).filter((e) => e != Role.NONE);
            const courses = ref([] as Course[]);
            let role = ref("");
            let isAdmin = ref(false);
            let exams = ref([] as Exam[]);
            const examAdmissions = ref([] as any[]);
            let username = ref("");
            const examResults = ref([] as ExamResult[]);

            onBeforeMount(async () => {
                isLoading.value = true;
                await getUserInfo();
                let promises = [];
                if (isStudent.value) {
                    promises.push(getStudentExams());
                    promises.push(getExamAdmissions());
                    promises.push(getExamResults());
                } else {
                    promises.push(getLecturerExams());
                }
                await Promise.all(promises);
                isLoading.value = false;
            });

            const isStudent = computed(() => {
                return role.value === Role.STUDENT;
            });

            async function getExamResults() {
                const exam_result_management = new ExamResultManagement();
                const handler = new GenericResponseHandler("exam results");
                examResults.value = handler.handleResponse(await exam_result_management.getExamResults(username.value));
            }

            async function getUserInfo() {
                const store = useStore();
                role.value = await store.getters.role;
                username.value = (await store.getters.user).username;
            }
            async function getLecturerExams() {
                const enrollmentId = await getOwnEnrollmentId();
                const genericResponseHandler = new GenericResponseHandler("exams");
                const exam_management = new ExamManagement();
                const examResponse = await exam_management.getExams(undefined, undefined, [enrollmentId]);
                exams.value = genericResponseHandler.handleResponse(examResponse);

                const course_management = new CourseManagement();
                const handler = new GenericResponseHandler("courses");
                const courseResponse = await course_management.getCourses(undefined, (await useStore().getters.user).username);
                courses.value = handler.handleResponse(courseResponse);
            }

            async function getStudentExams() {
                const admissionManagement = new AdmissionManagement();
                const course_management = new CourseManagement();
                const handler = new GenericResponseHandler("admitted courses");
                const resp = await admissionManagement.getCourseAdmissions(username.value);
                const result = handler.handleResponse(resp);
                let tmpCourses = [] as Course[];
                for (const m of result) {
                    let response: APIResponse<Course>;
                    response = await course_management.getCourse(m.courseId);
                    let result = handler.handleResponse(response);
                    if (result) tmpCourses.unshift(result);
                }
                courses.value = tmpCourses;
                if (courses.value.length > 0) {
                    const genericResponseHandler = new GenericResponseHandler("exams");
                    const exam_management = new ExamManagement();
                    const examResponse = await exam_management.getExams(
                        undefined,
                        courses.value.map((course) => course.courseId),
                        undefined,
                        result.map((r) => r.moduleId)
                    );
                    exams.value = genericResponseHandler.handleResponse(examResponse);
                }
            }

            async function getOwnEnrollmentId(): Promise<string> {
                const cert_management = new CertificateManagement();
                const handler = new GenericResponseHandler("enrollment-ID");
                return handler.handleResponse(await cert_management.getOwnEnrollmentId())[0].enrollmentId;
            }

            async function getExamAdmissions() {
                const admission_management = new AdmissionManagement();
                const handler = new GenericResponseHandler("exam admissions");
                examAdmissions.value = handler.handleResponse(
                    await admission_management.getExamAdmissions((await useStore().getters.user).username)
                );
            }

            let shownExams = computed(() => {
                let filteredExams = props.selectedType == "All" ? exams.value : exams.value.filter((e) => e.type == props.selectedType);
                if (props.filter != "") {
                    let filter = props.filter.toLowerCase();
                    filteredExams = filteredExams.filter(
                        (e) =>
                            e.examId.toLowerCase().replace(/\s/g, "").includes(filter.replace(/\s/g, "")) ||
                            e.courseId.toLowerCase().replace(/\s/g, "").includes(filter.replace(/\s/g, "")) ||
                            e.moduleId.toLowerCase().replace(/\s/g, "").includes(filter.replace(/\s/g, "")) ||
                            courses.value.some(
                                (course) =>
                                    course.courseId == e.courseId &&
                                    course.courseName.toLowerCase().replace(/\s/g, "").includes(filter.replace(/\s/g, ""))
                            )
                    );
                }
                emit("updated", filteredExams.length);
                return filteredExams;
            });

            function getCourse(courseId: string) {
                return courses.value.filter((course) => course.courseId == courseId)[0];
            }

            return {
                isLoading,
                role,
                roles,
                shownExams,
                isAdmin,
                username,
                getCourse,
                examAdmissions,
                isStudent,
                examResults,
            };
        },
    };
</script>
