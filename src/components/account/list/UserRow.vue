<template>
    <div
        :id="'user_' + user.username"
        class="py-4 px-2 dark:border-normalgray-700"
        :class="{
            'rounded-t-md': isFirstRow,
            'rounded-b-md': isLastRow,
            'border-b': !isLastRow,
            'cursor-pointer hover:bg-gray-200 dark:hover:bg-normalgray-700': user.isActive,
            'opacity-50': !user.isActive,
        }"
        @click="editAccount(user.username)"
    >
        <div class="flex items-center">
            <div class="w-full flex justify-between">
                <div class="flex items-center">
                    <img class="hidden sm:block w-12 h-12 rounded-full" :src="profilePicture" alt="profile_picture" />
                    <div class="sm:ml-4">
                        <div v-if="user.isActive" class="text-gray-800 dark:text-gray-300 truncate">
                            {{ user.firstName }} {{ user.lastName }}
                        </div>
                        <div v-if="!user.isActive" class="truncate">
                            <label v-if="isLecturer" class="text-gray-800"> {{ user.firstName }} {{ user.lastName }} </label>
                            <label class="text-gray-500 italic">Inactive</label>
                        </div>
                        <div class="hidden sm:flex text-sm leading-5 text-gray-500 truncate">@{{ user.username }}</div>
                        <span
                            class="sm:hidden inline-block text-xs px-2 rounded-lg font-semibold leading-5 tracking-wide mb-1 w-16 text-center"
                            :class="{
                                'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-gray-300': isStudent,
                                'bg-red-200 text-red-800 dark:bg-red-800 dark:text-gray-300': isAdmin,
                                'bg-green-200 text-green-800 dark:bg-lime-800 dark:text-gray-300': isLecturer,
                            }"
                        >
                            {{ user.role }}
                        </span>
                    </div>
                </div>

                <div class="flex items-center space-x-20 lg:mr-20">
                    <div class="flex-col hidden sm:flex items-baseline" :class="[isStudent && user.isActive ? 'sm:flex' : 'sm:invisible']">
                        <div class="text-sm text-gray-500">Matriculation</div>
                        <div class="font-medium text-sm text-gray-800 dark:text-gray-300">{{ student.matriculationId }}</div>
                    </div>
                    <div class="mx-8 hidden sm:flex w-18">
                        <span
                            class="block w-18 text-xs py-0.5 rounded-md font-semibold tracking-wide text-center"
                            :class="{
                                'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-gray-300': isStudent,
                                'bg-red-200 text-red-800 dark:bg-red-800 dark:text-gray-300': isAdmin,
                                'bg-green-200 text-green-800 dark:bg-lime-800 dark:text-gray-300': isLecturer,
                            }"
                        >
                            {{ user.role }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="flex" :class="{ invisible: !user.isActive }">
                <i class="fas fa-chevron-right text-gray-500" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import User from "@/api/api_models/user_management/User";
    import router from "@/use/router";
    import { Role } from "@/entities/Role";
    import Student from "@/api/api_models/user_management/Student";
    import { ref } from "vue";

    export default {
        name: "AccountRow",
        props: {
            user: {
                required: true,
                type: Object as () => User,
            },
            isLastRow: {
                type: Boolean,
            },
            isFirstRow: {
                type: Boolean,
            },
        },
        setup(props: any) {
            let profilePicture = ref("");
            function editAccount(username: string) {
                if (props.user.isActive) router.push({ path: "/editAccount/" + username });
            }
            const isStudent = props.user.role === Role.STUDENT;
            const isLecturer = props.user.role === Role.LECTURER;
            const isAdmin = props.user.role === Role.ADMIN;
            const student = props.user as Student;
            profilePicture.value = process.env.VUE_APP_API_BASE_URL + "/user-management/users/" + props.user.username + "/thumbnail?";

            return { editAccount, isStudent, isLecturer, isAdmin, student, profilePicture };
        },
    };
</script>
