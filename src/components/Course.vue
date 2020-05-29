<template>
    <div>
        {{ course.name }}
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