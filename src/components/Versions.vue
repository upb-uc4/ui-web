<template>
    <div v-if="busy">
        <loading-spinner />
    </div>
    <div v-else class="w-full">
        <div v-for="v in versions" :key="v.name" class="flex justify-between h-10 px-4 py-8 my-2 bg-white rounded-lg">
            <div class="flex items-center">
                <i v-if="v.version == 'unavailable'" class="pr-4 text-2xl text-red-600 fas fa-times-circle"></i>
                <i v-else class="pr-4 text-2xl text-green-500 fas fa-check-circle"></i>
                <p class="text-lg">{{ v.name }}</p>
            </div>
            <div class="flex items-center">
                <a v-if="v.link != ''" :href="v.link" target="_blank" rel="noopener noreferrer">
                    <i v-if="v.version != 'unavailable'" class="pr-4 text-2xl text-grey-600 far fa-file-alt"></i>
                </a>
                <p class="px-3 py-1 text-lg rounded-lg" :class="[v.version == 'unavailable' ? 'bg-red-200' : 'bg-blue-200']">
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
    import { ref, onBeforeMount } from "vue";
    import LoadingSpinner from "@/components/loading/Spinner.vue";

    import MatriculationManagement from "@/api/MatriculationManagement";

    export default {
        components: {
            LoadingSpinner,
        },

        emits: ["versions"],
        setup(props: any, { emit }: any) {
            let busy = ref(false);

            interface version {
                name: String;
                version: String;
                link: String;
            }

            let versions: version[] = [];
            onBeforeMount(() => {
                getVersions();
            });

            async function getVersions() {
                busy.value = true;
                let store = useStore();

                let frontEndVersion = "v" + process.env.VUE_APP_VERSION;

                let authenticationManagementVersion = await AuthenticationManagement.getVersion();
                let courseManagementVersion = await CourseManagement.getVersion();
                let userManagementVersion = await UserManagement.getVersion();
                let hyperledgerManagementVersion = await HyperledgerManagement.getVersion();
                let hyperledgerCourseManagementVersion = await HyperledgerCourseManagement.getVersion();
                let matriculationManagementVersion = await MatriculationManagement.getVersion();

                versions.push({
                    name: "Frontend",
                    version: frontEndVersion,
                    link: "https://github.com/upb-uc4/ui-web/blob/" + frontEndVersion + "/CHANGELOG.md",
                });
                versions.push({
                    name: "Authentication Management",
                    version: authenticationManagementVersion,
                    link:
                        "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
                        "authentication-" +
                        authenticationManagementVersion +
                        "/product_code/lagom/authentication_service/CHANGELOG.md",
                });
                versions.push({
                    name: "Course Management",
                    version: courseManagementVersion,
                    link:
                        "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
                        "course-" +
                        courseManagementVersion +
                        "/product_code/lagom/course_service/CHANGELOG.md",
                });
                versions.push({
                    name: "User Management",
                    version: userManagementVersion,
                    link:
                        "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
                        "user-" +
                        userManagementVersion +
                        "/product_code/lagom/user_service/CHANGELOG.md",
                });
                versions.push({
                    name: "Hyperledger Management",
                    version: hyperledgerManagementVersion,
                    link:
                        "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
                        "hyperledger-" +
                        hyperledgerManagementVersion +
                        "/product_code/lagom/hyperledger_service/CHANGELOG.md",
                });
                versions.push({
                    name: "Hyperledger Course Management",
                    version: hyperledgerCourseManagementVersion,
                    link:
                        "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
                        "hlcourse-" +
                        hyperledgerCourseManagementVersion +
                        "/product_code/lagom/hl_course_service/CHANGELOG.md",
                });
                versions.push({
                    name: "Matriculation Management",
                    version: matriculationManagementVersion,
                    link:
                        "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
                        "matriculation-" +
                        matriculationManagementVersion +
                        "/product_code/lagom/hl_course_service/CHANGELOG.md",
                });

                emit("versions", versions);
                busy.value = false;
            }

            return {
                versions,
                busy,
            };
        },
    };
</script>
