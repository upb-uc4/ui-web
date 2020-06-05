<template>

    <div class="w-full mt-20 bg-gray-300 mx-auto h-screen p-8">
        <h1 class="text-2xl font-medium text-gray-700 mb-8">Course Creation</h1>
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
                                    <span class="ml-2">Seminar</span>
                                </label>
                            </div>
                            <div>
                                <label class="flex items-center">
                                    <input type="radio" class="form-radio focus:shadow-none text-indigo-600" name="radio-colors" value="1" checked>
                                    <span class="ml-2">Lecture</span>
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
    </div>
</template>

<script lang="ts">
import { Course } from "../../entities/Course";
import { store } from '../../store/store';

let course = new Course();
export default {
  name: "Lecturer.CreateCourseForm",
  components: {
  },
  data() {
    return {
      course: course,
      error: false,
      success: false,
      collectedErrors: ""
    };
  },
  setup () {
    course.lecturerId = store.state.myId
  },
  methods: {
    test() {
      console.log(this.course);
    },

    handleSubmit() {
      console.log(this.course)
      this.error = false;
      this.collectedErrors = "";
      if (this.course.courseName == "" || this.course.courseName == undefined) {
        this.error = true;
        this.collectedErrors+= "\t(Course Name)\t";
      }
      if (this.course.lecturerId == 0 || this.course.lecturerId == undefined) {
        this.error = true;
        this.collectedErrors+= "\t(Lecturer ID)\t";
      }
      if(this.course.ects == 0 || this.course.ects == undefined) {
        this.error = true;
        this.collectedErrors+= "\t(ECTS)\t";
      }
      if(this.course.maxStudents == 0 || this.course.maxStudents == undefined) {
        this.error = true;
        this.collectedErrors+= "(Participant Limit)";
      }

      if(this.error) {
        return;
      }
      this.submitForm();
    },

    submitForm() {
      //generate a random course ID
      this.course.courseId = Math.floor(Math.random() * Math.floor(30000));

      const axios = require("axios");
      const instance =  axios.create({
        baseURL: "http://localhost:9000",
          headers: {
            "Accept": "*/*",
            "Content-Type": "application/json;charset=UTF-8"
          }
      });

      instance.post("/course", this.course).then((response: any) => {
        console.log(response);
      });

      return
    }
  }
};
</script>
