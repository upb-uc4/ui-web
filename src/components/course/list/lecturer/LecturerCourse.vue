<template>
    <div :id="'course_' + course.courseId" class="flex shadow-xl">
        <!-- TODO mobile view only for testing purposes -->

        <div class="flex flex-col w-full p-4 bg-white rounded-lg">
            <div class="flex items-baseline justify-between">
                <span class="inline-block px-2 text-xs font-semibold tracking-wide text-teal-800 uppercase bg-teal-200 rounded-full">
                    {{ course.courseType }}
                </span>
                <div class="ml-4 text-xs font-semibold tracking-wide text-gray-600 uppercase">{{ course.ects }} ECTS</div>
                <div class="ml-4 text-xl font-semibold tracking-wide text-gray-600 uppercase">🇬🇧</div>
                <div class="ml-4 text-xs font-semibold tracking-wide text-gray-600 uppercase">
                    <i class="inline text-lg fas fa-users" />
                    {{ course.currentParticipants }} / {{ course.maxParticipants }}
                </div>
            </div>

            <div class="flex mb-4">
                <div class="flex flex-col items-start w-full">
                    <div class="mt-2 text-2xl font-semibold leading-tight text-gray-900">{{ course.courseName }}</div>

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

                    <div class="w-full mt-6">
                        <button v-if="allowEdit" id="editCourse" class="w-full py-2 btn btn-gray-primary" @click="editCourse()">
                            Edit
                        </button>
                    </div>
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

            function editCourse() {
                router.push({ path: "/editCourse/" + props.course.courseId });
            }

            return {
                lecturerDisplayName,
                editCourse,
            };
        },
    };
</script>
