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
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label for="name" class="text-gray-700 text-md font-medium mb-3">Name</label>
                            <input type="text" id="name" name="courseName" v-model="course.courseName"
                                   class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Language</label>
                            <select required name="language" id="language" v-model="course.courseLanguage" class="w-full form-select block border-2 border-gray-400 rounded-lg text-gray-600 py-3">
                                <option v-for="language in languages" :key="language">{{ language }}</option>
                            </select>
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
                            <input type="number" name="maxParticipants" id="limit" min="0" max="999" class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                   v-model="course.maxParticipants">
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
                            <input type="text" readonly name="startDate" id="start" v-model="course.startDate"
                                   class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input bg-gray-300 focus:outline-none focus:shadow-none focus:border-gray-400">
                        </div>
                        <div class="w-1/2 mb-4 flex flex-col">
                            <label for="end" class="text-gray-700 text-md font-medium mb-3">End Date</label>
                            <input type="text" readonly name="endDate" id="end" v-model="course.endDate"
                                   class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input bg-gray-300 focus:outline-none focus:shadow-none focus:border-gray-400">
                        </div>
                    </div>
                </div>
            </section>
            <section class="border-t-2 py-8 border-gray-400 lg:mt-8">
                <div class="hidden sm:flex justify-between">
                    <div class="flex justify-start items-center">
                        <button v-if="editMode" @click="showDeleteModal" type="button" class="w-32 btn btn-red-secondary">
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
                    <button @click="showDeleteModal" class="w-full btn btn-red-secondary">
                        Delete
                    </button>
                </div>
            </section>

            <delete-course-modal :showing="showingDeleteModal" v-on:cancel="hideDeleteModal" v-on:delete="deleteCourse"/>
            <unsaved-changes-modal ref="unsavedChangesModalRef" :showing="showingUnsavedChangesModal"/>
        </div>
    </div>
</template>

<script lang="ts">
    import Router from "@/router/";
    import { store } from '@/store/store';
    import {Course} from "@/entities/Course";
    import {CourseType} from '@/entities/CourseType';
    import {Language} from '@/entities/Language'
    import Course_Management from "@/api/Course_Management"
    import {Role} from '@/entities/Role'

    import { ref,onMounted, computed } from 'vue';
    import DeleteCourseModal from "@/components/modals/DeleteCourseModal.vue";
    import UnsavedChangesModal from "@/components/modals/UnsavedChangesModal.vue";

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


        setup(props) {
            let course = ref(new Course());
            let initialCourseState = new Course();
            let heading = props.editMode ? "Edit Course" : "Create Course";
            let languages = Object.values(Language).filter(e => e != Language.NONE);
            let courseTypes = Object.values(CourseType).filter(e => e != CourseType.NONE);
            let success = ref(new Boolean());
            success.value = false;
            let showingDeleteModal = ref(new Boolean());
            showingDeleteModal.value = false;
            let showingUnsavedChangesModal = ref(new Boolean());
            showingUnsavedChangesModal.value = false;
            const course_management: Course_Management = new Course_Management();


            let unsavedChangesModalRef = ref(null);



            course.value.lecturerId = store.state.myId;
            course.value.startDate = "2020-06-01";
            course.value.endDate = "2020-08-31";

            onMounted( () => {
                if(props.editMode) {
                    loadCourse();
                }
            })

            function loadCourse () {
                const course_management: Course_Management = new Course_Management();
                course_management.getCourse(Router.currentRoute.value.params.id as string).then((v : {course: Course, found: boolean}) => {
                    course.value = v.course;
                    initialCourseState = JSON.parse(JSON.stringify(course.value));
                    if (!v.found) {
                        //todo no course with that ID
                    }
                });
            }

            let hasInput = computed (() => {
                //TODO transform if conditions to class method in Course.ts
                if (course.value.courseName !== initialCourseState.courseName || course.value.courseDescription !== initialCourseState.courseDescription || course.value.courseLanguage !== initialCourseState.courseLanguage ||
                    course.value.courseType !== initialCourseState.courseType || course.value.maxParticipants !== initialCourseState.maxParticipants) {
                    return true;
                }
                return false;
            })

            let isValid = computed (() => {
                if(course.value.courseName == "" || course.value.courseLanguage != Language.NONE ||
                    course.value.courseType != CourseType.NONE || course.value.maxParticipants == 0) {
                    return false;
                }
                return true;
            })

            function createCourse() {
                if(hasInput) {
                    const course_management: Course_Management = new Course_Management();
                    course_management.createCourse(course.value).then(() => {
                        success.value = true;
                        Router.back();
                    });
                }
                else {
                    success.value = false;
                    console.log("Error: Input Validation Failed!")
                }
            }

            function updateCourse() {
                if(hasInput) {
                    course_management.updateCourse(course.value).then(() => {
                        success.value = true;
                        Router.back();
                    });
                }
                else {
                    success.value = false;
                    console.log("Error: Input Validation Failed!")
                }
            }

            function deleteCourse() {
                const courseManager: Course_Management = new Course_Management();
                courseManager.deleteCourse(course.value.courseId).then(() => {
                    //todo check for success
                    Router.back();
                });
            }
            function showDeleteModal() {
                showingDeleteModal.value = true;
            }
            function hideDeleteModal() {
                showingDeleteModal.value = false;
            }
            function showUnsavedChangesModal() {
                showingUnsavedChangesModal.value = true;
            }
            function hideUnsavedChangesModal() {
                showingUnsavedChangesModal.value = false;
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
                showingDeleteModal,
                showingUnsavedChangesModal,
                hasInput,
                isValid,
                back,
                loadCourse,
                createCourse,
                updateCourse,
                deleteCourse,
                showDeleteModal,
                hideDeleteModal,
                showUnsavedChangesModal,
                hideUnsavedChangesModal,
                unsavedChangesModalRef
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
            if (this.hasInput && !this.success) {
                this.showUnsavedChangesModal();
                let actions = this.unsavedChangesModalRef.actions;

                await this.unsavedChangesModalRef.show().then((response: typeof actions) => {
                    console.log(response)
                    switch(response) {
                        case actions.CANCEL: {
                            next(false);
                            break;
                        }
                        case actions.CONFIRM: {
                            next(true);
                            break;
                        }
                    }
                    this.hideUnsavedChangesModal();
                })
            } else {
                next(true);
            }
        }
    };
</script>
