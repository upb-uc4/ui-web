<template>
    <div v-if="busy">
        <loading-component />
    </div>
    <div v-else class="w-full lg:mt-20 mt-8 bg-gray-300 mx-auto h-screen">
        <button class="flex items-center mb-4 navigation-link" @click="back">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Course List</span>
        </button>

        <h1 class="text-2xl font-medium text-gray-700 mb-8">{{ heading }}</h1>

        <div>
            <basics-section
                v-model:name="course.courseName"
                v-model:type="course.courseType"
                v-model:language="course.courseLanguage"
                v-model:description="course.courseDescription"
                :error-bag="errorBag"
            />
            <restrictions-section v-model:participants-limit="course.maxParticipants" :error-bag="errorBag" />
            <time-section v-model:start="course.startDate" v-model:end="course.endDate" :error-bag="errorBag" />

            <section class="border-t-2 py-8 border-gray-400 lg:mt-8">
                <div class="hidden sm:flex justify-between">
                    <div class="flex justify-start items-center">
                        <button
                            v-if="editMode"
                            id="deleteCourse"
                            type="button"
                            class="w-32 btn btn-red-secondary"
                            @click="confirmDeleteCourse"
                        >
                            Delete
                        </button>
                    </div>

                    <div class="flex justify-end items-center">
                        <button id="cancel" type="button" class="w-32 mr-6 btn btn-blue-secondary" @click="back">
                            Cancel
                        </button>
                        <button
                            v-if="editMode"
                            id="saveChanges"
                            :disabled="!hasInput"
                            class="w-48 w-full btn btn-blue-primary"
                            @click="updateCourse"
                        >
                            Save Changes
                        </button>
                        <button v-else id="createCourse" :disabled="!hasInput" class="w-48 btn btn-blue-primary" @click="createCourse">
                            Create Course
                        </button>
                    </div>
                </div>

                <!-- different button layout for mobile -->
                <div class="sm:hidden">
                    <button id="mobileCancel" type="button" class="mb-4 w-full btn btn-blue-secondary" @click="back">
                        Cancel
                    </button>
                    <button
                        v-if="editMode"
                        id="mobileSaveChanges"
                        :disabled="!hasInput"
                        type="button"
                        class="mb-4 w-full btn btn-blue-primary"
                        @click="updateCourse"
                    >
                        Save Changes
                    </button>
                    <button
                        v-else
                        id="mobileCreateCourse"
                        :disabled="!hasInput"
                        class="mb-4 w-full btn btn-blue-primary"
                        @click="createCourse"
                    >
                        Create Course
                    </button>
                    <button id="mobileDelete" class="w-full btn btn-red-secondary" @click="confirmDeleteCourse">
                        Delete
                    </button>
                </div>
            </section>
            <delete-course-modal ref="deleteModal" />
            <unsaved-changes-modal ref="unsavedChangesModal" />
        </div>
    </div>
</template>

