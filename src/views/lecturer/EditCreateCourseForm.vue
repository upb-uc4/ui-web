<template>
    <div class="w-full lg:mt-20 mt-8 bg-gray-300 mx-auto h-screen">
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
                        <button v-if="editMode" type="button" class="w-32 btn btn-red-secondary" @click="confirmDeleteCourse">
                            Delete
                        </button>
                    </div>

                    <div class="flex justify-end items-center">
                        <button type="button" class="w-32 mr-6 btn btn-blue-secondary" @click="back">
                            Cancel
                        </button>
                        <button v-if="editMode" :disabled="!hasInput" class="w-48 w-full btn btn-blue-primary" @click="updateCourse">
                            Save Changes
                        </button>
                        <button v-else :disabled="!hasInput" class="w-48 btn btn-blue-primary" @click="createCourse">
                            Create Course
                        </button>
                    </div>
                </div>

                <!-- different button layout for mobile -->
                <div class="sm:hidden">
                    <button type="button" class="mb-4 w-full btn btn-blue-secondary" @click="back">
                        Cancel
                    </button>
                    <button
                        v-if="editMode"
                        :disabled="!hasInput"
                        type="button"
                        class="mb-4 w-full btn btn-blue-primary"
                        @click="updateCourse"
                    >
                        Save Changes
                    </button>
                    <button v-else :disabled="!hasInput" class="mb-4 w-full btn btn-blue-primary" @click="createCourse">
                        Create Course
                    </button>
                    <button class="w-full btn btn-red-secondary" @click="confirmDeleteCourse">
                        Delete
                    </button>
                </div>
            </section>

            <delete-course-modal ref="deleteModal" />
        </div>
    </div>
</template>

<script lang="ts">
    import Router from "@/router/";
    import { store } from "@/store/store";
    import { CourseEntity } from "@/entities/CourseEntity";
    import { CourseType } from "@/entities/CourseType";
    import { Language } from "@/entities/Language";
    import CourseManagement from "@/api/CourseManagement";
    import { ref, computed, reactive } from "vue";
    import DeleteCourseModal from "@/components/modals/DeleteCourseModal.vue";
    import ErrorBag from "@/use/ErrorBag";
    import ValidationResponseHandler from "@/use/ValidationResponseHandler";
    import GenericResponseHandler from "@/use/GenericResponseHandler";
    import BasicsSection from "@/components/course/edit/BasicsSection.vue";
    import RestrictionsSection from "@/components/course/edit/RestrictionsSection.vue";
    import TimeSection from "@/components/course/edit/TimeSection.vue";

    export default {
        name: "LecturerCreateCourseForm",
        components: {
            BasicsSection,
            RestrictionsSection,
            TimeSection,
            DeleteCourseModal,
        },
        props: {
            editMode: {
                type: Boolean,
                required: true,
            },
        },

        async setup(props: any, { emit }: any) {
            let course = ref(new CourseEntity());
            let initialCourseState = new CourseEntity();
            let heading = props.editMode ? "Edit Course" : "Create Course";
            let success = ref(false);
            const courseManagement: CourseManagement = new CourseManagement();
            let deleteModal = ref();
            course.value.lecturerId = store.state.myId;
            course.value.startDate = "2020-06-01";
            course.value.endDate = "2020-08-31";

            const errorBag: ErrorBag = reactive(new ErrorBag());

            if (props.editMode) {
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
            }

            let hasInput = computed(() => {
                // TODO not tested yet (too lazy to start intellij)
                let returnValue: boolean = !course.value.editableInfoEquals(initialCourseState);
                emit("update:hasInput", returnValue);
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
                errorBag: errorBag,
            };
        },
    };
</script>
