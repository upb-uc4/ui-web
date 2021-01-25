<template>
    <div class="w-full mb-6 text-justify">
        <h2 class="block text-gray-800 dark:text-gray-300 text-lg font-medium mb-1">Server Status</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <service-status-card title="Frontend" :get-version="getFrontendVersion" />
            <service-status-card title="Authentication" :get-version="AuthenticationManagement.getServiceVersion()" />
            <service-status-card title="Course" :get-version="CertificateManagement.getServiceVersion()" />
            <service-status-card title="User" :get-version="UserManagement.getServiceVersion()" />
            <service-status-card title="Matriculation" :get-version="MatriculationManagement.getServiceVersion()" />
            <service-status-card title="Certificate" :get-version="CertificateManagement.getServiceVersion()" />
            <service-status-card title="Exam Regulation" :get-version="ExaminationRegulationManagement.getServiceVersion()" />
            <service-status-card title="Configuration" :get-version="ConfigurationManagement.getServiceVersion()" />
            <service-status-card title="Report" :get-version="ReportManagement.getServiceVersion()" />
            <service-status-card title="Admission" :get-version="AdmissionManagement.getServiceVersion()" />
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
    import ServiceVersion from "@/api/helpers/models/ServiceVersion";
    import ConfigurationManagement from "@/api/ConfigurationManagement";
    import ReportManagement from "@/api/ReportManagement";
    import AdmissionManagement from "@/api/AdmissionManagement";

    export default {
        name: "ServiceStatusSection",
        components: {
            ServiceStatusCard,
        },
        setup() {
            const getFrontendVersion = new Promise<ServiceVersion>(function (resolve) {
                //trivial promise which always instantly resolves
                const version: ServiceVersion = {
                    version: process.env.VUE_APP_VERSION ? process.env.VUE_APP_VERSION : "not available",
                    changelogURL: `https://github.com/upb-uc4/ui-web/blob/v${process.env.VUE_APP_VERSION}/CHANGELOG.md`,
                };
                resolve(version);
            });

            return {
                getFrontendVersion,
                AuthenticationManagement,
                CourseManagement,
                UserManagement,
                MatriculationManagement,
                CertificateManagement,
                ExaminationRegulationManagement,
                ConfigurationManagement,
                ReportManagement,
                AdmissionManagement,
            };
        },
    };
</script>
