<template>
    <div class="space-y-1.5">
        <div class="flex items-center space-x-6">
            <div class="bg-blue-700 dark:bg-lime-500 rounded-full h-8 w-8" />
            <div class="flex items-center">
                <label class="text-lg input-label">{{ semester }}</label>
                <a
                    v-if="!(isAdminView || isLoading)"
                    id="downloadCertificate"
                    title="Download Certificate of Enrollment"
                    :href="certificateDownloadURL"
                    class="text-xs navigation-link-gray ml-2 mb-1"
                    :download="`${semester}.pdf`"
                >
                    <i class="fas fa-download"></i>
                </a>
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
    import { onBeforeMount, ref } from "vue";

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

            onBeforeMount(async () => {
                if (!props.isAdminView) {
                    isLoading.value = true;
                    await loadCertificate();
                    isLoading.value = false;
                }
            });

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

            return {
                certificateDownloadURL,
                isLoading,
            };
        },
    };
</script>