<script lang="ts">
    import Router from "@/router/";
    import { useStore } from "@/store/store";
    import { CourseEntity } from "@/entities/CourseEntity";
    import { CourseType } from "@/entities/CourseType";
    import { Language } from "@/entities/Language";
    import CourseManagement from "@/api/CourseManagement";
    import { ref, computed, reactive, onBeforeMount } from "vue";
    import DeleteCourseModal from "@/components/modals/DeleteCourseModal.vue";
    import ErrorBag from "@/use/ErrorBag";
    import ValidationResponseHandler from "@/use/ValidationResponseHandler";
    import GenericResponseHandler from "@/use/GenericResponseHandler";
    import BasicsSection from "@/components/course/edit/BasicsSection.vue";
    import RestrictionsSection from "@/components/course/edit/RestrictionsSection.vue";
    import TimeSection from "@/components/course/edit/TimeSection.vue";
    import LoadingComponent from "../../components/loading/Spinner.vue";
    import { checkPrivilege } from "@/use/PermissionHelper";
    import { Role } from "@/entities/Role";
    import UnsavedChangesModal from "@/components/modals/UnsavedChangesModal.vue";

    export default {
        name: "LecturerCreateCourseForm",
        components: {
            BasicsSection,
            RestrictionsSection,
            TimeSection,
            DeleteCourseModal,
            UnsavedChangesModal,
            LoadingComponent,
        },
        async beforeRouteEnter(_to: any, _from: any, next: any) {
            const response = await checkPrivilege(Role.LECTURER);

            if (response.allowed) {
                return next();
            }
            if (!response.authenticated) {
                return next("/login");
            }

            return next("/redirect");
        },

        async beforeRouteLeave(to: any, from: any, next: any) {
            if (this.success) {
                return next();
            }
            if (this.hasInput) {
                const modal = this.unsavedChangesModal;
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
        },
        props: {
            editMode: {
                type: Boolean,
                required: true,
            },
        },
        emits: ["update:has-input", "update:success"],

        setup(props: any, { emit }: any) {
            let busy = ref(false);
            let course = ref(new CourseEntity());
            let initialCourseState = new CourseEntity();
            let heading = props.editMode ? "Edit Course" : "Create Course";
            let success = ref(false);
            const courseManagement: CourseManagement = new CourseManagement();
            let deleteModal = ref();
            let unsavedChangesModal = ref();
            course.value.startDate = "2020-06-01";
            course.value.endDate = "2020-08-31";

            const errorBag: ErrorBag = reactive(new ErrorBag());

            onBeforeMount(() => {
                getLecturerUsername();
                if (props.editMode) {
                    getCourse();
                }
            });

            async function getLecturerUsername() {
                const store = useStore();
                course.value.lecturerId = (await store.getters.loginData).username;
            }

            async function getCourse() {
                busy.value = true;
                const response = await courseManagement.getCourse(Router.currentRoute.value.params.id as string);
                const genericResponseHandler = new GenericResponseHandler();
                const result = genericResponseHandler.handleReponse(response);

                //TODO move this to a non-generic response handler
                if (response.statusCode !== 200) {
                    alert("Course not found");
                } else {
                    course.value = new CourseEntity(result);
                    initialCourseState = JSON.parse(JSON.stringify(course.value));
                }
                busy.value = false;
            }

            let hasInput = computed(() => {
                // TODO not tested yet (too lazy to start intellij)
                let returnValue: boolean = !course.value.editableInfoEquals(initialCourseState);
                emit("update:has-input", returnValue);
                return returnValue;
            });

            let isValid = computed(() => {
                if (
                    course.value.courseName == "" ||
                    course.value.courseLanguage == Language.NONE ||
                    course.value.courseType == CourseType.NONE ||
                    course.value.maxParticipants == 0
                ) {
                    return false;
                }
                return true;
            });

            async function createCourse() {
                const response = await courseManagement.createCourse(course.value);
                const handler = new ValidationResponseHandler();
                success.value = handler.handleReponse(response);
                emit("update:success", success.value);

                if (success.value) {
                    back();
                } else {
                    errorBag.replaceAllWith(handler.errorList);
                    //TODO: change the following line?
                    this.$forceUpdate();
                }
            }

            async function updateCourse() {
                const response = await courseManagement.updateCourse(course.value);
                const handler = new ValidationResponseHandler();
                success.value = handler.handleReponse(response);
                emit("update:success", success.value);

                if (success.value) {
                    back();
                } else {
                    errorBag.replaceAllWith(handler.errorList);
                    //TODO: change the following line?
                    this.$forceUpdate();
                }
            }

            async function deleteCourse() {
                const courseManagement: CourseManagement = new CourseManagement();

                const genericResponseHandler = new GenericResponseHandler();
                const response = await courseManagement.deleteCourse(course.value.courseId);
                const result = genericResponseHandler.handleReponse(response);

                if (result) {
                    Router.back();
                }
            }

            async function confirmDeleteCourse() {
                let modal = deleteModal.value;
                let action = modal.action;
                modal.show().then((response: typeof action) => {
                    switch (response) {
                        case action.CANCEL: {
                            //do nothing
                            break;
                        }
                        case action.DELETE: {
                            deleteCourse();
                            break;
                        }
                    }
                });
            }

            function back() {
                Router.back();
            }

            return {
                busy,
                course,
                initialCourseState,
                heading,
                success,
                hasInput,
                isValid,
                back,
                createCourse,
                updateCourse,
                deleteCourse,
                confirmDeleteCourse,
                deleteModal,
                unsavedChangesModal,
                errorBag: errorBag,
            };
        },
    };
</script>
