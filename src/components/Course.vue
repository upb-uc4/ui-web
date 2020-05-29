<template>
    <div class="bg-white rounded-lg shadow-xl py-4 px-8">

        <div class="flex">
            <div class="w-full">
                <div class="flex items-baseline">
                    <span class="inline-block bg-teal-200 text-teal-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide">Seminar</span>
                    <div class="ml-4 text-gray-600 text-xs uppercase font-semibold tracking-wide">
                        <i class="inline fas fa-users text-lg"></i> 5 / 16
                    </div>
                </div>
                <div class="mt-2 font-semibold text-2xl leading-tight truncate text-gray-900">{{ course.name }}</div>
                <div class="mt-1 font-semibold text-sm text-gray-600">Prof. Dr. Bienlein</div>
                <div class="mt-3">
                    <div class="text-gray-600">
                        This is a generic course description which can be quite long.
                        It may consists of several paragraphs and perhaps should be shortened.
                        Could also include a "click for more".
                    </div>
                </div>
                <div class="mt-5 flex text-gray-600">
                    <i class="far fa-calendar-alt text-2xl"></i>
                    <p class="ml-3">Tuesdays</p>
                    <p class="ml-2">14:00 - 16:00</p>
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