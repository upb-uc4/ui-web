<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <div class="flex mb-2 align-baseline">
                    <label class="block text-gray-700 text-lg font-medium">Certificate</label>
                </div>
                <label class="block text-gray-600"> Here, you can see and download your personal UC4 security certificate. </label>
            </div>

            <div class="w-full lg:w-2/3">
                <div class="lg:flex mb-6">
                    <div class="lg:w-1/2 w-full mb-6 lg:mb-0 flex flex-col lg:mr-16">
                        <div v-if="!busy" class="w-full">
                            <div class="flex items-baseline w-full">
                                <label class="text-gray-700 text-md font-medium mb-3">Certificate</label>
                                <a
                                    id="downloadCertificate"
                                    class="ml-3 text-sm btn-blue-tertiary"
                                    :href="certificateBlobURL"
                                    download="certificate.pem"
                                >Download</a>
                            </div>
                            <textarea
                                id="certificate"
                                v-model="certificate"
                                class="form-input input-text text-xs w-full"
                                rows="15"
                                readonly
                            />
                        </div>
                        <loading-spinner v-else />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { onBeforeMount, ref } from "vue";
    import { useStore } from "@/use/store/store";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";

    export default {
        name: "CertificateSection",
        components: { LoadingSpinner },
        setup() {
            const busy = ref(false);
            const certificate = ref("");
            let certificateBlobURL = ref("");

            onBeforeMount(async () => {
                await getCertificate();
                let blob = new Blob([certificate.value], { type: "pem" });
                certificateBlobURL.value = URL.createObjectURL(blob);
            });

            async function getCertificate() {
                busy.value = true;
                const store = useStore();
                certificate.value = (await store.getters.certificate).certificate;
                busy.value = false;
            }

            return {
                busy,
                certificate,
                certificateBlobURL,
            };
        },
    };
</script>
