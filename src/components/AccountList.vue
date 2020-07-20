<template>
    <div class="bg-white rounded-lg shadow flex flex-col">
        <div class="px-8 py-4 whitespace-no-wrap border-b border-gray-200 cursor-pointer rounded-t-lg hover:bg-gray-200">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <div class="flex-shrink-0 w-12 h-12">
                        <img
                            class="w-12 h-12 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                        />
                    </div>
                    <div class="mx-8">
                        <div class="text leading-5 font-medium text-blue-900 mb-1">Max Mustermann</div>
                        <div class="text leading-5 text-gray-500">@theovier</div>
                    </div>
                    <div class="mx-8">
                        <div class="text leading-5 text-blue-900 mb-1">Student</div>
                    </div>
                    <div class="ml-8 flex flex-col items-baseline">
                        <div class="leading-5 text-blue-900 ml-1 mb-1">421769</div>
                        <div class="flex items-center leading-5 text-gray-500">
                            <span class="mr-2 fa-stack text-xs" style="font-size: 0.63em;">
                                <i class="fas fa-circle text-green-500 fa-stack-2x"></i>
                                <i class="fas fa-check fa-stack-1x fa-inverse"></i>
                            </span>
                            <div>
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
        <div class="px-8 py-4 whitespace-no-wrap border-b border-gray-200 cursor-pointer hover:bg-gray-200">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <div class="flex-shrink-0 w-12 h-12">
                        <img
                            class="w-12 h-12 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                        />
                    </div>
                    <div class="mx-8">
                        <div class="text leading-5 font-medium text-blue-900 mb-1">Prof. Dr. Max Mustermann</div>
                        <div class="text leading-5 text-gray-500">@theovier</div>
                    </div>
                    <div class="mx-8">
                        <div class="text leading-5 text-blue-900 mb-1">Student</div>
                    </div>
                    <div class="ml-8 flex flex-col items-baseline">
                        <div class="leading-5 text-blue-900 ml-1 mb-1">1234567</div>
                        <div class="flex items-center leading-5 text-gray-500">
                            <span class="mr-2 fa-stack text-xs" style="font-size: 0.63em;">
                                <i class="fas fa-circle text-red-500 fa-stack-2x"></i>
                                <i class="fas fa-times fa-stack-1x fa-inverse"></i>
                            </span>
                            <div>
                                Exmatriculated
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex">
                    <i class="fas fa-chevron-right text-gray-500" />
                </div>
            </div>
        </div>
        <div class="px-8 py-4 whitespace-no-wrap border-b border-gray-200 cursor-pointer hover:bg-gray-200">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <div class="flex-shrink-0 w-12 h-12">
                        <img
                            class="w-12 h-12 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                        />
                    </div>
                    <div class="mx-8">
                        <div class="text leading-5 font-medium text-blue-900 mb-1">Max Mustermann</div>
                        <div class="text leading-5 text-gray-500">@theovier</div>
                    </div>
                    <div class="mx-8">
                        <div class="text leading-5 text-blue-900 mb-1">Lecturer</div>
                    </div>
                </div>
                <div class="flex">
                    <i class="fas fa-chevron-right text-gray-500" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import UserManagement from "../api/UserManagement";
    import User_List from "../api/api_models/user_management/User_List";
    import { Role } from "../entities/Role";
    import Admin from "../api/api_models/user_management/Admin";
    import { ref } from "vue";
    import Lecturer from "../api/api_models/user_management/Lecturer";
    import Student from "../api/api_models/user_management/Student";
    import router from "../router";
    import GenericResponseHandler from "@/use/GenericResponseHandler";

    export default {
        name: "AccountList",
        async setup() {
            const userManagement: UserManagement = new UserManagement();
            const roles = Object.values(Role).filter((e) => e != Role.NONE);

            let usersByRole = ref({} as User_List);

            const genericResponseHandler = new GenericResponseHandler();
            const response = await userManagement.getAllUsers();
            const result = genericResponseHandler.handleReponse(response);

            usersByRole.value = result;

            function editAccount(username: string) {
                router.push({ path: "/editAccount/" + username });
            }

            return {
                roles,
                usersByRole,
                editAccount,
            };
        },
    };
</script>
