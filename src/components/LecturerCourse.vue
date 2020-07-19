<template>
    <div class="flex shadow-xl">
        <div class="w-full flex flex-col bg-white rounded-lg py-4 px-8">
            <div class="flex items-baseline">
                <span class="inline-block bg-teal-200 text-teal-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide">{{
                    course.courseType
                }}</span>
                <div class="ml-4 text-gray-600 text-xs uppercase font-semibold tracking-wide">{{ course.courseLanguage }}</div>
                <div class="ml-4 text-gray-600 text-xs uppercase font-semibold tracking-wide">{{ course.ects }} ECTS</div>
                <div class="ml-4 text-gray-600 text-xs uppercase font-semibold tracking-wide">
                    <i class="inline fas fa-users text-lg"></i>
                    {{ course.currentParticipants }} / {{ course.maxParticipants }}
                </div>
            </div>

            <div class="flex mb-4">
                <div class="flex flex-col lg:w-5/6 w-2/3">
                    <div class="mt-2 font-semibold text-2xl leading-tight truncate text-gray-900">{{ course.courseName }}</div>
                    <div class="mt-1 font-semibold text-sm text-gray-600">{{ course.lecturerId }}</div>
                    <div class="mt-3">
                        <read-more more-str="Show more" :text="course.courseDescription" less-str="Show less" :max-chars="180"></read-more>
                    </div>
                </div>
                <div class="lg:w-1/6 w-1/3 lg:ml-8 ml-12">
                    <div class="mt-6 flex h-full items-center justify-center">
                        <button class="w-48 btn btn-gray-primary py-2" @click="editCourse()">Edit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import ReadMore from "./ReadMore.vue";
    import router from "../router";
    import Course from "@/api/api_models/course_management/Course";

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
        },
        setup(props: any) {
            function editCourse() {
                router.push({ path: "/editCourse/" + props.course.courseId });
            }

            return {
                editCourse,
            };
        },
    };
</script>
