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
                <a :href="changelogURL" class="navigation-link">Version {{ version }}</a>
                <div class="dark:text-gray-500">Active</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { onBeforeMount, ref } from "vue";
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
        },
        setup(props: any) {
            const isLoading = ref(true);
            const isServiceUnreachable = ref(false);
            const version = ref("0.0.0");
            const changelogURL = ref("/");

            onBeforeMount(() => {
                props.getVersion
                    .then((versionResult: any) => {
                        version.value = versionResult.version.replace("v", "");
                        changelogURL.value = versionResult.changelogURL;
                    })
                    .catch(() => (isServiceUnreachable.value = true))
                    .finally(() => (isLoading.value = false));
            });

            return { isLoading, isServiceUnreachable, version, changelogURL };
        },
    };
</script>
