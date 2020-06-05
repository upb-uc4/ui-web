<template>

    <div class="w-full mt-20 bg-gray-300 mx-auto h-screen">
        <button @click="navigateBack()" class="flex items-center mb-4">
            <i class="fas text-xl fa-chevron-left text-blue-700"></i>
            <span class="text-blue-700 font-bold text-sm ml-1">Course List</span>
        </button>

        <h1 class="text-2xl font-medium text-gray-700 mb-8">Course Creation</h1>

        <form :action="endpoint" method="POST">
            <input type="hidden" name="lecturerId" :value="lecturerId">
            <section class="border-t-2 py-8 border-gray-400">
                <div class="flex">
                    <div class="hidden lg:w-1/3 lg:block mr-12 flex flex-col">
                        <label class="block text-gray-700 text-md font-semibold mb-2">Basics</label>
                        <label class="block text-gray-600">
                            This is some long detailed description which is part towards a better form.
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3">
                        <div class="mb-4 flex flex-col">
                            <label for="name" class="text-gray-700 text-md font-semibold mb-3">Name</label>
                            <input type="text" id="name" class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label for="description" class="text-gray-700 text-md font-semibold mb-3">Description</label>
                            <textarea name="description" id="description" cols="30" rows="10" class="w-full form-textarea border-2 border-gray-400 rounded-lg text-gray-600"
                                      placeholder="Add an optional description...">
                            </textarea>
                        </div>
                        <div class="mb-4 flex flex-col">
                            <!-- TODO: create cards for better visual impact -->
                            <label class="text-gray-700 text-md font-semibold mb-3">Type</label>
                            <div class="flex">
                                <div class="mr-4">
                                    <label class="flex items-center">
                                        <input type="radio" class="form-radio focus:shadow-none text-indigo-600" name="radio-colors" value="1" checked>
                                        <span class="ml-2 text-gray-700 text-md font-semibold">Seminar</span>
                                    </label>
                                </div>
                                <div>
                                    <label class="flex items-center">
                                        <input type="radio" class="form-radio focus:shadow-none text-indigo-600" name="radio-colors" value="1" checked>
                                        <span class="ml-2 text-gray-700 text-md font-semibold">Lecture</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-semibold mb-3">Language</label>
                            <select name="language" id="language" class="w-full form-select block border-2 border-gray-400 rounded-lg text-gray-600 py-3">
                                <option>German</option>
                                <option>English</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            <section class="border-t-2 py-8 border-gray-400">
                <div class="flex">
                    <div class="hidden lg:w-1/3 lg:block mr-12 flex flex-col">
                        <label class="block text-gray-700 text-md font-semibold mb-2">Restrictions</label>
                        <label class="block text-gray-600">
                            This is some long detailed description which is part towards a better form.
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3">
                        <div class="mb-4 flex flex-col">
                            <label for="limit" class="text-gray-700 text-md font-semibold mb-3">Participation Limit</label>
                            <input type="number" id="limit" class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                        </div>
                    </div>
                </div>
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
        }
    };
</script>
