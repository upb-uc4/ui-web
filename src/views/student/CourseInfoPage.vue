<template>
    <div v-if="busy > 0" class="flex h-screen">
        <div class="m-auto">
            <loading-component />
        </div>
    </div>
    <div v-else class="w-full lg:mt-20 mt-8 bg-gray-300 mx-auto h-screen">
        <button class="flex items-center mb-4 navigation-link" @click="back">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Back</span>
        </button>

        <h1 class="text-2xl font-medium text-gray-700 mb-8">{{ course.courseName }}</h1>
        <div>
            <lecturer-section :lecturer="lecturerName" :lecturer-id="course.lecturerId" />
            <basics-section
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

            <section class="border-t-2 py-8 border-gray-400 lg:mt-8">
                <div class="hidden sm:flex w-full">
                    <div class="flex justify-between items-center w-full">
                        <button id="cancel" type="button" class="w-32 mr-6 btn btn-blue-secondary" @click="back">Cancel</button>
                        <button
                            v-if="!isRegistered"
                            id="joinCourse"
                            :disabled="!valid"
                            class="w-48 btn btn-blue-primary"
                            @click="joinCourse"
                        >
                            Join
                        </button>
                        <button v-else id="dropCourse" class="w-48 btn btn-red-primary" @click="dropCourse">Drop</button>
                    </div>
                </div>

                <!-- different button layout for mobile -->
                <div class="sm:hidden">
                    <button id="mobileCancel" type="button" class="mb-4 w-full btn btn-blue-secondary" @click="back">Cancel</button>
                    <button
                        v-if="!admitted"
                        id="mobileJoinCourse"
                        :disabled="!valid"
                        type="button"
                        class="mb-4 w-full btn btn-blue-primary"
                        @click="joinCourse"
                    >
                        Join
                    </button>
                    <button v-else id="mobileDropCourse" class="w-full btn btn-red-primary" @click="dropCourse">Drop</button>
                </div>
            </section>
        </div>
    </div>
</template>

<script lang="ts">
    import Router from "@/use/router/";
    import LecturerSection from "@/components/course/info/sections/LecturerSection.vue";
    import BasicsSection from "@/components/course/info/sections/BasicsSection.vue";
    import ParticipantsSection from "@/components/course/info/sections/ParticipantsSection.vue";
    import LoadingComponent from "@/components/common/loading/Spinner.vue";
    import ModuleSection from "@/components/course/info/sections/ModulesSection.vue";
    import { useToast } from "@/toast";
    import Course from "@/api/api_models/course_management/Course";
    import { computed, onBeforeMount, ref } from "vue";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import CourseManagement from "@/api/CourseManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import { CourseEntity } from "@/entities/CourseEntity";
    import UserManagement from "@/api/UserManagement";
    import { useStore } from "@/use/store/store";
    import Lecturer from "@/api/api_models/user_management/Lecturer";
    import AdmissionManagement from "@/api/AdmissionManagement";
    import CourseAdmission from "@/api/api_models/admission_management/CourseAdmission";
    import { addCourseAdmission, dropCourseAdmission } from "@/api/abstractions/FrontendSigning";
    import CertificateManagement from "@/api/CertificateManagement";

    export default {
        name: "LecturerCreateCourseForm",
        components: {
            LecturerSection,
            BasicsSection,
            ParticipantsSection,
            LoadingComponent,
            ModuleSection,
        },
        props: {
            isRegistered: {
                type: Boolean,
                required: true,
            },
        },
        emits: [],

        setup(props: any, { emit }: any) {
            let busy = ref(0);
            const errorBag = ref(new ErrorBag());
            const toast = useToast();
            const course = ref({} as Course);
            const lecturerName = ref("");
            const selectedModule = ref("");
            const isFull = ref(false);
            const admission = ref();
            const admitted = ref(props.isRegistered);

            const store = useStore();
            const username = ref("");
            const enrollmentId = ref("");

            onBeforeMount(async () => {
                busy.value++;
                username.value = (await store.getters.user).username;
                await getEnrollmentID();
                await getCourse();
                await getLecturerName();
                if (admitted.value) {
                    await getAdmission();
                }
                busy.value--;
            });

            let valid = computed(() => {
                if (!props.isRegistered && selectedModule.value !== "" && selectedModule.value !== undefined) {
                    return true;
                }
                return false;
            });

            async function getAdmission() {
                busy.value++;
                const admissionManagement = new AdmissionManagement();
                const handler = new GenericResponseHandler("admission");
                const resp = await admissionManagement.getCourseAdmissions(username.value, course.value.courseId);
                const result = handler.handleResponse(resp);
                if (result) {
                    admission.value = result[0];
                    selectedModule.value = admission.value.moduleId;
                }
                busy.value--;
            }

            async function getCourse() {
                busy.value++;
                const courseManagement = new CourseManagement();
                const response = await courseManagement.getCourse(Router.currentRoute.value.params.courseId as string);
                const genericResponseHandler = new GenericResponseHandler("course");
                const result = genericResponseHandler.handleResponse(response);

                if (result) {
                    course.value = new CourseEntity(result);
                    isFull.value = course.value.currentParticipants == course.value.maxParticipants;
                }
                busy.value--;
            }

            async function getLecturerName() {
                busy.value++;
                const userManagement = new UserManagement();
                const response = await userManagement.getSpecificUser(course.value.lecturerId);
                const genericResponseHandler = new GenericResponseHandler("lecturer");
                const result = genericResponseHandler.handleResponse(response);
                if (result) {
                    lecturerName.value = `${result.firstName} ${result.lastName}`;
                }
                busy.value--;
            }

            async function getEnrollmentID() {
                busy.value++;
                const certificateManagement = new CertificateManagement();
                const genericResponseHandler = new GenericResponseHandler("enrollment id");

                const resp = await certificateManagement.getOwnEnrollmentId();
                const result = genericResponseHandler.handleResponse(resp);
                if (result) {
                    enrollmentId.value = result.id;
                }
                busy.value--;
            }

            async function joinCourse() {
                busy.value++;
                const newAdmission: CourseAdmission = {
                    admissionId: "",
                    enrollmentId: "",
                    courseId: course.value.courseId,
                    moduleId: selectedModule.value,
                    timestamp: "",
                };
                const result = await addCourseAdmission(enrollmentId.value, newAdmission);
                if (result) {
                    const toast = useToast();
                    toast.success(`Successfully admitted for course ${course.value.courseName}`);
                    back();
                }
                busy.value--;
            }

            async function dropCourse() {
                busy.value++;
                const result = await dropCourseAdmission(admission.value.admissionId);
                if (result) {
                    const toast = useToast();
                    toast.success(`Successfully dropped course ${course.value.courseName}`);
                    back();
                }
                busy.value--;
            }

            function back() {
                Router.push("/courses");
            }

            return {
                busy,
                back,
                errorBag,
                course,
                isFull,
                lecturerName,
                selectedModule,
                valid,
                joinCourse,
                dropCourse,
                admitted,
            };
        },
    };
</script>
