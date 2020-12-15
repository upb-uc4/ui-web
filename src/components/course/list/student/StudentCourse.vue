<template>
    <div :id="'course_' + course.courseId" class="flex shadow-xl">
        <div class="flex flex-col w-full p-4 sm:px-8 bg-white rounded-lg">
            <div class="flex items-center justify-between sm:justify-start">
                <span class="inline-block px-2 text-xs font-semibold tracking-wide text-teal-800 uppercase bg-teal-200 rounded-full">
                    {{ course.courseType }}
                </span>
                <div class="ml-4 text-xs font-semibold tracking-wide text-gray-600 uppercase">{{ course.ects }} ECTS</div>
                <div class="hidden sm:flex ml-4 text-xs font-semibold tracking-wide text-gray-600 uppercase">
                    {{ course.courseLanguage }}
                </div>
                <!-- todo replace with flag component -->
                <img :src="flagSrc" class="sm:hidden inline rounded ml-4 w-6 h-4 opacity-90" />
                <div class="ml-4 text-xs font-semibold tracking-wide text-gray-600 uppercase">
                    <i class="inline text-lg fas fa-users" />
                    {{ course.currentParticipants }} / {{ course.maxParticipants }}
                </div>
            </div>

            <div class="flex flex-wrap mb-4">
                <div class="flex flex-col items-start w-2/3 md:w-5/6">
                    <div id="courseName" class="mt-2 text-2xl font-semibold leading-tight text-gray-900">
                        {{ course.courseName }}
                    </div>
                    <router-link
                        id="showLecturer"
                        :to="{ name: 'profile.public', params: { username: course.lecturerId } }"
                        class="mt-1 font-semibold navigation-link hover:cursor-pointer"
                    >
                        {{ lecturerDisplayName }}
                    </router-link>

                    <div class="w-full sm:flex sm:items-center">
                        <div class="mt-3 sm:w-5/6 sm:mr-4">
                            <read-more
                                more-str="Show more"
                                :text="course.courseDescription"
                                less-str="Show less"
                                :max-chars="180"
                            ></read-more>
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-1/6 mt-6 sm:mt-1">
                    <button id="joinCourse" class="w-full py-2 btn btn-blue-primary" :disabled="isCourseFull">Join</button>
                    <p v-if="isCourseFull" class="font-semibold text-red-700">This course is already full.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import ReadMore from "@/components/common/ReadMore.vue";
    import Course from "@/api/api_models/course_management/Course";
    import Lecturer from "@/api/api_models/user_management/Lecturer";

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
        },
        setup(props: any) {
            //todo this might not be a lecturer in the future
            const lecturerDisplayName = props.lecturer.firstName + " " + props.lecturer.lastName;
            const isCourseFull = props.course.currentParticipants >= props.course.maxParticipants;
            const flagSrc: string =
                props.course.courseLanguage == "English"
                    ? "https://raw.githubusercontent.com/lipis/flag-icon-css/bb5b59c381b04c651f12bbd7d21c3486da157c88/flags/4x3/gb.svg"
                    : "https://raw.githubusercontent.com/lipis/flag-icon-css/bb5b59c381b04c651f12bbd7d21c3486da157c88/flags/4x3/de.svg";

            return {
                lecturerDisplayName,
                isCourseFull,
                flagSrc,
            };
        },
    };
</script>
