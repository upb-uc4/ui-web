<template>
    <base-view>
        <loading-spinner v-if="isLoading" title="Loading Course" />
        <div v-else>
            <section-header :title="course.courseName" />
            <presenter-section :lecturer="lecturer" />
            <info-section
                :name="course.courseName"
                :type="course.courseType"
                :language="course.courseLanguage"
                :ects="course.ects"
                :description="course.courseDescription"
            />
            <module-section v-model:selected="selectedModule" :module-ids="course.moduleIds" :registered="isRegistered" />
            <participants-section
                :full="isFull"
                :participants-limit="course.maxParticipants"
                :current-participants="course.currentParticipants"
            />
            <button-section>
                <template #left>
                    <button class="btn-secondary w-full sm:w-32" @click="back()">Back</button>
                </template>
                <template #right>
                    <button v-if="!isRegistered" id="joinCourse" :disabled="!valid" class="btn w-full sm:w-32" @click="joinCourse()">
                        Join
                    </button>
                    <button v-else id="dropCourse" class="btn-remove w-full sm:w-32" @click="dropCourse()">Drop</button>
                </template>
            </button-section>
        </div>
    </base-view>
</template>

<script lang="ts">
    import Router from "@/use/router/";
    import { useToast } from "@/toast";
    import Course from "@/api/api_models/course_management/Course";
    import { computed, onBeforeMount, ref } from "vue";
    import CourseManagement from "@/api/CourseManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import { CourseEntity } from "@/entities/CourseEntity";
    import UserManagement from "@/api/UserManagement";
    import { useStore } from "@/use/store/store";
    import AdmissionManagement from "@/api/AdmissionManagement";
    import CourseAdmission from "@/api/api_models/admission_management/CourseAdmission";
    import CertificateManagement from "@/api/CertificateManagement";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import BaseView from "@/views/common/BaseView.vue";
    import SectionHeader from "@/components/common/section/SectionHeader.vue";
    import PresenterSection from "@/components/course/info/sections/PresenterSection.vue";
    import InfoSection from "@/components/course/info/sections/InfoSection.vue";
    import ParticipantsSection from "@/components/course/info/sections/ParticipantsSection.vue";
    import ModuleSection from "@/components/course/info/sections/ModuleSection.vue";
    import ButtonSection from "@/components/common/section/ButtonSection.vue";
    import executeTransaction from "@/api/contracts/ChaincodeUtility";
    import { AddAdmissionTransaction } from "@/api/contracts/admission/transactions/AddAdmission";
    import { DropAdmissionTransaction } from "@/api/contracts/admission/transactions/DropAdmission";
import { AdmissionTypes } from '@/api/api_models/admission_management/AdmissionTypes';

    export default {
        name: "LecturerCreateCourseForm",
        components: {
            ButtonSection,
            PresenterSection,
            InfoSection,
            SectionHeader,
            BaseView,
            ParticipantsSection,
            LoadingSpinner,
            ModuleSection,
        },
        props: {
            isRegistered: {
                type: Boolean,
                required: true,
            },
        },
        emits: [],

        setup(props: any) {
            const isLoading = ref(true);
            const course = ref({} as Course);
            const lecturerName = ref("");

            const lecturer = ref();

            const selectedModule = ref("");
            const isFull = ref(false);
            const admission = ref();
            const admitted = ref(props.isRegistered);

            const store = useStore();
            const username = ref("");
            const enrollmentId = ref("");

            onBeforeMount(async () => {
                username.value = (await store.getters.user).username;
                await getEnrollmentID();
                await getCourse();
                await getLecturerName();
                if (admitted.value) {
                    await getAdmission();
                }
                isLoading.value = false;
            });

            let valid = computed(() => {
                return !props.isRegistered && selectedModule.value !== "" && selectedModule.value !== undefined;
            });

            async function getAdmission() {
                const admissionManagement = new AdmissionManagement();
                const handler = new GenericResponseHandler("admission");
                const resp = await admissionManagement.getCourseAdmissions(username.value, course.value.courseId);
                const result = handler.handleResponse(resp);
                if (result) {
                    admission.value = result[0];
                    selectedModule.value = admission.value.moduleId;
                }
            }

            async function getCourse() {
                const courseManagement = new CourseManagement();
                const response = await courseManagement.getCourse(Router.currentRoute.value.params.courseId as string);
                const genericResponseHandler = new GenericResponseHandler("course");
                const result = genericResponseHandler.handleResponse(response);

                if (result) {
                    course.value = new CourseEntity(result);
                    isFull.value = course.value.currentParticipants == course.value.maxParticipants;
                }
            }

            async function getLecturerName() {
                const userManagement = new UserManagement();
                const response = await userManagement.getSpecificUser(course.value.lecturerId);
                const genericResponseHandler = new GenericResponseHandler("lecturer");
                const result = genericResponseHandler.handleResponse(response);
                if (result) {
                    lecturer.value = result;
                    lecturerName.value = `${result.firstName} ${result.lastName}`;
                }
            }

            async function getEnrollmentID() {
                const certificateManagement = new CertificateManagement();
                const genericResponseHandler = new GenericResponseHandler("enrollment id");

                const resp = await certificateManagement.getOwnEnrollmentId();
                const result = genericResponseHandler.handleResponse(resp);
                if (result.length !== 0) {
                    enrollmentId.value = result[0].enrollmentId;
                }
            }

            async function joinCourse() {
                isLoading.value = true;
                const newAdmission: CourseAdmission = {
                    admissionId: "",
                    enrollmentId: "",
                    courseId: course.value.courseId,
                    moduleId: selectedModule.value,
                    type: AdmissionTypes.COURSE,
                    timestamp: "",
                };
                const result = await executeTransaction(new AddAdmissionTransaction(enrollmentId.value, newAdmission));
                if (result) {
                    const toast = useToast();
                    toast.success(`Successfully admitted for course ${course.value.courseName}`);
                    back();
                }
                isLoading.value = false;
            }

            async function dropCourse() {
                const result = await executeTransaction(new DropAdmissionTransaction(admission.value.admissionId));
                if (result) {
                    const toast = useToast();
                    toast.success(`Successfully dropped course ${course.value.courseName}`);
                    back();
                }
            }

            function back() {
                Router.go(-1);
            }

            return {
                isLoading,
                back,
                course,
                isFull,
                lecturerName,
                selectedModule,
                valid,
                joinCourse,
                dropCourse,
                admitted,
                lecturer,
            };
        },
    };
</script>
