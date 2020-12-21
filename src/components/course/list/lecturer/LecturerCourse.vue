<template>
    <div :id="'course_' + course.courseId" class="w-full px-4 sm:px-8">
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

        <div class="flex mt-2">
            <div class="items-start w-2/3 md:w-5/6">
                <div id="courseName" class="text-lg navigation-link-tmp font-bold">
                    {{ course.courseName }}
                </div>
                <router-link
                    id="showLecturer"
                    :to="{ name: 'profile.public', params: { username: course.lecturerId } }"
                    class="mt-1 font-medium text-sm navigation-link-tmp"
                >
                    {{ lecturerDisplayName }}
                </router-link>

                <div class="w-full sm:flex sm:items-center">
                    <div class="mt-1 sm:w-5/6 sm:mr-4">
                        <read-more
                            v-if="course.courseDescription !== ''"
                            more-str="Show more"
                            :text="course.courseDescription"
                            less-str="Show less"
                            :max-chars="240"
                        ></read-more>
                        <div v-else class="text-gray-500 text-sm italic">No course description available.</div>
                    </div>
                </div>
            </div>
            <div class="w-full md:w-1/6 mt-6 sm:mt-1 hidden">
                <button v-if="allowEdit" id="editCourse" class="w-full py-2 btn btn-gray-primary" @click="editCourse()">Edit</button>
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
                router.push({ path: "/editCourse/" + props.course.courseId });
            }

            return {
                lecturerDisplayName,
                editCourse,
                flagSrc,
            };
        },
    };
</script>
