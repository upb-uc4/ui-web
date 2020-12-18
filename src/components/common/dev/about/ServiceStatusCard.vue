<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div class="w-56 rounded-md border-gray-200 border h-32 p-4 mx-auto md:mx-0">
            <div class="flex justify-between">
                <div class="font-medium text-lg">{{ title }}</div>
                <div>
                    <img v-if="isLoading" src="../../../../assets/loading-spinner-alt.svg" class="w-6 h-6" />
                    <i v-else-if="isServiceUnreachable" class="text-xl text-red-500 fas fa-times-circle" />
                    <i v-else class="text-xl text-green-500 fas fa-check-circle" />
                </div>
            </div>
            <div class="text-sm text-gray-700">
                <div v-if="isLoading">
                    <div>Checking Version...</div>
                </div>
                <div v-else-if="isServiceUnreachable">
                    <a href="" class="navigation-link">Version not available</a>
                    <div>Unreachable</div>
                </div>
                <div v-else>
                    <a href="" class="navigation-link">Version {{ version }}</a>
                    <div>Active</div>
                </div>
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

            //todo link to read me
            //todo change version promise api?

            onBeforeMount(() => {
                props.getVersion
                    .then((versionResult) => (version.value = versionResult))
                    .catch(() => (isServiceUnreachable.value = true)) //todo adjust getVersion and all corresponding tests or check in then for "unavailable"
                    .finally(() => (isLoading.value = false));
            });

            return { isLoading, isServiceUnreachable, version };
        },
    };
</script>
