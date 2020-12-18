<template>
    <div v-if="busy">
        <loading-spinner />
    </div>
    <div v-else class="w-full">
        <div v-for="v in versions" :key="v.name" class="flex justify-between px-4 py-8 my-2 bg-white rounded-lg">
            <div class="flex items-center">
                <i v-if="v.version == 'unavailable'" class="pr-4 text-2xl text-red-600 fas fa-times-circle"></i>
                <i v-else class="pr-4 text-2xl text-green-500 fas fa-check-circle"></i>
                <p class="text-lg">{{ v.name }}</p>
            </div>
            <div class="flex items-start w-1/4">
                <a v-if="v.link != ''" :href="v.link" target="_blank" rel="noopener noreferrer">
                    <i v-if="v.version != 'unavailable'" class="pr-4 text-2xl text-grey-600 far fa-file-alt"></i>
                </a>
                <div class="flex flex-col w-full">
                    <p
                        class="px-3 mb-1 text-lg rounded-lg w-full text-center"
                        :class="[v.version == 'unavailable' || v.version == 'endpoint broken' ? 'bg-red-200' : 'bg-blue-200']"
                    >
                        {{ "Service: " + v.version }}
                    </p>
                    <p
                        v-if="v.hlVersions"
                        class="px-3 mb-1 text-lg rounded-lg w-full text-center"
                        :class="[
                            v.hlVersions.hlfApiVersion == 'unavailable' || v.hlVersions.hlfApiVersion == 'endpoint broken'
                                ? 'bg-red-200'
                                : 'bg-blue-200',
                        ]"
                    >
                        {{ "HLF API: " + v.hlVersions.hlfApiVersion }}
                    </p>
                    <p
                        v-if="v.hlVersions"
                        class="px-3 mb-1 text-lg rounded-lg w-full text-center"
                        :class="[
                            v.hlVersions.chaincodeVersion == 'unavailable' || v.hlVersions.chaincodeVersion == 'endpoint broken'
                                ? 'bg-red-200'
                                : 'bg-blue-200',
                        ]"
                    >
                        {{ "CC: " + v.hlVersions.chaincodeVersion }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { ref, onBeforeMount } from "vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import { version, getVersions } from "@/use/helpers/Versions";

    export default {
        components: {
            LoadingSpinner,
        },

        emits: ["versions"],
        setup(props: any, { emit }: any) {
            let busy = ref(false);

            let versions = ref([] as version[]);

            onBeforeMount(async () => {
                await getBackendVersions();
            });

            async function getBackendVersions() {
                busy.value = true;
                versions.value = await getVersions();
                emit("versions", versions.value);
                busy.value = false;
            }

            return {
                versions,
                busy,
            };
        },
    };
</script>
