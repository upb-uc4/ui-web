<template>
    <div :id="'course_' + course.courseId" class="w-full">
        <div class="flex items-center justify-between sm:justify-start space-x-4">
            <div class="flex items-center space-x-2">
                <span
                    class="w-3 h-3 rounded-full"
                    :class="[
                        { 'bg-lime-400': course.courseType === 'Lecture' },
                        { 'bg-red-400': course.courseType === 'Seminar' },
                        { 'bg-yellow-400': course.courseType === 'Project Group' },
                    ]"
                />
                <span class="text-xs font-medium tracking-wide text-gray-500">{{ course.courseType }}</span>
            </div>

            <div class="text-xs font-medium tracking-wide text-gray-500 uppercase">{{ course.ects }} ECTS</div>
            <div class="hidden sm:flex ml-4 text-xs font-medium tracking-wide text-gray-500">
                {{ course.courseLanguage }}
            </div>
            <img :src="flagSrc" class="sm:hidden inline rounded ml-4 w-6 h-4 opacity-90" alt="language=-flag" />
            <div class="text-xs font-medium tracking-wide text-gray-500 flex items-center space-x-1">
                <i class="block fas fa-users" style="font-size: 1.25em" />
                <span> {{ course.currentParticipants }} / {{ course.maxParticipants }} </span>
            </div>
        </div>

        <div class="mt-2">
            <div>
                <label id="courseName" class="text-lg navigation-link font-bold" @click="showCourseInfo()"> {{ course.courseName }}</label>
            </div>
            <label id="showLecturer" class="mt-1 font-semibold navigation-link cursor-pointer" @click.stop="showLecturer()">
                {{ lecturerDisplayName }}
            </label>

            <div class="w-full sm:flex sm:items-start sm:justify-between">
                <div class="mt-1 w-2/3 sm:mr-4">
                    <read-more
                        v-if="course.courseDescription !== ''"
                        more-str="Show more"
                        :text="course.courseDescription"
                        less-str="Show less"
                        :max-chars="180"
                    />
                    <div v-else class="text-gray-500 text-sm italic">No course description available.</div>
                </div>
                <div class="w-full sm:w-1/3 mt-6 sm:mt-0 flex justify-end">
                    <button v-if="!isCourseFull && !admitted" id="joinCourse" class="w-full sm:w-24 btn" @click="showCourseInfo()">
                        Join
                    </button>
                    <p v-else-if="admitted" class="w-full sm:text-right input-label-error">You are already registered.</p>
                    <p v-else class="w-full sm:text-right input-label-error">Course is already full.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import ReadMore from "@/components/common/ReadMore.vue";
    import Course from "@/api/api_models/course_management/Course";
    import Lecturer from "@/api/api_models/user_management/Lecturer";
    import Router from "@/use/router/index";
    import { computed } from "vue";

    export default {
        name: "StudentCourse",
        components: {
            ReadMore,
        },
        props: {
            course: {
                required: true,
                type: Object as () => Course,
            },
            lecturer: {
                type: Object as () => Lecturer,
                required: true,
            },
            admitted: {
                type: Boolean,
                default: false,
            },
        },
        setup(props: any) {
            //todo this might not be a lecturer in the future
            const lecturerDisplayName = props.lecturer.firstName + " " + props.lecturer.lastName;
            const isCourseFull = props.course.currentParticipants >= props.course.maxParticipants;
            const isFull = props.course.maxParticipants == props.course.currentParticipants;
            const flagSrc: string =
                props.course.courseLanguage == "English"
                    ? "https://raw.githubusercontent.com/lipis/flag-icon-css/bb5b59c381b04c651f12bbd7d21c3486da157c88/flags/4x3/gb.svg"
                    : "https://raw.githubusercontent.com/lipis/flag-icon-css/bb5b59c381b04c651f12bbd7d21c3486da157c88/flags/4x3/de.svg";

            function showCourseInfo() {
                let routeName = props.admitted ? "student.course.drop" : "student.course.join";
                Router.push({ name: routeName, params: { courseId: props.course.courseId } });
            }

            function showLecturer() {
                Router.push({ name: "profile.public", params: { username: props.lecturer.username } });
            }

            return {
                lecturerDisplayName,
                isCourseFull,
                flagSrc,
                showCourseInfo,
                showLecturer,
                isFull,
            };
        },
    };
</script>
