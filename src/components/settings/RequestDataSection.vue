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
                            <button class="btn btn-blue-primary w-48" @click="requestData">Request Data</button>
                        </div>
                        <div v-else>
                            <div v-if="gotTimestamp" class="flex flex-col w-full">
                                <div class="flex w-full">
                                    <input disabled class="form-input input-text w-1/4" :value="timestamp" />
                                    <button class="btn btn-icon-blue ml-8" title="Refresh the requested data" @click="refresh">
                                        <i class="inline fas fa-redo-alt p-2" />
                                    </button>
                                </div>
                                <p class="text-xs text-gray-600 w-1/4 mt-2">
                                    You have already requested your stored data. It can last up to 5 minutes until the data is ready. You
                                    can hit the refresh button to check if the data already arrived
                                </p>
                            </div>
                            <div v-else-if="gotData" class="flex">
                                <div
                                    class="flex flex-col items-center border p-4 rounded-l-lg rounded-b-lg hover:bg-gray-400 cursor-pointer border-gray-500"
                                    title="Download your data"
                                    @click="downloadData"
                                >
                                    <i class="inline fas fa-file-alt p-2 text-gray-700 text-5xl" />
                                    <p class="text-gray-700">Your data</p>
                                </div>
                                <div
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

    export default {
        name: "RequestDataSection",
        components: { LoadingSpinner },
        setup() {
            const busy = ref(false);
            const isPending = ref(false);
            const gotTimestamp = ref(false);
            const gotData = ref(false);
            const timestamp = ref("");

            onBeforeMount(async () => {
                await requestData();
            });

            async function requestData() {
                //MOCKDATA
                isPending.value = false;
                gotTimestamp.value = false;
                gotData.value = false;
                timestamp.value = "11/12/2020 15:00 GMT";
                //TODO
            }

            function refresh() {
                //TODO
            }

            function downloadData() {
                //TODO
            }

            function deleteData() {
                //TODO
            }

            return {
                busy,
                isPending,
                gotTimestamp,
                gotData,
                timestamp,
                requestData,
                refresh,
                downloadData,
                deleteData,
            };
        },
    };
</script>
