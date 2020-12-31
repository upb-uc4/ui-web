<template>
    <base-view>
        <loading-spinner v-if="isLoading" />
        <div v-else>
            <section-header :title="heading" />
            <info-section
                v-model:name="course.courseName"
                v-model:type="course.courseType"
                v-model:language="course.courseLanguage"
                v-model:ects="course.ects"
                v-model:description="course.courseDescription"
                :error-bag="errorBag"
            />
            <lecturer-section v-if="isAdmin" v-model:lecturerId="course.lecturerId" :error-bag="errorBag" />
            <course-module-section
                v-model:module-ids="course.moduleIds"
                :error-bag="errorBag"
                :edit-mode="editMode"
                @toggle-module="toggleModule($event)"
                @remove-modules="removeModules($event)"
            />
            <restrictions-section v-model:participants-limit="course.maxParticipants" :error-bag="errorBag" />
            <time-section v-model:start="course.startDate" v-model:end="course.endDate" :error-bag="errorBag" />
            <button-section>
                <template #left>
                    <button
                        v-if="editMode"
                        id="deleteCourse"
                        type="button"
                        class="btn-secondary-remove-tmp w-48"
                        @click="confirmDeleteCourse"
                    >
                        Delete
                    </button>
                </template>
                <template #right>
                    <button id="cancel" type="button" class="w-32 btn-secondary-tmp" @click="back">Cancel</button>
                    <button v-if="editMode" id="saveChanges" :disabled="!hasInput" type="button" class="btn-tmp w-48" @click="back">
                        Save Changes
                    </button>
                    <button v-else id="createCourse" :disabled="!hasInput" class="btn-tmp w-48" @click="createCourse">Create Course</button>
                </template>
            </button-section>
            <delete-course-modal ref="deleteModal" />
            <unsaved-changes-modal ref="unsavedChangesModal" />
        </div>
    </base-view>
</template>

<script lang="ts">
    import Router from "@/use/router/";
    import { useStore } from "@/use/store/store";
    import { CourseEntity } from "@/entities/CourseEntity";
    import { CourseType } from "@/entities/CourseType";
    import { Language } from "@/entities/Language";
    import CourseManagement from "@/api/CourseManagement";
    import { computed, onBeforeMount, ref } from "vue";
    import DeleteCourseModal from "@/components/modals/DeleteCourseModal.vue";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import ValidationResponseHandler from "@/use/helpers/ValidationResponseHandler";
    import AccountValidationResponseHandler from "@/use/helpers/AccountValidationResponseHandler";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import { Role } from "@/entities/Role";
    import UnsavedChangesModal from "@/components/modals/UnsavedChangesModal.vue";
    import { onBeforeRouteLeave } from "vue-router";
    import LecturerSection from "@/components/course/edit/sections/LecturerSection.vue";
    import scrollToTopError from "@/use/helpers/TopError";
    import CourseModuleSection from "@/components/course/edit/sections/CourseModulesSection.vue";
    import { useToast } from "@/toast";
    import BaseView from "@/views/common/BaseView.vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import ButtonSection from "@/components/common/section/ButtonSection.vue";
    import InfoSection from "@/components/course/edit/sections/InfoSection.vue";
    import RestrictionsSection from "@/components/course/edit/sections/RestrictionsSection.vue";
    import TimeSection from "@/components/course/edit/sections/TimeSection.vue";
    import SectionHeader from "@/components/common/section/SectionHeader.vue";

    export default {
        name: "LecturerCreateCourseForm",
        components: {
            BaseView,
            SectionHeader,
            LecturerSection,
            InfoSection,
            RestrictionsSection,
            TimeSection,
            DeleteCourseModal,
            UnsavedChangesModal,
            LoadingSpinner,
            CourseModuleSection,
            ButtonSection,
        },
        props: {
            editMode: {
                type: Boolean,
                required: true,
            },
        },
        emits: ["update:has-input", "update:success"],

        setup(props: any, { emit }: any) {
            let isLoading = ref(false);
            let isAdmin = ref(false);
            let course = ref(new CourseEntity());
            let initialCourseState = new CourseEntity();
            let heading = props.editMode ? "Edit Course" : "Create Course";
            let success = ref(false);
            const courseManagement: CourseManagement = new CourseManagement();
            let deleteModal = ref();
            let unsavedChangesModal = ref();
            course.value.startDate = "2020-06-01";
            course.value.endDate = "2020-08-31";
            course.value.courseType = CourseType.LECTURE;
            course.value.courseLanguage = Language.ENGLISH;

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
                await askAdminRole();
                if (props.editMode) {
                    await getCourse();
                }
            });

            async function askAdminRole() {
                const store = useStore();
                isAdmin.value = (await store.getters.user).role == Role.ADMIN;
            }

            async function getLecturerUsername() {
                const store = useStore();
                course.value.lecturerId = (await store.getters.user).username;
            }

            async function getCourse() {
                isLoading.value = true;
                const response = await courseManagement.getCourse(Router.currentRoute.value.params.id as string);
                const genericResponseHandler = new GenericResponseHandler("course");
                const result = genericResponseHandler.handleResponse(response);

                //TODO move this to a non-generic response handler
                if (response.statusCode !== 200) {
                    alert("Course not found");
                } else {
                    course.value = new CourseEntity(result);
                    initialCourseState = JSON.parse(JSON.stringify(course.value));
                }
                isLoading.value = false;
            }

            let hasInput = computed(() => {
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
                if (!isAdmin.value) {
                    getLecturerUsername();
                }
                const response = await courseManagement.createCourse(course.value);
                const handler = new AccountValidationResponseHandler("user");
                success.value = handler.handleReponse(response);
                emit("update:success", success.value);

                if (success.value) {
                    toast.success("Course '" + course.value.courseName + "' created.");
                    back();
                } else {
                    errorBag.value = new ErrorBag(handler.errorList);
                    await scrollToTopError(errorBag.value.errors);
                }
            }

            async function updateCourse() {
                const response = await courseManagement.updateCourse(course.value);
                const handler = new ValidationResponseHandler("course");
                success.value = handler.handleResponse(response);
                emit("update:success", success.value);

                if (success.value) {
                    toast.success("Course '" + course.value.courseName + "' updated.");
                    back();
                } else {
                    errorBag.value = new ErrorBag(handler.errorList);
                    await scrollToTopError(errorBag.value.errors);
                }
            }

            async function deleteCourse() {
                const courseManagement: CourseManagement = new CourseManagement();

                const genericResponseHandler = new GenericResponseHandler("course");
                const response = await courseManagement.deleteCourse(course.value.courseId);
                const result = genericResponseHandler.handleResponse(response);

                if (result) {
                    toast.success("Course '" + course.value.courseName + "' deleted.");
                    back();
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
                Router.push("/all-courses");
            }

            function toggleModule(value: any) {
                if (course.value.moduleIds.includes(value)) {
                    course.value.moduleIds = course.value.moduleIds.filter((e) => e != value);
                } else {
                    course.value.moduleIds.push(value);
                    course.value.moduleIds.sort((one, two) => (one > two ? -1 : 1));
                }
            }

            function removeModules(value: any[]) {
                value.forEach((e) => {
                    course.value.moduleIds = course.value.moduleIds.filter((m) => m != e.id);
                });
            }

            return {
                isLoading,
                isAdmin,
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
                errorBag,
                toggleModule,
                removeModules,
            };
        },
    };
</script>
