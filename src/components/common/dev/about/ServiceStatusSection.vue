<template>
    <div class="w-full mb-6 text-justify">
        <h2 class="block text-gray-800 text-lg font-medium mb-1">Server Status</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <service-status-card title="Frontend" :get-version="getFrontendVersion" />
            <service-status-card title="Authentication" :get-version="AuthenticationManagement.getVersion()" />
            <service-status-card title="Course" :get-version="CertificateManagement.getVersion()" />
            <service-status-card title="User" :get-version="UserManagement.getVersion()" />
            <service-status-card title="Matriculation" :get-version="MatriculationManagement.getVersion()" />
            <service-status-card title="Certificate" :get-version="CertificateManagement.getVersion()" />
            <service-status-card title="Exam Regulation" :get-version="ExaminationRegulationManagement.getVersion()" />
        </div>
    </div>
</template>

<script lang="ts">
    import ServiceStatusCard from "@/components/common/dev/about/ServiceStatusCard.vue";
    import AuthenticationManagement from "@/api/AuthenticationManagement";
    import CourseManagement from "@/api/CourseManagement";
    import UserManagement from "@/api/UserManagement";
    import MatriculationManagement from "@/api/MatriculationManagement";
    import CertificateManagement from "@/api/CertificateManagement";
    import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";

    export default {
        name: "ServiceStatusSection",
        components: {
            ServiceStatusCard,
        },
        setup() {
            const getFrontendVersion = new Promise(function (resolve) {
                //trivial promise which always instantly resolves
                resolve(process.env.VUE_APP_VERSION);
            });

            return {
                getFrontendVersion,
                AuthenticationManagement,
                CourseManagement,
                UserManagement,
                MatriculationManagement,
                CertificateManagement,
                ExaminationRegulationManagement,
            };
        },
    };
</script>
