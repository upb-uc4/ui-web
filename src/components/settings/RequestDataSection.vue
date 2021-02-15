<template>
    <base-section title="Request Stored Data" subtitle="Place a request to retrieve and download all your data stored within the system.">
        <div class="lg:flex mb-6">
            <div v-if="busy" class="mx-auto">
                <loading-spinner />
            </div>
            <div v-else class="w-full">
                <div class="lg:flex w-full mb-6">
                    <div class="lg:w-1/2 w-full items-center">
                        <label class="input-label">Enrollment-ID Secret</label>
                        <input
                            id="enrollmentIdSecretSettings"
                            title="You will need this secret whenever you want to restore your study data after your account was deleted. Store it safely!"
                            :value="enrollmentIdSecret"
                            type="text"
                            class="w-full input-text"
                            readonly
                        />
                    </div>
                </div>
                <div v-if="!isPending">
                    <button id="requestData" class="btn w-48" @click="requestData">Request Data</button>
                </div>
                <div v-else>
                    <div v-if="gotTimestamp" class="flex flex-col w-full">
                        <div class="flex w-full space-x-4">
                            <input id="timestamp" disabled class="input-text-base" :value="timestamp" />
                            <button id="refreshRequest" class="btn-secondary" title="Refresh the requested data" @click="refresh">
                                <i class="inline fas fa-redo-alt p-2" />
                            </button>
                            <button id="deletePendingRequest" class="btn-secondary-remove" title="Delete your request" @click="deleteData">
                                <i class="inline fas fa-trash-alt p-2" />
                            </button>
                        </div>
                        <p class="text-xs text-gray-600 w-1/2 mt-2">
                            You have already requested your stored data. It can take up to 5 minutes until the data is ready. You can hit
                            the refresh button to check if the data is prepared.
                        </p>
                    </div>
                    <div v-else-if="gotData" class="flex">
                        <div
                            class="flex flex-col items-center border p-4 rounded-l-lg rounded-b-lg hover:bg-gray-400 cursor-pointer border-gray-500"
                            title="Download your data"
                        >
                            <a id="downloadData" class="ml-3 text-sm btn-blue-tertiary" :href="dataUrl" download="archive.zip">
                                <i class="inline fas fa-file-alt p-2 text-gray-700 text-5xl" />
                                <p class="text-gray-700">Your data</p>
                            </a>
                        </div>
                        <div
                            id="deleteData"
                            class="border-r border-t border-b border-gray-500 rounded-r-lg h-8 hover:bg-gray-400 cursor-pointer"
                            title="Delete your requested data locally"
                            @click="deleteData"
                        >
                            <i class="inline fas fa-times p-2 text-red-700 text-md" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </base-section>
</template>

<script lang="ts">
    import { onBeforeMount, ref } from "vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import ReportManagement from "@/api/ReportManagement";
    import { useStore } from "@/use/store/store";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import BaseSection from "@/components/common/section/BaseSection.vue";

    export default {
        name: "RequestDataSection",
        components: {
            LoadingSpinner,
            BaseSection,
        },
        setup() {
            const busy = ref(false);
            const isPending = ref(false);
            const gotTimestamp = ref(false);
            const gotData = ref(false);
            const timestamp = ref("");
            let data = {} as File;
            let dataUrl = ref("");

            const enrollmentIdSecret = ref("");

            onBeforeMount(async () => {
                enrollmentIdSecret.value = (await useStore().getters.user).enrollmentIdSecret;
            });

            async function requestData() {
                busy.value = true;
                const username = (await useStore().getters.user).username;
                const reportManagement = new ReportManagement();
                const response = await reportManagement.getArchive(username);

                const handler = new GenericResponseHandler("archive");
                const value = handler.handleResponse(response);

                if (typeof value === "string" && value != "") {
                    gotTimestamp.value = true;
                    isPending.value = true;
                    timestamp.value = new Date(value).toLocaleString();
                } else if (typeof value === "object" && value.size != 0) {
                    isPending.value = true;
                    gotData.value = true;
                    gotTimestamp.value = false;
                    data = value;

                    let blob = new Blob([data], { type: "pem" });
                    dataUrl.value = URL.createObjectURL(blob);
                }
                busy.value = false;
            }

            async function refresh() {
                await requestData();
            }

            async function deleteData() {
                busy.value = true;
                const username = (await useStore().getters.user).username;
                const reportManagement = new ReportManagement();
                const response = await reportManagement.deleteArchive(username);

                const handler = new GenericResponseHandler("archive");
                const value = handler.handleResponse(response);

                if (value) {
                    isPending.value = false;
                    gotData.value = false;
                    gotTimestamp.value = false;
                    data = {} as File;
                }
                busy.value = false;
            }

            return {
                busy,
                isPending,
                gotTimestamp,
                gotData,
                timestamp,
                requestData,
                refresh,
                deleteData,
                dataUrl,
                enrollmentIdSecret,
            };
        },
    };
</script>
