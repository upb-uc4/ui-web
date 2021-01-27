<template>
    <div class="w-full mb-6 text-justify">
        <h2 class="block text-gray-800 dark:text-gray-300 text-lg font-medium mb-1">Server Status</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <service-status-card title="Frontend" :get-version="getFrontendVersion" />
            <service-status-card title="Authentication" :get-version="getAuthenticationVersion" />
            <service-status-card title="Course" :get-version="getCourseVersion" />
            <service-status-card title="User" :get-version="getUserVersion" />
            <service-status-card title="Matriculation" :get-version="getMatriculationVersion" />
            <service-status-card title="Certificate" :get-version="getCertificateVersion" />
            <service-status-card title="Exam Regulation" :get-version="getExaminationRegulationVersion" />
            <service-status-card title="Configuration" :get-version="getConfigurationVersion" />
            <service-status-card title="Report" :get-version="getReportVersion" />
            <service-status-card title="Group" :get-version="getGroupVersion" />
            <service-status-card title="Admission" :get-version="getAdmissionVersion" />
            <service-status-card title="Operation" :get-version="getOperationVersion" />
            <service-status-card title="Hyperledger" :get-version="getNetworkVersion" />
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
    import GroupManagement from "@/api/GroupManagement";
    import OperationManagement from "@/api/OperationManagement";
    import HyperledgerNetworkVersion from "@/api/api_models/configuration_management/HyperledgerVersion";

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

            const getNetworkVersion = ConfigurationManagement.getHyperledgerNetworkVersion().then(
                (versionObject: HyperledgerNetworkVersion) => {
                    const networkVersion = versionObject.networkVersion;
                    return new Promise<ServiceVersion>(function (resolve) {
                        //trivial promise which always instantly resolves
                        const serviceVersion: ServiceVersion = {
                            version: networkVersion,
                            changelogURL: `https://github.com/upb-uc4/hlf-network/blob/${networkVersion}/CHANGELOG.md`,
                        };
                        resolve(serviceVersion);
                    });
                }
            );

            const getAdmissionVersion = new AdmissionManagement().getServiceVersion();
            const getAuthenticationVersion = new AuthenticationManagement().getServiceVersion();
            const getCertificateVersion = new CertificateManagement().getServiceVersion();
            const getConfigurationVersion = new ConfigurationManagement().getServiceVersion();
            const getCourseVersion = new CourseManagement().getServiceVersion();
            const getExaminationRegulationVersion = new ExaminationRegulationManagement().getServiceVersion();
            const getGroupVersion = new GroupManagement().getServiceVersion();
            const getMatriculationVersion = new MatriculationManagement().getServiceVersion();
            const getOperationVersion = new OperationManagement().getServiceVersion();
            const getReportVersion = new ReportManagement().getServiceVersion();
            const getUserVersion = new UserManagement().getServiceVersion();

            //todo hlf + scala version

            return {
                getFrontendVersion,
                getAdmissionVersion,
                getAuthenticationVersion,
                getCertificateVersion,
                getConfigurationVersion,
                getCourseVersion,
                getExaminationRegulationVersion,
                getGroupVersion,
                getMatriculationVersion,
                getOperationVersion,
                getReportVersion,
                getUserVersion,
                getNetworkVersion,
            };
        },
    };
</script>
