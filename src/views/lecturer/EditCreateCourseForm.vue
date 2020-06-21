<template>

    <div class="w-full lg:mt-20 mt-8 bg-gray-300 mx-auto h-screen">
        <button @click="navigateBack()" class="flex items-center mb-4 navigation-link">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Course List</span>
        </button>

        <h1 class="text-2xl font-medium text-gray-700 mb-8"> {{ heading }} </h1>

        <form @submit.prevent="submit" method="POST">
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
                                        <input type="radio" class="form-radio focus:shadow-none text-blue-700 hover:bg-blue-400" name="type" :value="courseType"
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
                        <button type="button" @click="navigateBack" class="w-32 mr-6 btn btn-blue-secondary">
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
                    <button type="button" @click="navigateBack" class="mb-4 w-full btn btn-blue-secondary">
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
        </form>
        <delete-course-modal :showing="showingDeleteModal" v-on:cancel="hideDeleteModal" v-on:delete="deleteCourse"></delete-course-modal>
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
import DeleteCourseModal from "@/components/modals/DeleteCourseModal.vue";

export default {
    name: "LecturerCreateCourseForm",
    props: ['editMode'],
    components: {
        DeleteCourseModal
    },
    data() {
        return {
            course: new Course(),
            initialCourseState: new Course(),
            heading: this.editMode ? "Edit Course" : "Create Course",
            languages: Object.values(Language).filter(e => e != Language.NONE),
            courseTypes: Object.values(CourseType).filter(e => e != CourseType.NONE),
            success: false,
            deleted: false,
            showingDeleteModal: false,
        };
    },
    created() {
        this.course.lecturerId = store.state.myId;
        this.course.startDate = "2020-06-01";
        this.course.endDate = "2020-08-31";
    },
    computed: {
        hasInput: function (): boolean {
            //TODO transform if conditions to class method in Course.ts
                if (this.course.courseName !== this.initialCourseState.courseName || this.course.courseDescription !== this.initialCourseState.courseDescription || this.course.courseLanguage !== this.initialCourseState.courseLanguage ||
                    this.course.courseType !== this.initialCourseState.courseType || this.course.maxParticipants !== this.initialCourseState.maxParticipants) {
                        return true;
                }
            return false;
        },
        isValid: function (): boolean {
            if(this.course.courseName == "" || this.course.courseLanguage != Language.NONE ||
            this.course.courseType != CourseType.NONE || this.course.maxParticipants == 0) {
                return false;
            }
            return true;
        }
    },
    methods: {
        navigateBack() {
            Router.go(-1);
        },
        loadCourse () {
                const course_management: Course_Management = new Course_Management();
                course_management.getCourse(this.$route.params.id).then((v : {course: Course, found: boolean}) => {
                    this.course = v.course;
                    this.initialCourseState = JSON.parse(JSON.stringify(this.course));
                    if (!v.found) {
                        //todo no course with that ID
                    }
                });
            },
        createCourse() {
            if(this.hasInput) { 
                const course_management: Course_Management = new Course_Management();
                course_management.createCourse(this.course).then(() => {
                    this.success = true;
                    this.navigateBack();
                });
            }
            else {
                this.success = false;
                console.log("Error: Input Validation Failed!")
            }
        },
        updateCourse() {
            if(this.hasInput) { 
                const course_management: Course_Management = new Course_Management();
                course_management.updateCourse(this.course).then(() => {
                    this.success = true;
                    this.navigateBack();
                });                
            }
            else {
                this.success = false;
                console.log("Error: Input Validation Failed!")
            }
        },
        deleteCourse() {
            const check = prompt("Warning! You are about to delete the course \"" + this.course.courseName +"\".\nPlease type in the course name to confirm the deletion!", '')
            if (check != this.course.courseName) {
                this.deleted = false
                if(check != null) {
                    this.deleteCourse()
                }
            }
            else {
                //TODO Include proper API
                const course_management: Course_Management = new Course_Management();
                course_management.deleteCourse(this.course.courseId).then(() => {
                    this.deleted = true;
                    this.navigateBack();
                    //todo check for success..
                });
            }
        },
        showDeleteModal() {
            this.showingDeleteModal = true;
        },
        hideDeleteModal() {
            this.showingDeleteModal = false;
        },
    },
    beforeRouteEnter(_from, _to, next) {
		const myRole = store.state.myRole;
		if (myRole != Role.LECTURER) {
			return next("/redirect");
		}
		return next();
    },
    beforeRouteLeave (to, from, next) {
        //todo use styled modal
        //todo break this into smaller methods
        if (this.success) {
            return next();
        }
        else if (this.hasInput && !this.deleted ) {
            const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
            if (answer) {
                return next()
            } else {
                return next(false)
            }
        }
        else {
            return next()
        }
    },
    mounted() {
        if(this.editMode) {
            this.loadCourse()
        }
    }
};
</script>
