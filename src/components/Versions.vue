<template>
    <div class="w-5/6">
        <div v-for="v in versionsArray" :key="v.name" class="flex h-10 my-2 py-8 px-4 justify-between bg-white rounded-lg">
            <div class="flex items-center">
                <i v-if="v.version == 'unavailable'" class="text-red-600 text-2xl fas fa-times-circle pr-4"></i>
                <i v-else class="text-green-500 text-2xl fas fa-check-circle pr-4"></i>
                <p class="text-lg">{{ v.name }}</p>
            </div>
            <div class="flex items-center">
                <a v-if="v.link != ''" :href="v.link" target="_blank" rel="noopener noreferrer">
                    <i v-if="v.version != 'unavailable'" class="text-grey-600 text-2xl pr-4 far fa-file-alt"></i>
                </a>
                <p class="text-lg rounded-lg px-3 py-1" :class="[v.version == 'unavailable' ? 'bg-red-200' : 'bg-blue-200']">
                    {{ v.version }}
                </p>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { useStore } from "../store/store";
    import AuthenticationManagement from "../api/AuthenticationManagement";
    import CourseManagement from "../api/CourseManagement";
    import UserManagement from "../api/UserManagement";
    import HyperledgerManagement from "../api/HyperledgerManagement";
    import HyperledgerCourseManagement from "../api/HyperledgerCourseManagement";
    export default {
        async setup() {
            let store = useStore();

            let frontEndVersion = "v" + process.env.VUE_APP_VERSION;

            let authenticationManagementVersion = await AuthenticationManagement.getVersion();
            let courseManagementVersion = await CourseManagement.getVersion();
            let userManagementVersion = await UserManagement.getVersion();
            let hyperledgerManagementVersion = await HyperledgerManagement.getVersion();
            let hyperledgerCourseManagementVersion = await HyperledgerCourseManagement.getVersion();

            interface version {
                name: String;
                version: String;
                link: String;
            }

            let versions: version[] = [];
            versions.push({
                name: "Frontend",
                version: frontEndVersion,
                link: "https://github.com/upb-uc4/ui-web/blob/" + frontEndVersion + "/CHANGELOG.md",
            });
            versions.push({
                name: "Authentication Management",
                version: authenticationManagementVersion,
                link: "",
            });
            versions.push({
                name: "Course Management",
                version: courseManagementVersion,
                link: "",
            });
            versions.push({
                name: "User Management",
                version: userManagementVersion,
                link: "",
            });
            versions.push({
                name: "Hyperledger Management",
                version: hyperledgerManagementVersion,
                link: "",
            });
            versions.push({
                name: "Hyperledger Course Management",
                version: hyperledgerCourseManagementVersion,
                link: "",
            });

            let versionsArray = Array.from(versions);
            return {
                versionsArray,
            };
        },
    };
</script>
