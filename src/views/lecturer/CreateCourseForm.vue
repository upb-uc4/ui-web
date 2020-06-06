<template>

    <div class="w-full lg:mt-20 mt-8 bg-gray-300 mx-auto h-screen">
        <button @click="navigateBack()" class="flex items-center mb-4">
            <i class="fas text-xl fa-chevron-left text-blue-700"></i>
            <span class="text-blue-700 font-bold text-sm ml-1">Course List</span>
        </button>

        <h1 class="text-2xl font-medium text-gray-700 mb-8">Course Creation</h1>

        <form :action="endpoint" method="POST">
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
                    <div class="w-full lg:w-2/3">
                        <div class="mb-4 flex flex-col">
                            <label for="name" class="text-gray-700 text-md font-medium mb-3">Name</label>
                            <input type="text" id="name" name="courseName" class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label for="description" class="text-gray-700 text-md font-medium mb-3">Description</label>
                            <textarea name="description" id="description" cols="30" rows="10" class="w-full form-textarea border-2 border-gray-400 rounded-lg text-gray-600"
                                      placeholder="Add an optional description...">
                            </textarea>
                        </div>
                        <div class="mb-4 flex flex-col">
                            <!-- TODO: create cards for better visual impact -->
                            <label class="text-gray-700 text-md font-medium mb-3">Type</label>
                            <div class="flex">
                                <div class="mr-4">
                                    <label class="flex items-center">
                                        <input type="radio" class="form-radio focus:shadow-none text-indigo-600" name="type" value="seminar" checked>
                                        <span class="ml-2 text-gray-700 text-md font-medium">Seminar</span>
                                    </label>
                                </div>
                                <div>
                                    <label class="flex items-center">
                                        <input type="radio" class="form-radio focus:shadow-none text-indigo-600" name="type" value="lecture">
                                        <span class="ml-2 text-gray-700 text-md font-medium">Lecture</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Language</label>
                            <select name="language" id="language" class="w-full form-select block border-2 border-gray-400 rounded-lg text-gray-600 py-3">
                                <option>German</option>
                                <option>English</option>
                            </select>
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
                            <input type="number" name="maxParticipants" id="limit" min="0" max="999" class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                        </div>
                    </div>
                </div>
            </section>

            <section class="border-t-2 py-8 border-gray-400 lg:mt-8 flex justify-end items-center">
                <button type="reset" @click="navigateBack" class="w-32 text-blue-700 border-2 border-blue-700 text-center py-3 rounded-lg font-semibold tracking-wider focus:outline-none mr-6">
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

let lecturerId = -1;
export default {
    name: "LecturerCreateCourseForm",
        data() {
            return {
                endpoint: 'http://localhost:9000/course',
                lecturerId: lecturerId,
            };
        },
        setup () {
            lecturerId = store.state.myId;
        },
        methods: {
            navigateBack() {
                Router.go(-1);
            },
        },
        beforeRouteLeave (to, from, next) {
            //todo use styled modal
            //todo raise only when user did input something into the fields
            //todo don't raise on submit
            const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
            if (answer) {
                next()
            } else {
                next(false)
            }
        }
    };
</script>
