<template>
    <div class="space-y-1.5">
        <div class="flex items-center space-x-6">
            <div class="bg-blue-700 dark:bg-lime-500 rounded-full h-8 w-8" />
            <div class="flex items-center">
                <label class="text-lg input-label">{{ semester }}</label>
                <label
                    v-if="!(isAdminView || isLoading)"
                    id="downloadCertificate"
                    title="Download Certificate of Enrollment"
                    class="text-xs navigation-link-gray ml-2 mb-1"
                    @click="downloadCertificate()"
                >
                    <i class="fas fa-download"></i>
                </label>
                <img
                    v-else-if="isLoading"
                    src="@/assets/loading-spinner-alt.svg"
                    title="Fetching certificate..."
                    class="h-5 w-5 ml-2 mb-1"
                />
            </div>
        </div>
        <div class="ml-14 space-y-0.5">
            <div v-for="fieldOfStudy in fieldsOfStudy" :key="fieldOfStudy" class="text-sm text-gray-500">
                {{ fieldOfStudy }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import ReportManagement from "@/api/ReportManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import { useStore } from "@/use/store/store";
    import { ref } from "vue";

    export default {
        name: "ImmatriculationHistoryEntry",
        props: {
            semester: {
                type: String,
                required: true,
            },
            fieldsOfStudy: {
                type: Array,
                required: true,
            },
            isAdminView: {
                type: Boolean,
                default: false,
            },
        },
        setup(props: any) {
            const isLoading = ref(false);
            const store = useStore();
            const certificateDownloadURL = ref("");

            async function loadCertificate() {
                const reportManagement = new ReportManagement();
                const handler = new GenericResponseHandler("certificate");
                const response = await reportManagement.getCertificateOfEnrollment((await store.getters.user).username, props.semester);
                createCertificateDownloadURL(handler.handleResponse(response));
            }

            function createCertificateDownloadURL(certificateContent: File) {
                let certificateFile = new Blob([certificateContent], { type: "application/pdf" });
                certificateDownloadURL.value = URL.createObjectURL(certificateFile);
            }

            async function downloadCertificate() {
                isLoading.value = true;
                await loadCertificate();
                var fileLink = document.createElement("a");
                fileLink.href = certificateDownloadURL.value;
                fileLink.setAttribute("download", `${props.semester}.pdf`);

                document.body.appendChild(fileLink);
                fileLink.click();
                isLoading.value = false;
            }

            return {
                certificateDownloadURL,
                isLoading,
                downloadCertificate,
            };
        },
    };
</script>
