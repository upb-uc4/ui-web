<template>
    <div
        :id="'user_' + user.username"
        class="px-8 py-4 whitespace-no-wrap border-gray-200 cursor-pointer hover:bg-gray-200"
        :class="{ 'rounded-t-lg': isFirstRow, 'rounded-b-lg': isLastRow, 'border-b': !isLastRow }"
        @click="editAccount(user.username)"
    >
        <div class="flex items-center justify-between">
            <div class="flex items-center justify-between">
                <div class="flex">
                    <div class="hidden sm:flex flex-shrink-0 w-12 h-12">
                        <img
                            class="w-12 h-12 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                        />
                    </div>
                    <div class="sm:ml-8">
                        <div class="text leading-5 font-medium text-blue-900 mb-1 lg:w-48 w-32 truncate">
                            {{ user.firstName }} {{ user.lastName }}
                        </div>
                        <div class="text leading-5 text-gray-500 lg:w-48 w-32 truncate">@{{ user.username }}</div>
                    </div>
                </div>
                <div class="mx-8 w-24">
                    <span
                        class="inline-block text-xs px-2 rounded-lg font-semibold leading-5 tracking-wide mb-1"
                        :class="{
                            'bg-blue-200 text-blue-800': isStudent,
                            'bg-red-200 text-red-800': isAdmin,
                            'bg-green-200 text-green-800': isLecturer,
                        }"
                    >
                        {{ user.role }}
                    </span>
                </div>

                <div class="flex-col items-baseline" :class="[isStudent ? 'flex' : 'hidden']">
                    <div class="leading-5 text-blue-900 ml-1 mb-1">{{ student.matriculationId }}</div>
                    <div class="hidden sm:flex items-center leading-5 text-gray-500">
                        <span class="mr-2 fa-stack text-xs" style="font-size: 0.63em;">
                            <i class="fas fa-circle text-green-500 fa-stack-2x"></i>
                            <i class="fas fa-check fa-stack-1x fa-inverse"></i>
                        </span>
                        <div class="hidden sm:block">
                            <!-- TODO when new API is active -->
                            Immatriculated
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex">
                <i class="fas fa-chevron-right text-gray-500" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import User from "../../api/api_models/user_management/User";
    import router from "@/router";
    import { Role } from "@/entities/Role";
    import Student from "@/api/api_models/user_management/Student";

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
            function editAccount(username: string) {
                router.push({ path: "/editAccount/" + username });
            }
            const isStudent = props.user.role === Role.STUDENT;
            const isLecturer = props.user.role === Role.LECTURER;
            const isAdmin = props.user.role === Role.ADMIN;
            const student = props.user as Student;

            return { editAccount, isStudent, isLecturer, isAdmin, student };
        },
    };
</script>
