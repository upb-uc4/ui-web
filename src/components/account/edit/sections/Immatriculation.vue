<template>
    <div class="w-full">
        <label class="input-label-tmp">Immatriculation History</label>
        <div class="w-full">
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
