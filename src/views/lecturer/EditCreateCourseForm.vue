<template>
    <div class="w-full lg:mt-20 mt-8 bg-gray-300 mx-auto h-screen">
        <button @click="back" class="flex items-center mb-4 navigation-link">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Course List</span>
        </button>

        <h1 class="text-2xl font-medium text-gray-700 mb-8"> {{ heading }} </h1>

        <div>
            <section class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Basics</label>
                        <label class="block text-gray-600">
                            This is some long detailed description which is part towards a better form.
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3">
                        <div class="mb-4 flex flex-col">
                            <!-- TODO: create cards for better visual impact -->
                            <label class="text-gray-700 text-md font-medium mb-3">Type</label>
                            <div class="flex">
                                <div class="mr-4" v-for="courseType in courseTypes" :key="courseType">
                                    <label class="flex items-center">
                                        <input type="radio" class="form-radio radio" name="type" :value="courseType"
                                               v-model="course.courseType">
                                        <span class="ml-2 text-gray-700 text-md font-medium">{{ courseType }}</span>
                                    </label>
                                </div>
                            </div>
                            <p v-if="hasError('courseType')" class="text-red-600 ml-1 mt-1">{{ showError('courseType') }}</p>
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label for="name" class="text-gray-700 text-md font-medium mb-3">Name</label>
                            <input type="text" id="name" name="courseName" v-model="course.courseName"
                                   class="w-full py-3 form-input-field">
                            <p v-if="hasError('courseName')" class="text-red-600 ml-1 mt-1">{{ showError('courseName') }}</p>
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Language</label>
                            <select required name="language" id="language" v-model="course.courseLanguage" class="w-full form-select block border-2 border-gray-400 rounded-lg text-gray-600 py-3">
                                <option disabled :value="''">Select a Language</option>
                                <option v-for="language in languages" :key="language">{{ language }}</option>
                            </select>
                            <p v-if="hasError('courseLanguage')" class="text-red-600 ml-1 mt-1">{{ showError('courseLanguage') }}</p>
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label for="description" class="text-gray-700 text-md font-medium mb-3">
                                Description
                                <span class="text-gray-600 font-normal">
                                    (Optional)
                                </span>
                            </label>
                            <textarea name="description" id="description" cols="30" rows="10" class="w-full form-textarea border-2 border-gray-400 rounded-lg text-gray-600"
                                      v-model="course.courseDescription" placeholder="Add an optional description.">
                            </textarea>
                            <p v-if="hasError('courseDescription')" class="text-red-600 ml-1 mt-1">{{ showError('courseDescription') }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-md font-medium mb-2">Restrictions</label>
                        <label class="block text-gray-600">
                            This is some long detailed description which is part towards a better form.
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3">
                        <div class="mb-4 flex flex-col">
                            <label for="limit" class="text-gray-700 text-md font-medium mb-3">Participation Limit</label>
                            <input type="number" name="maxParticipants" id="limit" min="0" max="999" class="w-full py-3 form-input-field"
                                   v-model="course.maxParticipants">
                            <p v-if="hasError('maxParticipants')" class="text-red-600 ml-1 mt-1">{{ showError('maxParticipants') }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-md font-medium mb-2">Time</label>
                        <label class="block text-gray-600">
                            This section is disabled for now as there is no Vue3 datepicker plugin yet.
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3 flex">
                        <div class="w-1/2 mb-4 mr-12 flex flex-col">
                            <label for="start" class="text-gray-700 text-md font-medium mb-3">Start Date</label>
                            <input type="text" disabled name="startDate" id="start" v-model="course.startDate"
                                   class="w-full py-3 form-input-field">
                            <p v-if="hasError('startDate')" class="text-red-600 ml-1 mt-1">{{ showError('startDate') }}</p>
                        </div>
                        <div class="w-1/2 mb-4 flex flex-col">
                            <label for="end" class="text-gray-700 text-md font-medium mb-3">End Date</label>
                            <input type="text" disabled name="endDate" id="end" v-model="course.endDate"
                                   class="w-full py-3 form-input-field">
                            <p v-if="hasError('endDate')" class="text-red-600 ml-1 mt-1">{{ showError('endDate') }}</p>
                        </div>
                    </div>
                </div>
            </section>
            <section class="border-t-2 py-8 border-gray-400 lg:mt-8">
                <div class="hidden sm:flex justify-between">
                    <div class="flex justify-start items-center">
                        <button v-if="editMode" @click="confirmDeleteCourse" type="button" class="w-32 btn btn-red-secondary">
                            Delete
                        </button>
                    </div>

                    <div class="flex justify-end items-center">
                        <button type="button" @click="back" class="w-32 mr-6 btn btn-blue-secondary">
                            Cancel
                        </button>
                        <button v-if="editMode" @click="updateCourse" :disabled="!hasInput" class="w-48 w-full btn btn-blue-primary">
                            Save Changes
                        </button>
                        <button v-else @click="createCourse" :disabled="!hasInput" class="w-48 btn btn-blue-primary">
                            Create Course
                        </button>
                    </div>
                </div>

                <!-- different button layout for mobile -->
                <div class="sm:hidden">
                    <button type="button" @click="back" class="mb-4 w-full btn btn-blue-secondary">
                        Cancel
                    </button>
                    <button v-if="editMode" :disabled="!hasInput" type="button" @click="updateCourse" class="mb-4 w-full w-full btn btn-blue-primary">
                        Save Changes
                    </button>
                    <button v-else :disabled="!hasInput" @click="createCourse" class="mb-4 w-full btn btn-blue-primary">
                        Create Course
                    </button>
                    <button @click="confirmDeleteCourse" class="w-full btn btn-red-secondary">
                        Delete
                    </button>
                </div>
            </section>

            <delete-course-modal ref="deleteModal"/>
            <unsaved-changes-modal ref="unsavedChangesModal"/>
        </div>
    </div>
</template>

<script lang="ts">
    import Router from "@/router/";
    import { store } from '@/store/store';
    import {CourseEntity} from "@/entities/CourseEntity";
    import {CourseType} from '@/entities/CourseType';
    import {Language} from '@/entities/Language'
    import CourseManagement from "@/api/CourseManagement"
    import {Role} from '@/entities/Role'
    import Course from "@/api/api_models/course_management/Course";
    import { ref,onMounted, computed, reactive } from 'vue';
    import DeleteCourseModal from "@/components/modals/DeleteCourseModal.vue";
    import UnsavedChangesModal from "@/components/modals/UnsavedChangesModal.vue";
    import useErrorHandler from '@/use/ErrorHandler';
    import ValidationResponseHandler from '@/use/ValidationResponseHandler';
    import GenericResponseHandler from "@/use/GenericResponseHandler"


    export default {
        name: "LecturerCreateCourseForm",
        props: {
            editMode:{
                type: Boolean,
                required: true
            }
        },
        components: {
            DeleteCourseModal,
            UnsavedChangesModal,
        },

        setup(props: any) {
            let course = ref(new CourseEntity());
            let initialCourseState = new CourseEntity();
            let heading = props.editMode ? "Edit Course" : "Create Course";
            let languages = Object.values(Language).filter(e => e != Language.NONE);
            let courseTypes = Object.values(CourseType).filter(e => e != CourseType.NONE);
            let success = ref(new Boolean());
            success.value = false;
            const courseManagement: CourseManagement = new CourseManagement();
            let unsavedChangesModal = ref();
            let deleteModal = ref();
            course.value.lecturerId = store.state.myId;
            course.value.startDate = "2020-06-01";
            course.value.endDate = "2020-08-31";

            let { errorList, hasError, showError} = useErrorHandler();
            let errors = reactive(errorList);

            onMounted( () => {
                if(props.editMode) {
                    loadCourse();
                }
            })

            async function loadCourse () {
                const courseManagement: CourseManagement = new CourseManagement();            
                const response = await courseManagement.getCourse(Router.currentRoute.value.params.id as string)
                const genericResponseHandler = new GenericResponseHandler();
                const result = genericResponseHandler.handleReponse(response);
                
                //TODO move this to a non-generic response handler
                if (response.statusCode !== 200) {
                    alert("Course not found")
                } else {
                    course.value = new CourseEntity(result);
                    initialCourseState = JSON.parse(JSON.stringify(course.value));
                }
            }
        

            let hasInput = computed (() => {
                 // TODO not tested yet (too lazy to start intellij)
                return !course.value.editableInfoEquals(initialCourseState);
            })

            let isValid = computed (() => {
                if(course.value.courseName == "" || course.value.courseLanguage != Language.NONE ||
                    course.value.courseType != CourseType.NONE || course.value.maxParticipants == 0) {
                    return false;
                }
                return true;
            })

            async function createCourse() {
                if(hasInput) {
                    const courseManagement: CourseManagement = new CourseManagement();

                    // delete old errors
                    errors.length = 0;
                    const response = await courseManagement.createCourse(course.value);
                    const handler =  new ValidationResponseHandler();
                    success.value = handler.handleReponse(response);

                    if(success.value) {
                        back();
                    } else {
                        errors.push(...handler.errorList);
                        //TODO: change the following line?
                        this.$forceUpdate()
                    }
                }
                else {
                    success.value = false;
                    console.log("Error: Input Validation Failed!")
                }
            }

            async function updateCourse() {
                if(hasInput) {
                    // delete old errors
                    errors.length = 0;
                    const response = await courseManagement.updateCourse(course.value);
                    const handler =  new ValidationResponseHandler();
                    success.value = handler.handleReponse(response);

                    if(success.value) {
                        back();
                    } else {
                        errors.push(...handler.errorList);
                        //TODO: change the following line?
                        this.$forceUpdate()
                    }
                }
                else {
                    success.value = false;
                    console.log("Error: Input Validation Failed!")
                }
            }

            async function deleteCourse() {
                const courseManagement: CourseManagement = new CourseManagement();

                const genericResponseHandler = new GenericResponseHandler();
                const response = await courseManagement.deleteCourse(course.value.courseId);
                const result = genericResponseHandler.handleReponse(response);

                if (result) {
                    Router.back()
                }
            }

            async function confirmDeleteCourse() {
                let modal = deleteModal.value;
                let action = modal.action;
                modal.show()
                    .then((response: typeof action) => {
                        switch(response) {
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
                languages,
                courseTypes,
                success,
                hasInput,
                isValid,
                back,
                loadCourse,
                createCourse,
                updateCourse,
                deleteCourse,
                confirmDeleteCourse,
                unsavedChangesModal,
                deleteModal,
                hasError,
                showError
            }
        },

        beforeRouteEnter(_from: any, _to: any, next: any) {
            const myRole = store.state.myRole;
            if (myRole != Role.LECTURER) {
                return next("/redirect");
            }
            return next();
        },

        async beforeRouteLeave(_from: any, _to: any, next: any) {
            if (this.success) {
                return next();
            }
            if (this.hasInput) {
                const modal = this.unsavedChangesModal;
                let action = modal.action;
                modal.show()
                    .then((response: typeof action) => {
                    switch(response) {
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
                })
            } else {
                next(true);
            }
        }
    };
</script>
