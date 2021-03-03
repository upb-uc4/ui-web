<template>
    <label class="block input-label">{{ title }}</label>
    <input v-if="viewMode" class="w-full form-input input-text" disabled :value="createDateDisplayString(myIsoDate)" />
    <div v-else class="space-y-2">
        <date-picker v-model:date="myDate" :id-prefix="idPrefix" :disabled="disabled" />
        <time-picker v-model:time="myTime" :id-prefix="idPrefix" :disabled="disabled" />
    </div>
</template>

<script lang="ts">
    import DatePicker from "@/components/common/DatePicker.vue";
    import TimePicker from "@/components/common/TimePicker.vue";
    import { dateFormatOptions } from "@/use/helpers/DateFormatOptions";
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
            viewMode: {
                type: Boolean,
                default: false,
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

            function createDateDisplayString(date: string): string {
                return new Date(date).toLocaleString("en-GB", dateFormatOptions);
            }

            return {
                myDate,
                myTime,
                myIsoDate,
                createDateDisplayString,
            };
        },
    };
</script>
