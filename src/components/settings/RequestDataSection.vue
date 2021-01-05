<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <div class="flex mb-2 align-baseline">
                    <label class="block text-gray-700 text-lg font-medium">Request Stored Data</label>
                </div>
                <label class="block text-gray-600">
                    Place a request to retrieve and download all your data stored within the system.
                </label>
            </div>

            <div class="w-full lg:w-2/3">
                <div class="lg:flex mb-6">
                    <div v-if="busy" class="mx-auto">
                        <loading-spinner />
                    </div>
                    <div v-else class="w-full">
                        <div v-if="!isPending">
                            <button id="requestData" class="btn btn-blue-primary w-48" @click="requestData">Request Data</button>
                        </div>
                        <div v-else>
                            <div v-if="gotTimestamp" class="flex flex-col w-full">
                                <div class="flex w-full">
                                    <input id="timestamp" disabled class="form-input input-text w-1/2" :value="timestamp" />
                                    <button
                                        id="refreshData"
                                        class="btn btn-icon-blue ml-8"
                                        title="Refresh the requested data"
                                        @click="refresh"
                                    >
                                        <i class="inline fas fa-redo-alt p-2" />
                                    </button>
                                </div>
                                <p class="text-xs text-gray-600 w-1/4 mt-2">
                                    You have already requested your stored data. It can take up to 5 minutes until the data is ready. You
                                    can hit the refresh button to check if the data is prepared.
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
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { onBeforeMount, ref } from "vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import ReportManagement from "@/api/ReportManagement";
    import { useStore } from "@/use/store/store";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";

    export default {
        name: "RequestDataSection",
        components: { LoadingSpinner },
        setup() {
            const busy = ref(false);
            const isPending = ref(false);
            const gotTimestamp = ref(false);
            const gotData = ref(false);
            const timestamp = ref("");
            let data = {} as File;
            let dataUrl = ref("");

            async function requestData() {
                const username = (await useStore().getters.user).username;
                const reportManagement = new ReportManagement();
                const response = await reportManagement.getArchive(username);

                const handler = new GenericResponseHandler("archive");
                const value = handler.handleResponse(response);

                if (typeof value === "string" && value != "") {
                    gotTimestamp.value = true;
                    isPending.value = true;
                    timestamp.value = new Date(value).toString();
                } else if (typeof value === "object" && Object.keys(value).length != 0) {
                    isPending.value = true;
                    gotData.value = true;
                    gotTimestamp.value = false;
                    data = value;

                    let blob = new Blob([data], { type: "pem" });
                    dataUrl.value = URL.createObjectURL(blob);
                }
            }

            async function refresh() {
                await requestData();
            }

            async function deleteData() {
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
            };
        },
    };
</script>
