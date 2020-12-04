<template>
    <div
        :id="'user_' + user.username"
        class="px-6 py-4 whitespace-no-wrap border-gray-200"
        :class="{
            'rounded-t-lg': isFirstRow,
            'rounded-b-lg': isLastRow,
            'border-b': !isLastRow,
            'cursor-pointer hover:bg-gray-200': user.isActive,
        }"
        @click="editAccount(user.username)"
    >
        <div class="flex items-center">
            <div class="w-full flex">
                <div class="flex items-center w-1/3 md:w-2/3">
                    <img class="hidden sm:block w-12 h-12 rounded-full" :src="profilePicture" alt="profile_picture" />
                    <div class="sm:ml-4">
                        <div v-if="user.isActive" class="mb-1 truncate">
                            <label class="text leading-5 font-medium text-blue-900 mr-2">{{ user.firstName }} {{ user.lastName }}</label>
                        </div>
                        <div v-if="!user.isActive" class="mb-1 truncate">
                            <label v-if="isLecturer" class="text leading-5 font-medium text-blue-900 mr-2">
                                {{ user.firstName }} {{ user.lastName }}
                            </label>
                            <label class="text-gray-600 italic">(inactive)</label>
                        </div>
                        <div class="hidden sm:flex text leading-5 text-gray-500 truncate">@{{ user.username }}</div>
                        <span
                            class="sm:hidden inline-block text-xs px-2 rounded-lg font-semibold leading-5 tracking-wide mb-1 w-16 text-center"
                            :class="{
                                'bg-blue-200 text-blue-800': isStudent,
                                'bg-red-200 text-red-800': isAdmin,
                                'bg-green-200 text-green-800': isLecturer,
                            }"
                        >
                            {{ user.role }}
                        </span>
                    </div>
                </div>
                <div class="justify-start w-2/3 md:w-1/3">
                    <div class="flex items-center">
                        <div class="mr-8 hidden sm:flex w-24">
                            <span
                                class="inline-block text-xs px-2 rounded-lg font-semibold leading-5 tracking-wide mb-1 w-16 text-center"
                                :class="{
                                    'bg-blue-200 text-blue-800': isStudent,
                                    'bg-red-200 text-red-800': isAdmin,
                                    'bg-green-200 text-green-800': isLecturer,
                                }"
                            >
                                {{ user.role }}
                            </span>
                        </div>

                        <div
                            class="flex-col hidden sm:flex items-baseline w-full content-start"
                            :class="[isStudent && user.isActive ? 'sm:flex' : 'sm:invisible']"
                        >
                            <div class="flex">
                                <div class="leading-5 text-gray-600 ml-1 mb-1">#</div>
                                <div class="leading-5 text-blue-900 ml-1 mb-1">{{ student.matriculationId }}</div>
                            </div>
                            <div class="hidden sm:flex items-center leading-5 text-gray-500">
                                <span v-if="isImmatriculated" class="mr-2 fa-stack text-xs" style="font-size: 0.63em">
                                    <i class="fas fa-circle text-green-500 fa-stack-2x"></i>
                                    <i class="fas fa-check fa-stack-1x fa-inverse"></i>
                                </span>
                                <span v-else class="mr-2 fa-stack text-xs" style="font-size: 0.63em">
                                    <i class="fas fa-circle text-red-500 fa-stack-2x"></i>
                                    <i class="fas fa-times fa-stack-1x fa-inverse"></i>
                                </span>
                                <div class="hidden sm:block">
                                    <label v-if="isImmatriculated">Immatriculated</label>
                                    <label v-else-if="student.latestImmatriculation != ''">Last: {{ student.latestImmatriculation }}</label>
                                    <label v-else>Not Immatriculated</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex">
                <i class="fas fa-chevron-right text-gray-500 ml-8" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import User from "@/api/api_models/user_management/User";
    import router from "@/use/router";
    import { Role } from "@/entities/Role";
    import Student from "@/api/api_models/user_management/Student";
    import { onBeforeMount, computed, ref, watch } from "vue";

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
            currentSemester: {
                type: String,
                required: true,
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

            const isImmatriculated = ref(false);

            isImmatriculated.value = isStudent && student.latestImmatriculation == props.currentSemester;

            return { editAccount, isStudent, isLecturer, isAdmin, student, profilePicture, isImmatriculated };
        },
    };
</script>
