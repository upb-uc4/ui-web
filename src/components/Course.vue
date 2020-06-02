<template>
    <div class="flex shadow-xl">
        <div class="w-5/6 bg-white rounded-lg rounded-r-none py-4 px-8">
            <div class="flex">
                <div class="w-full">
                    <div class="flex items-baseline">
                        <span class="inline-block bg-teal-200 text-teal-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide">{{ course.type }}</span>
                        <div class="ml-4 text-gray-600 text-xs uppercase font-semibold tracking-wide">{{ course.language }}</div>
                        <div class="ml-4 text-gray-600 text-xs uppercase font-semibold tracking-wide">{{ course.credits }} ECTS</div>
                        <div class="ml-4 text-gray-600 text-xs uppercase font-semibold tracking-wide">
                            <i class="inline fas fa-users text-lg"></i>
                            {{ course.participants}} / {{ course.maxParticipants }}
                        </div>
                    </div>
                    <div class="mt-2 font-semibold text-2xl leading-tight truncate text-gray-900">{{ course.name }}</div>
                    <div class="mt-1 font-semibold text-sm text-gray-600">{{ course.lecturer }}</div>
                    <div class="mt-3">
                        <details class="text-gray-600">
                            <summary>Details</summary>
                            <p>{{ course.description }}</p>
                        </details>
                    </div>
                </div>
            </div>
        </div>
        <!-- v-if directive just for design purposes here -> replace with state of myCourses-->
        <div class="w-1/6 bg-white rounded-lg rounded-l-none pl-4 pr-8">
            <div class="mt-6 flex h-full items-center justify-center">
                <button v-if="course.id===123456789" class="bg-white text-red-600 border-2 shadow-md border-gray-300 py-2 px-8 rounded-lg focus:outline-none font-semibold">Leave</button>
                <button v-else-if="course.participants<course.maxParticipants" class="bg-white text-blue-600 border-2 shadow-md border-gray-300 py-2 px-8 rounded-lg focus:outline-none font-semibold">Enter</button>
                <p v-else class="flex text-red-600 text-opacity-50 text-center py-2 px-8 rounded-lg font-semibold">Course is full</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "course",
        props: ["course"]
    };
</script>