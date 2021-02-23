<template>
    <div :id="`${idPrefix}time`" class="flex space-x-4 items-center">
        <div class="w-1/2">
            <selection
                :id="`${idPrefix}hour`"
                v-model:selection="selectedHour"
                :disabled="disabled"
                :elements="selectableTimes[0]"
                placeholder="Hour"
            />
        </div>
        <label class="input-label">:</label>
        <div class="w-1/2">
            <selection
                :id="`${idPrefix}minutes`"
                v-model:selection="selectedMinutes"
                :disabled="disabled"
                :elements="selectableTimes[1]"
                placeholder="Minutes"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { days, months } from "@/entities/Month";
    import Select from "@/components/common/Select.vue";
    import { ref, watch } from "vue";

    export default {
        name: "DatePicker",
        components: {
            Selection: Select,
        },
        props: {
            time: {
                type: String,
                required: true,
            },
            idPrefix: {
                type: String,
                default: "",
            },
            disabled: {
                type: Boolean,
                default: false,
            },
        },
        emits: ["update:time"],
        setup(props: any, { emit }: any) {
            const selectedHour = ref("");
            const selectedMinutes = ref("");
            const selectableTimes = ref([] as any[]);
            let tmp = [];
            for (let i = 0; i < 24; i++) {
                tmp.push(i < 10 ? `0${i}` : `${i}`);
            }
            selectableTimes.value.push(tmp);
            tmp = [];
            for (let i = 0; i < 59; i++) {
                tmp.push(i < 10 ? `0${i}` : `${i}`);
            }
            selectableTimes.value.push(tmp);

            if (props.time) {
                let times = props.time.split(":");
                selectedHour.value = times[0];
                selectedMinutes.value = times[1];
            }

            watch([selectedHour, selectedMinutes], ([hour, minutes]) => {
                emit("update:time", `${selectedHour.value}:${selectedMinutes.value}`);
            });

            return {
                days,
                months,
                selectedHour,
                selectedMinutes,
                selectableTimes,
            };
        },
    };
</script>
