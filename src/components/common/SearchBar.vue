<template>
    <div class="w-full relative text-gray-600 flex">
        <button id="refresh" class="items-center mb-3" title="Search" @click="refresh">
            <i class="fas fa-search ml-3 absolute text-gray-600 hover:text-gray-700" />
        </button>
        <input
            id="message"
            v-model="filterMessage"
            autocomplete="chrome-off"
            class="w-full border-2 border-gray-300 bg-white h-12 px-12 rounded-lg focus:outline-none"
            type="search"
            placeholder="Filter"
        />
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
