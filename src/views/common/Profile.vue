<template>
    <suspense>
        <template #default>
            <!-- TODO: display profile based on role -->
            <student-profile></student-profile>
        </template>
        <template #fallback>
            <p class="text-center text-lg pt-20">
                Loading Profile...
            </p>
        </template>
    </suspense>
</template>

<script lang="ts">
    import StudentProfile from "@/views/student/Profile.vue";

    export default {
        components: {
            StudentProfile
        }
    }
</script>