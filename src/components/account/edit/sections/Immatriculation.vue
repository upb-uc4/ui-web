<template>
    <div class="flex flex-col pl-2 mt-5">
        <label class="mb-3 text-sm font-medium text-gray-700">Immatriculation History</label>
        <div class="w-2/3">
            <immatriculation-history :key="refreshKey" v-model:busy="busy" :username="username" />
        </div>
        <div v-if="busy > 0">
            <loading-spinner />
        </div>
    </div>
</template>

<script lang="ts">
    import { ref } from "vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import ImmatriculationHistory from "@/components/common/immatriculation/ImmatriculationHistory.vue";
    export default {
        components: {
            LoadingSpinner,
            ImmatriculationHistory,
        },
        props: {
            username: {
                type: String,
                required: true,
            },
        },
        setup(props: any, { emit }: any) {
            let refreshKey = ref(false);
            let busy = ref(0);

            return {
                busy,
                refreshKey,
            };
        },
    };
</script>
