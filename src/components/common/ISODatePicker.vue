<template>
    <label class="block input-label">{{ title }}</label>
    <div class="space-y-2">
        <date-picker v-model:date="myDate" :id-prefix="idPrefix" :disabled="disabled" />
        <time-picker v-model:time="myTime" :id-prefix="idPrefix" :disabled="disabled" />
    </div>
</template>

<script lang="ts">
    import DatePicker from "@/components/common/DatePicker.vue";
    import TimePicker from "@/components/common/TimePicker.vue";
    import numberZeroPad from "@/use/helpers/NumberToZeroPaddedString";
    import { ref, watch } from "vue";

    export default {
        name: "ISODatePicker",
        components: {
            DatePicker,
            TimePicker,
        },
        props: {
            isoDate: {
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
            title: {
                type: String,
                required: false,
                default: "Pick a Date",
            },
        },
        emits: ["update:iso-date"],
        setup(props: any, { emit }: any) {
            const myIsoDate = ref(props.isoDate);

            const myDate = ref("");
            const myTime = ref("");

            if (props.isoDate) {
                const dateObject = new Date(myIsoDate.value);
                const paddedMonth = numberZeroPad(dateObject.getMonth());
                const paddedDay = numberZeroPad(dateObject.getDay());
                myDate.value = `${dateObject.getFullYear()}-${paddedMonth}-${paddedDay}`;
                const paddedHours = numberZeroPad(dateObject.getHours());
                const paddedMinutes = numberZeroPad(dateObject.getMinutes());
                myTime.value = `${paddedHours}:${paddedMinutes}`;
            }

            watch([myDate, myTime], () => {
                const newDate = new Date(`${myDate.value}T${myTime.value}:00`);
                if (newDate.toLocaleString() != "Invalid Date") {
                    emit("update:iso-date", newDate.toISOString());
                }
            });

            return {
                myDate,
                myTime,
            };
        },
    };
</script>
