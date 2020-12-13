<template>
    <div class="w-full relative flex items-center">
        <i class="absolute left-3 fas fa-search text-gray-600" />
        <input id="message" v-model="filterMessage" class="w-full px-10 input-text-tmp" type="search" :placeholder="placeholder" />
        <button id="refresh" class="-ml-8 my-1 focus:outline-none" title="Refresh" @click="refresh">
            <i class="inline fas fa-redo-alt text-gray-600 hover:text-gray-700" />
        </button>
    </div>
</template>

<script lang="ts">
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import { ref } from "vue";

    export default {
        name: "SeachBar",
        props: {
            message: {
                type: String,
                required: true,
            },
            placeholder: {
                type: String,
                default: "Filter",
            },
        },
        emits: ["refresh", "update:message"],
        setup(props: any, { emit }: any) {
            let recentlyRefreshed = ref(false);
            let filterMessage = ref("");

            function preventRefresh() {
                recentlyRefreshed.value = true;
                setTimeout(() => {
                    recentlyRefreshed.value = false;
                }, 100);
            }

            function refresh() {
                if (!recentlyRefreshed.value) {
                    emit("refresh");
                    preventRefresh();
                }
            }

            return {
                filterMessage: useModelWrapper(props, emit, "message"),
                refresh,
            };
        },
    };
</script>
