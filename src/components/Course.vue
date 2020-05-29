<template>
    <div class="bg-white rounded-lg shadow-xl py-4 px-8">

        <div class="flex">
            <div class="w-full">
                <div class="flex items-baseline">
                    <span class="inline-block bg-teal-200 text-teal-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide">{{ course.type }}</span>
                    <div class="ml-4 text-gray-600 text-xs uppercase font-semibold tracking-wide">{{ course.language }}</div>
                    <div class="ml-4 text-gray-600 text-xs uppercase font-semibold tracking-wide">
                        <i class="inline fas fa-users text-lg"></i> {{ course.participants}} / {{ course.maxParticipants }}
                    </div>
                </div>
                <div class="mt-2 font-semibold text-2xl leading-tight truncate text-gray-900">{{ course.name }}</div>
                <div class="mt-1 font-semibold text-sm text-gray-600">{{ course.lecturer }}</div>
                <div class="mt-3">
                    <div class="text-gray-600">
                        {{ course.description }}
                    </div>
                </div>
                <div class="mt-5 flex text-gray-600">
                    <i class="far fa-calendar-alt text-2xl"></i>
                    <p class="ml-3">{{ course.weekday }}</p>
                    <p class="ml-2">{{ course.from }} - {{ course.to }}</p>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "course",
        props: [
            'course'
        ]
    }
</script>