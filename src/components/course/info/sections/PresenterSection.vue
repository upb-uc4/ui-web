<template>
    <base-section title="Lecturer" subtitle="The lecturer that will hold the course.">
        <div class="space-y-6">
            <div class="w-full">
                <img class="w-24 h-24 rounded-full object-cover" :src="profilePicture" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Lecturer</label>
                    <input class="input-text w-full" readonly :value="name" />
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
        </div>
    </base-section>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import LecturerEntity from "@/entities/LecturerEntity";
    import { computed } from "vue";

    export default {
        name: "PresenterSection",
        components: {
            BaseSection,
        },
        props: {
            lecturer: {
                type: Object as () => LecturerEntity,
                required: true,
            },
        },
        setup(props: any) {
            const profilePicture = process.env.VUE_APP_API_BASE_URL + "/user-management/users/" + props.lecturer.username + "/image";
            const name = computed(() => `${props.lecturer.firstName} ${props.lecturer.lastName}`);

            return {
                profilePicture,
                name,
            };
        },
    };
</script>
