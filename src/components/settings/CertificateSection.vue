<template>
    <BaseSection title="Certificates" subtitle="Download your personal University Credits 4.0 security certificate.">
        <div class="space-y-6">
            <div v-if="isLoading">
                <img src="@/assets/loading-spinner-alt.svg" alt="loading" class="h-16 w-16" />
            </div>
            <div v-else class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="w-full">
                    <div v-if="hasCertificate">
                        <div class="flex space-x-4">
                            <label class="input-label">Security Certificate</label>
                            <a
                                id="downloadCertificate"
                                :href="certificateDownloadURL"
                                class="text-sm navigation-link"
                                download="certificate.pem"
                            >
                                Download
                            </a>
                        </div>
                        <textarea id="certificate" v-model="certificate" rows="19" readonly class="w-full input-text font-mono" />
                    </div>
                    <div v-else>
                        <span class="block text-sm text-gray-500"> There are currently no certificates associated with your account. </span>
                        <button id="createCertificate" class="mt-4 w-48 btn" @click="createCertificate()">Create Certificate</button>
                    </div>
                </div>
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import { onBeforeMount, ref } from "vue";
    import { useStore } from "@/use/store/store";

    export default {
        name: "CertificateSection",
        components: {
            BaseSection,
        },
        setup() {
            const store = useStore();
            const isLoading = ref(true);
            const hasCertificate = ref(false);
            const certificate = ref("");
            const certificateDownloadURL = ref("");

            onBeforeMount(() => {
                store.getters.hasCertificate
                    .then((alreadyHasCertificate) => (hasCertificate.value = alreadyHasCertificate))
                    .then(() => {
                        if (hasCertificate.value) {
                            loadCertificate();
                        }
                    })
                    .finally(() => (isLoading.value = false));
            });

            async function loadCertificate() {
                return store.getters
                    .certificate()
                    .then((certificateObject) => (certificate.value = certificateObject.certificate))
                    .then(() => createCertificateDownloadURL(certificate.value));
            }

            function createCertificateDownloadURL(certificateContent: string) {
                let certificateFile = new Blob([certificateContent], { type: "pem" });
                certificateDownloadURL.value = URL.createObjectURL(certificateFile);
            }

            function createCertificate() {
                //todo: when someone clicks and then aborts the key modal the promise won't reject/resolve resulting in indefinitely loading?!
                isLoading.value = true;
                loadCertificate().finally(() => {
                    isLoading.value = false;
                });
            }

            return {
                isLoading,
                hasCertificate,
                createCertificate,
                certificate,
                certificateDownloadURL,
            };
        },
    };
</script>
