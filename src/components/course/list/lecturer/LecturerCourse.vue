<template>
    <div :id="'course_' + course.courseId" class="">
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
            <!-- todo replace with flag component -->
            <img :src="flagSrc" class="sm:hidden inline rounded ml-4 w-6 h-4 opacity-90" />
            <div class="text-xs font-medium tracking-wide text-gray-500 flex items-center space-x-1">
                <i class="block fas fa-users" style="font-size: 1.25em" />
                <span> {{ course.currentParticipants }} / {{ course.maxParticipants }} </span>
            </div>
        </div>

        <div class="mt-2">
            <div>
                <label id="courseName" class="text-lg navigation-link font-bold" @click="editCourse()"> {{ course.courseName }}</label>
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
                    <button v-if="allowEdit" id="editCourse" class="w-full sm:w-24 mt-6 sm:mt-0 btn" @click="editCourse()">Edit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import ReadMore from "@/components/common/ReadMore.vue";
    import router from "@/use/router";
    import Course from "@/api/api_models/course_management/Course";
    import UserManagement from "@/api/UserManagement";
    import ProfileResponseHandler from "@/use/helpers/ProfileResponseHandler";
    import Lecturer from "@/api/api_models/user_management/Lecturer";
    import Router from "@/use/router";

    export default {
        name: "LecturerCourse",
        components: {
            ReadMore,
        },
        props: {
            course: {
                type: Object as () => Course,
                required: true,
            },
            lecturer: {
                type: Object as () => Lecturer,
                required: true,
            },
            allowEdit: {
                type: Boolean,
                required: true,
            },
        },
        setup(props: any) {
            //todo this might not be a lecturer in the future
            const lecturerDisplayName = props.lecturer.firstName + " " + props.lecturer.lastName;
            const flagSrc: string =
                props.course.courseLanguage == "English"
                    ? "https://raw.githubusercontent.com/lipis/flag-icon-css/bb5b59c381b04c651f12bbd7d21c3486da157c88/flags/4x3/gb.svg"
                    : "https://raw.githubusercontent.com/lipis/flag-icon-css/bb5b59c381b04c651f12bbd7d21c3486da157c88/flags/4x3/de.svg";

            function editCourse() {
                if (!props.allowEdit) {
                    return;
                }
                router.push({ path: "/editCourse/" + props.course.courseId });
            }

            function showLecturer() {
                Router.push({ name: "profile.public", params: { username: props.lecturer.username } });
            }

            return {
                lecturerDisplayName,
                editCourse,
                flagSrc,
                showLecturer,
            };
        },
    };
</script>
