<template>
    <div :id="'course_' + course.courseId" class="flex shadow-xl">
        <div class="flex flex-col w-full px-8 py-4 bg-white rounded-lg">
            <div class="flex items-baseline">
                <span class="inline-block px-2 text-xs font-semibold tracking-wide text-teal-800 uppercase bg-teal-200 rounded-full">{{
                    course.courseType
                }}</span>
                <div class="ml-4 text-xs font-semibold tracking-wide text-gray-600 uppercase">{{ course.courseLanguage }}</div>
                <div class="ml-4 text-xs font-semibold tracking-wide text-gray-600 uppercase">{{ course.ects }} ECTS</div>
                <div class="ml-4 text-xs font-semibold tracking-wide text-gray-600 uppercase">
                    <i class="inline text-lg fas fa-users"></i>
                    {{ course.currentParticipants }} / {{ course.maxParticipants }}
                </div>
            </div>

            <div class="flex">
                <div class="flex flex-col items-start w-2/3 lg:w-5/6">
                    <div class="mt-2 text-2xl font-semibold leading-tight text-gray-900 truncate">{{ course.courseName }}</div>
                    <router-link
                        id="showLecturer"
                        :to="{ name: 'profile.public', params: { username: course.lecturerId } }"
                        class="mt-1 font-semibold navigation-link hover:cursor-pointer"
                    >
                        {{ lecturerDisplayName }}
                    </router-link>
                    <div class="mt-3">
                        <read-more more-str="Show more" :text="course.courseDescription" less-str="Show less" :max-chars="180"></read-more>
                    </div>
                </div>
                <div class="w-1/3 mb-4 ml-12 lg:w-1/6 lg:ml-8">
                    <div class="flex items-center justify-center h-full mt-6">
                        <!-- v-if directive just for design purposes here -> replace with state of myCourses-->
                        <button
                            v-if="course.id === 123456789"
                            id="leaveCourse"
                            class="px-8 py-2 font-semibold text-red-600 bg-white border-2 border-gray-300 rounded-lg shadow-md focus:outline-none"
                        >
                            Leave
                        </button>
                        <button
                            v-else-if="course.currentParticipants < course.maxParticipants"
                            id="joinCourse"
                            class="w-48 py-2 btn btn-blue-primary"
                        >
                            Join
                        </button>
                        <p v-else class="flex px-8 py-2 font-semibold text-center text-red-600 text-opacity-50 rounded-lg">
                            Course is full
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import ReadMore from "@/components/common/ReadMore.vue";
    import Course from "@/api/api_models/course_management/Course";
    import Router from "@/router/";
    import UserManagement from "@/api/UserManagement";
    import ProfileResponseHandler from "@/use/ProfileResponseHandler";
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

            return {
                lecturerDisplayName,
            };
        },
    };
</script>
