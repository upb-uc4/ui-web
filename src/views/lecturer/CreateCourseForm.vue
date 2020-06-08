<template>

    <div class="w-full lg:mt-20 mt-8 bg-gray-300 mx-auto h-screen">
        <button @click="navigateBack()" class="flex items-center mb-4">
            <i class="fas text-xl fa-chevron-left text-blue-700"></i>
            <span class="text-blue-700 font-bold text-sm ml-1">Course List</span>
        </button>

        <h1 class="text-2xl font-medium text-gray-700 mb-8">Course Creation</h1>

        <form @submit.prevent="submit" method="POST">
            <input type="hidden" name="lecturerId" :value="lecturerId">

            <!-- TODO: remove in new API version -->
            <input type="hidden" name="ects" :value="0">
            <input type="hidden" name="courseId" :value="0">
            <input type="hidden" name="currentParticipants" :value="0">

            <section class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Basics</label>
                        <label class="block text-gray-600">
                            This is some long detailed description which is part towards a better form.
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3"> <div class="mb-4 flex flex-col">
                            <!-- TODO: create cards for better visual impact -->
                            <label class="text-gray-700 text-md font-medium mb-3">Type</label>
                            <div class="flex">
                                <div class="mr-4">
                                    <label class="flex items-center">
                                        <input type="radio" class="form-radio focus:shadow-none text-indigo-600" name="type" value="Lecture"
                                               v-model="course.courseType">
                                        <span class="ml-2 text-gray-700 text-md font-medium">Lecture</span>
                                    </label>
                                </div>
                                <div class="mr-4">
                                    <label class="flex items-center">
                                        <input type="radio" class="form-radio focus:shadow-none text-indigo-600" name="type" value="Seminar"
                                               v-model="course.courseType">
                                        <span class="ml-2 text-gray-700 text-md font-medium">Seminar</span>
                                    </label>
                                </div>
                                <div>
                                    <label class="flex items-center">
                                        <input type="radio" class="form-radio focus:shadow-none text-indigo-600" name="type" value="Project"
                                               v-model="course.courseType">
                                        <span class="ml-2 text-gray-700 text-md font-medium">Project Group</span>
                                    </label>
                                </div>
                            </div>
                        <div class="mb-4 flex flex-col">
                            <label for="name" class="text-gray-700 text-md font-medium mb-3">Name</label>
                            <input type="text" id="name" name="courseName" v-model="course.courseName"
                                   class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Language</label>
                            <select name="language" id="language" v-model="course.language" class="w-full form-select block border-2 border-gray-400 rounded-lg text-gray-600 py-3">
                                <option>German</option>
                                <option>English</option>
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
                                      v-model="course.description" placeholder="Add an optional description.">
                            </textarea>
                        </div>
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
                                   v-model="course.maxStudents">
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

            <section class="border-t-2 py-8 border-gray-400 lg:mt-8 flex justify-end items-center">
                <button type="button" @click="navigateBack" class="w-32 text-blue-700 border-2 border-blue-700 text-center py-3 rounded-lg font-semibold tracking-wider focus:outline-none mr-6">
                    Cancel
                </button>
                <button type="submit" class="w-48 bg-blue-700 border-2 border-blue-700 text-white text-center py-3 rounded-lg font-semibold tracking-wide focus:outline-none">
                    Create Course
                </button>
            </section>
        </form>

    </div>
</template>

<script lang="ts">
import Router from "@/router/";
import { store } from '@/store/store';
import {Course} from "@/entities/Course";

const axios = require("axios");

export default {
    name: "LecturerCreateCourseForm",
    props: {

    },
    data() {
        return {
            course: new Course(),
            success: false,
        };
    },
    created() {
        this.course.lecturerId = store.state.myId;
        this.course.startDate = "01.06.2020";
        this.course.endDate = "31.08.2020";
        this.course.courseId = Math.floor(Math.random() * Math.floor(30000));
    },
    computed: {
        hasInput: function (): boolean {
            //todo: if this is an edit form, check if original course data was modified
            //todo make this cleaner via onChange maybe?
            if (this.course.courseName != "" || this.course.description != "" || this.course.language != "English" ||
                this.course.courseType != "Lecture" || this.course.maxStudents != 0) {
                    return true;
            }
            return false;
        }
    },
    methods: {
        navigateBack() {
            Router.go(-1);
        },
        submit() {
            axios.post("http://localhost:9000/course", this.course)
                .then((response: any) => {
                    console.log(response); //todo configure esl lint that it does not throw an error on unsed response param.
                    this.success = true;
                    //todo show success toast
                    this.navigateBack();
                })
                .catch((error: any) => {
                    console.error(error)
                })
        }
    },
    beforeRouteLeave (to, from, next) {
        //todo use styled modal
        //todo break this into smaller methods
        if (this.success) {
            next();
        }
        else if (this.hasInput) {
            const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
            if (answer) {
                next()
            } else {
                next(false)
            }
        }
        else {
            next()
        }
    }
};
</script>
