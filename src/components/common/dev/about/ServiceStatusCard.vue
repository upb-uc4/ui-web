<template>
    <div class="w-full sm:w-56 rounded-md border-gray-200 dark:border-normalgray-700 border h-32 p-4 mx-auto md:mx-0">
        <div class="flex justify-between">
            <div class="font-medium text-lg dark:text-gray-300">{{ title }}</div>
            <div>
                <img v-if="isLoading" src="@/assets/loading-spinner-alt.svg" alt="loading-spinner" class="w-6 h-6" />
                <i v-else-if="isServiceUnreachable" class="text-xl text-red-500 fas fa-times-circle" />
                <i v-else class="text-xl text-green-500 dark:text-green-600 fas fa-check-circle" />
            </div>
        </div>
        <div class="text-sm text-gray-700 dark:text-gray-500">
            <div v-if="isLoading">
                <div>Checking Version...</div>
            </div>
            <div v-else-if="isServiceUnreachable">
                <span class="navigation-link">Version not available</span>
                <div>Unreachable</div>
            </div>
            <div v-else>
                <a :href="changelogURL" class="block navigation-link">Version {{ version }}</a>
                <div v-if="hasHyperledgerVersion" class="mb-2 text-xs text-gray-500">
                    <span>HLF-API {{ hyperledgerVersion }}</span>
                    <div v-if="chaincodeVersion" class="inline">
                        ⋅ <span>CC {{ chaincodeVersion }}</span>
                    </div>
                </div>
                <div class="dark:text-gray-500">Active</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, onBeforeMount, ref } from "vue";
    import { HyperledgerVersion } from "@/api/helpers/models/ServiceVersion";
    export default {
        name: "ServiceStatusCard",
        props: {
            title: {
                type: String,
                required: true,
            },
            getVersion: {
                type: Promise,
                required: true,
            },
            getHyperledgerVersion: {
                type: Promise,
                default: null,
            },
        },
        setup(props: any) {
            const isLoading = ref(true);
            const isServiceUnreachable = ref(false);
            const version = ref("0.0.0");
            const changelogURL = ref("/");
            const hyperledgerVersion = ref();
            const chaincodeVersion = ref();

            const lagomNoChaincodeResponse = "Service does not use chaincode";
            const hasHyperledgerVersion = computed(() => props.getHyperledgerVersion !== null);

            onBeforeMount(() => {
                props.getVersion
                    .then((versionResult: any) => {
                        if (!((versionResult.version as string) == "unavailable")) {
                            version.value = versionResult.version.replace("v", "");
                            changelogURL.value = versionResult.changelogURL;
                        } else {
                            isServiceUnreachable.value = true;
                        }
                    })
                    .catch(() => (isServiceUnreachable.value = true))
                    .finally(() => (isLoading.value = false));

                if (hasHyperledgerVersion.value) {
                    props.getHyperledgerVersion.then((version: HyperledgerVersion) => {
                        hyperledgerVersion.value = version.hlfApiVersion;
                        if (version.chaincodeVersion !== lagomNoChaincodeResponse) {
                            chaincodeVersion.value = version.chaincodeVersion;
                        }
                    });
                }
            });

            return { isLoading, isServiceUnreachable, version, changelogURL, hasHyperledgerVersion, hyperledgerVersion, chaincodeVersion };
        },
    };
</script>
