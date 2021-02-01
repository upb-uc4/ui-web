<template>
    <section-header :title="title" />
    <div class="p-12 border dark:bg-normalgray-900 dark:border-normalgray-700 rounded-md sm:space-y-8 space-y-4">
        <div class="sm:flex items-center sm:space-x-8 space-y-2">
            <img id="picture" class="w-32 h-32 rounded-full object-cover" :src="profilePicture" />
            <div>
                <h1 class="text-3xl font-medium text-gray-800 dark:text-gray-300">{{ name }}</h1>
                <h2 class="text-xl text-gray-500">@{{ student.username }}</h2>
            </div>
        </div>
        <div class="text-sm text-gray-800 dark:text-gray-300 space-y-2">
            <div class="flex items-center space-x-2">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                </svg>
                <div>{{ student.role }}</div>
            </div>
            <div>
                <div v-if="student.isActive" class="flex items-center space-x-2">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <div>Active</div>
                </div>
                <div v-else class="flex items-center space-x-2">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <div>Inactive</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Student from "@/api/api_models/user_management/Student";
    import SectionHeader from "@/components/common/section/SectionHeader.vue";
    import { computed } from "vue";

    export default {
        components: {
            SectionHeader,
        },
        props: {
            student: {
                required: true,
                type: Object as () => Student,
            },
        },
        setup(props: any) {
            const name = computed(() => `${props.student.firstName} ${props.student.lastName}`);
            const title = computed(() => {
                if (props.student.lastName.slice(-1) === "s") {
                    return `${name.value}' Profile`;
                }
                return `${name.value}'s Profile`;
            });
            const profilePicture = process.env.VUE_APP_API_BASE_URL + "/user-management/users/" + props.student.username + "/image";
            return { title, name, profilePicture };
        },
    };
</script>
